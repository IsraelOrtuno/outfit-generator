// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }

    // Formidable v3 returns arrays
    const file = files.file?.[0];

    //console.log("Received file:", file?.originalFilename, "Type:", fields.type);

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Use a stream instead of readFileSync
    const stream = fs.createReadStream(file.filepath);
    const prefix = `${fields.type}/`;

    const blob = await put(
      `${prefix}${file.originalFilename || file.newFilename || "upload.bin"}`,
      stream,
      {
        access: "public",
        addRandomSuffix: true,
      },
    );

    console.log(blob);
    console.log(fields.type);

    //adding values to neon database tables
    const sql = neon(process.env.DATABASE_URL!);

    await sql`
        INSERT INTO clothes (file, type)
        VALUES (${blob.url}, ${fields.type?.[0]})
      `;

    return res.status(200).json({
      success: true,
      url: blob.url,
    });
  });
}
