import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;

  const session = await db.session.findUnique({
    where: {
      sessionToken: token as string,
    },
  });

  if (!session) res.status(404).json({ message: "Сессии не существует!" });

  res.status(200).json({ message: "Сессия существует!" });
};

export default handler;
