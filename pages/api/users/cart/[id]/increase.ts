import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id: cartId },
  } = req;

  const session = await getSession({ req });

  const cartData = await client.cart.findFirst({
    where: {
      id: Number(cartId?.toString()),
      userId: session?.user?.id,
    },
  });

  if (cartData) {
    await client.cart.update({
      where: {
        id: cartData.id,
      },
      data: {
        count: cartData.count + 1,
      },
    });
  }

  res.json({ ok: true });
}

export default withHandler({
  methods: ["POST"],
  handler,
});
