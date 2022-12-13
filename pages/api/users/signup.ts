import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ ok: false });
  }

  const hashPassword = await bcrypt.hash(password, 6);

  const createdUser = await client.user.create({
    data: {
      email,
      password: hashPassword,
      name,
    },
  });
  // console.log(createdUser);

  return res.status(200).json({
    ok: true,
  });
}

export default withHandler({
  methods: ["POST"],
  handler,
});
