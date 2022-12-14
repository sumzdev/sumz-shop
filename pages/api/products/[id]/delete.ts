import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;

  await client.product.delete({
    where: {
      id: Number(id),
    },
  });

  res.json({
    ok: true,
  });
}

export default withHandler({
  methods: ["POST"],
  handler,
});
