import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { Prisma, Product } from "@prisma/client";
import { PAGE_SIZE } from "constants/products";
import { getSession } from "next-auth/react";
import { ProductWithFav, ProductWithFavData } from "types/product";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const session = await getSession({ req });

    let products: ProductWithFavData[] = [];
    let count: number = -1;
    let filter: Prisma.ProductWhereInput = {};

    Object.keys(req.query).forEach((key) => {
      switch (key) {
        case "category":
          filter.category = {
            equals: req.query.category.toString(),
          };
          break;
        case "keyword":
          filter.name = {
            contains: req.query.keyword.toString(),
          };
          break;
        case "priceMax":
          filter.price = {
            lte: parseInt(req.query.priceMax.toString()),
          };
          break;
      }
    });

    if (req.query.priceMin) {
      filter.price["gte"] = req.query.priceMin
        ? parseInt(req.query.priceMin.toString())
        : 0;
    }

    const pageNum = !!req.query.pageIndex
      ? parseInt(req.query.pageIndex.toString())
      : 1;

    [count, products] = await client.$transaction([
      client.product.count({
        where: {
          ...filter,
        },
      }),
      client.product.findMany({
        take: PAGE_SIZE,
        skip: (pageNum - 1) * PAGE_SIZE,
        where: {
          ...filter,
        },
        include: {
          favlist: {
            where: {
              userId: session?.user?.id || -1,
            },
            select: {
              id: true,
              userId: true,
              productId: true,
            },
          },
        },
      }),
    ]);

    const maxPrice = Math.max(
      0,
      ...products.map((item: ProductWithFavData) => item.price)
    );

    const productWithFav = products.map((product) => {
      return {
        ...product,
        isFav: !!product.favlist.some(
          (fav) => fav.userId === session?.user?.id
        ),
      };
    });

    res.json({
      ok: true,
      products: productWithFav,
      count,
      maxPrice,
    });
  } else if (req.method === "POST") {
    const {
      body: { name, image, category, price, description },
    } = req;

    const products = await client.product.create({
      data: {
        name,
        image: image,
        category,
        price: Number(price),
        description,
      },
    });

    res.json({
      ok: true,
      products,
    });
  }
}

export default withHandler({
  methods: ["POST", "GET"],
  handler,
});
