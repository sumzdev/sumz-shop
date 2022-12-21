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
  } = req;

  const session = await getSession({ req });

  const alreadyExists = await client.fav.findFirst({
    where: {
      productId: Number(id?.toString()),
      userId: session?.user?.id,
    },
  });

  if (alreadyExists) {
    await client.fav.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.fav.create({
      data: {
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
  }

  res.json({ ok: true });
}

export default withHandler({
  methods: ["POST"],
  handler,
});
