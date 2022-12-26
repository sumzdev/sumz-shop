import withHandler, { ResponseType } from "@libs/server/withHandler";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const products = await client.product.findMany();

  const pattern = /[a-zA-Zㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  let keywords: string[] = [];

  products.forEach((product) => {
    let words = product.name.split(" ");
    words = words.filter((v) => pattern.test(v));
    keywords.push(...words);
  });

  keywords = Array.from(new Set(keywords));
  keywords.sort();

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
