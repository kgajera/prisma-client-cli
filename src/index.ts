import { generatorHandler } from "@prisma/generator-helper";
import { generate } from "./generate";

const { version } = require("../package.json");

generatorHandler({
  onManifest() {
    return {
      version,
      defaultOutput: "./cli",
      prettyName: "Prisma Client CLI",
      requiresGenerators: ["prisma-client-js"],
    };
  },
  onGenerate: generate,
});
