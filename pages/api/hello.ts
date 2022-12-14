// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse } from "next";
import { NextApiRequest } from "next";


type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse <Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
