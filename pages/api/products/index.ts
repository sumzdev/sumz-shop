import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { Prisma, Product } from "@prisma/client";
import { PAGE_SIZE } from "constants/products";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    let products: Product[] = [];
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
      }),
    ]);

    res.json({
      ok: true,
      products,
      count,
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
