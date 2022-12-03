import fs from "fs";
import path from "path";

export async function getTemplate(name: string) {
  return await fs.promises.readFile(
    path.join(__dirname, `${name}.ejs`),
    "utf-8"
  );
}
