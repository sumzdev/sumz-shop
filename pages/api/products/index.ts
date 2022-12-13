import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany();

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
        image: "", //TODO: 이미지 업로드
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
  isPrivate: true,
});
