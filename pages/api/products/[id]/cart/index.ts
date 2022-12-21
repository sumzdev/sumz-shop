import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getSession } from "next-auth/react";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    body: { count },
  } = req;

  const session = await getSession({ req });

  const alreadyExists = await client.cart.findFirst({
    where: {
      productId: Number(id?.toString()),
      userId: session?.user?.id,
    },
  });

  if (alreadyExists) {
    const cart = await client.cart.update({
      where: {
        id: alreadyExists.id,
      },
      data: {
        count: alreadyExists.count + parseInt(count),
      },
    });

    res.json({ ok: true, cart });
  } else {
    const cart = await client.cart.create({
      data: {
        count: parseInt(count),
        user: {
          connect: {
            id: session?.user?.id,
          },
        },
        product: {
          connect: {
            id: Number(id?.toString()),
          },
        },
      },
    });
    res.json({ ok: true, cart });
  }
}

export default withHandler({
  methods: ["POST"],
  handler,
});
