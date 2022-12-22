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
      favlist: {
        select: {
          id: true,
          product: true,
          productId: true,
        },
      },
    },
  });

  const wishlist = user?.favlist;

  res.json({
    ok: true,
    wishlist,
  });
}

export default withHandler({
  methods: ["GET"],
  handler,
});
