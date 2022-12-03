import fs from "fs";
import os from "os";
import path from "path";
import { expect, test, vi } from "vitest";
import { getSampleDMMF } from "./__fixtures__/getSampleDMMF";
import { generate } from "../generate";

vi.mock("../utils/getTemplate", () => ({
  getTemplate: async (name: string) => {
    return await fs.promises.readFile(
      path.join(__dirname, "..", "templates", `${name}.ejs`),
      "utf-8"
    );
  },
}));

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
    "QueryCommand.mjs",
    path.join("bin", "run"),
    path.join("commands", "user", "index.mjs"),
    path.join("commands", "user", "findMany.mjs"),
    path.join("commands", "user", "deleteOne.mjs"),
  ].forEach((file) => {
    const content = fs.readFileSync(path.resolve(tmpOutputDir, file), "utf-8");
    expect(content).toMatchSnapshot();
  });

  fs.rmSync(tmpOutputDir, { recursive: true, force: true });
});
