import type {
  DMMF,
  EnvValue,
  GeneratorOptions,
} from "@prisma/generator-helper";
import { parseEnvValue } from "@prisma/internals";
import { ModuleKind, Project, ScriptTarget } from "ts-morph";
import { generateBin } from "./generators/bin";
import { generateOperationCommand } from "./generators/operationCommand";
import { generateQueryCommand } from "./generators/queryCommand";
import { generateTopicCommand } from "./generators/topicCommand";
import { isDisabled } from "./utils/isDisabled";

const UNSUPPORTED_OPERATIONS = [
  "aggregate",
  "createMany",
  "findFirstOrThrow",
  "findUniqueOrThrow",
  "groupBy",
];

export async function generate({ dmmf, generator }: GeneratorOptions) {
  if (isDisabled()) {
    return;
  }

  const outputDir = parseEnvValue(generator.output as EnvValue);

  const project = new Project({
    compilerOptions: {
      outDir: outputDir,
      module: ModuleKind.NodeNext,
      target: ScriptTarget.ES2020,
      declaration: false,
    },
  });

  project.createSourceFile("index.ts", "export {run} from '@oclif/core'", {
    overwrite: true,
  });

  generateBin(outputDir);
  generateQueryCommand(project);

  const outputTypes: DMMF.SchemaField[] = [];
  for (const t of dmmf.schema.outputObjectTypes.prisma) {
    outputTypes.push(...t.fields);
  }

  for (const model of dmmf.datamodel.models) {
    generateTopicCommand(project, model);

    const modelOperations = dmmf.mappings.modelOperations.find(
      (mo) => mo.model === model.name
    );

    if (modelOperations) {
      const { model: modelName, ...operations } = modelOperations;

      for (const operationName in operations) {
        if (UNSUPPORTED_OPERATIONS.includes(operationName)) {
          continue;
        }

        const operationArgs = outputTypes.find(
          (f) => f.name === operations[operationName as keyof typeof operations]
        );
        generateOperationCommand(
          project,
          model,
          operationName,
          operationArgs,
          dmmf
        );
      }
    }
  }

  await project.emit();
}
