import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const session = await getSession({ req });

  const {
    query: { id },
  } = req;

  const user = session?.user?.id
    ? await client?.user.findUnique({
        where: {
          id: Number(session.user.id.toString()),
        },
      })
    : null;

  const product = await client?.product.findUnique({
    where: { id: Number(id.toString()) },
  });

  const isFavorited = Boolean(
    await client?.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
      },
      select: { id: true },
    })
  );

  res.json({
    ok: true,
    product,
    isFavorited,
  });
}

export default withHandler({
  methods: ["GET"],
  handler,
});
