import withHandler, { ResponseType } from "@libs/server/withHandler";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const product = await client?.product.findMany();
  const keywords = product.map((v: Product) => v.name);

  res.json({
    ok: true,
    keywords,
  });
}

export default withHandler({
  methods: ["GET"],
  handler,
  isPrivate: true,
});
