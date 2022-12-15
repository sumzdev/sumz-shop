import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { id, name, image, category, price, description },
  } = req;

  const findNameProducts = await client.product.findMany({
    where: {
      name,
    },
  });
  if (findNameProducts.length !== 1 && findNameProducts[0].id !== id) {
    res.json({
      ok: false,
      error: "duplicate",
    });
  }

  const product = await client.product.update({
    where: {
      id,
    },
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

export default withHandler({
  methods: ["POST"],
  handler,
});
