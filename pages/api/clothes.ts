import type { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";

type ResponseData = {
  message: string;
  data?: object[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  //connecting to the datatabase
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`SELECT * FROM clothes;`;
  //console.log(data);
  res.status(200).json({ message: "Hello from Next.js!", data });
}
