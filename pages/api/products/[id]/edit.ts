import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id: queryId },
    body: { name, image, category, price, description },
  } = req;

  const id = parseInt(queryId.toString());

  const findNameProducts = await client.product.findMany({
    where: {
      name,
      NOT: {
        id,
      },
    },
  });

  if (findNameProducts.length > 0) {
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
