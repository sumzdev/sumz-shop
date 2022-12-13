import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;

  const product = await client?.product.findUnique({
    where: { id: Number(id?.toString()) },
  });

  res.json({
    ok: true,
    product,
  });
}

export default withHandler({
  methods: ["GET"],
  handler,
  isPrivate: true,
});
