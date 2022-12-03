import fs from "fs";
import path from "path";

export const writeFileSafely = async (
  writeLocation: string,
  content: string,
  isBin = false
) => {
  fs.mkdirSync(path.dirname(writeLocation), { recursive: true });

  fs.writeFileSync(writeLocation, content);

  if (isBin) {
    fs.chmodSync(writeLocation, "755");
  }
};
