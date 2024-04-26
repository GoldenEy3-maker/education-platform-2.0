import { type NextApiHandler } from "next";
import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

const handler: NextApiHandler = (req, res) =>
  NextAuth(...authOptions(req, res));

export default handler;
