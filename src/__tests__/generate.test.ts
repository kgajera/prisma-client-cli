import fs from "fs";
import os from "os";
import path from "path";
import { expect, test } from "vitest";
import { getSampleDMMF } from "./__fixtures__/getSampleDMMF";
import { generate } from "../generate";

test("generate", async () => {
  const dmmf = await getSampleDMMF();
  const tmpOutputDir = path.join(os.tmpdir(), "prisma-cli-generator-test");

  await generate({
    dmmf,
    generator: {
      output: {
        fromEnvVar: null,
        value: tmpOutputDir,
      },
    },
  } as any);

  [
    "QueryCommand.js",
    path.join("bin", "run"),
    path.join("commands", "user", "index.js"),
    path.join("commands", "user", "findMany.js"),
    path.join("commands", "user", "deleteOne.js"),
  ].forEach((file) => {
    const content = fs.readFileSync(path.resolve(tmpOutputDir, file), "utf-8");
    expect(content).toMatchSnapshot();
  });

  fs.rmSync(tmpOutputDir, { recursive: true, force: true });
}, 10000);
