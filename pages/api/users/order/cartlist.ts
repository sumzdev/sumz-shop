import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { cartIdList }: { cartIdList: number[] } = req.body;

  if (!cartIdList) {
    return res
      .status(409)
      .json({ ok: false, message: "알 수 없는 에러가 발생하였습니다." });
  }

  console.log("주문 처리...");

  const orderProducts = await client.cart.findMany({
    where: {
      id: {
        in: cartIdList.map((v) => +v),
      },
    },
  });

  await client.cart.deleteMany({
    where: {
      id: {
        in: orderProducts.map((cart) => cart.id),
      },
    },
  });

  return res.status(200).json({
    ok: true,
    cartlist: cartIdList,
  });
}

export default withHandler({
  methods: ["POST"],
  handler,
});
