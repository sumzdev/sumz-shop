import withHandler, { ResponseType } from "@libs/server/withHandler";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const product = await client?.product.findMany();

  const priceList = product.map((item: Product) => item.price);
  const maxPrice = Math.max(0, ...priceList);

  res.json({
    ok: true,
    maxPrice,
  });
}

export default withHandler({
  methods: ["GET"],
  handler,
  isPrivate: true,
});
