import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "students_processed.csv");
    const data = fs.readFileSync(filePath, "utf-8");

    // Convert CSV → JSON
    const rows = data.split("\n").filter((row) => row.trim() !== "");
    const headers = rows[0].split(",");

    const jsonData = rows.slice(1).map((row) => {
      const values = row.split(",");
      let obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = values[i] ? values[i].trim() : "";
      });
      return obj;
    });

    return new Response(JSON.stringify(jsonData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
