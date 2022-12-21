import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const session = await getSession({ req });

  if (!session?.user?.id) {
    res.json({
      ok: false,
      error: "not session",
    });
  }

  const user = await client.user.findUnique({
    where: {
      id: Number(session.user.id.toString()),
    },
    include: {
      cartlist: {
        select: {
          id: true,
          count: true,
          product: true,
          productId: true,
        },
      },
    },
  });

  const cartlist = user?.cartlist;

  res.json({
    ok: true,
    cartlist,
  });
}

export default withHandler({
  methods: ["GET"],
  handler,
});
