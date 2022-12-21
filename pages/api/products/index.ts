import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { Prisma, Product } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    let products: Product[] = [];
    if (Object.keys(req.query).length === 0) {
      products = await client.product.findMany();
    } else {
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

      products = await client.product.findMany({
        where: {
          ...filter,
        },
      });
    }

    res.json({
      ok: true,
      products,
    });
  } else if (req.method === "POST") {
    const {
      body: { name, image, category, price, description },
    } = req;

    const product = await client.product.create({
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
      product,
    });
  }
}

export default withHandler({
  methods: ["POST", "GET"],
  handler,
});
