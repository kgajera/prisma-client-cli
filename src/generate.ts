import type {
  DMMF,
  EnvValue,
  GeneratorOptions,
} from "@prisma/generator-helper";
import { parseEnvValue } from "@prisma/internals";
import ejs from "ejs";
import path from "path";
import {
  Flag,
  getFlagsForPrismaInputType,
} from "./utils/getFlagsForPrismaInputType";
import { getTemplate } from "./utils/getTemplate";
import { isDisabled } from "./utils/isDisabled";
import { lowerCaseFirstLetter } from "./utils/lowerCaseFirstLetter";
import { upperCaseFirstLetter } from "./utils/upperCaseFirstLetter";
import { writeFileSafely } from "./utils/writeFile";

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
  const commandsDir = path.join(outputDir, "commands");

  await writeFileSafely(
    path.join(outputDir, "schema.json"),
    JSON.stringify(dmmf)
  );

  await writeFileSafely(
    path.join(outputDir, "index.mjs"),
    "export {run} from '@oclif/core'"
  );

  await writeFileSafely(
    path.join(outputDir, "bin", "run"),
    await getTemplate("cli"),
    true
  );

  await writeFileSafely(
    path.join(outputDir, "QueryCommand.mjs"),
    await getTemplate("queryCommand")
  );

  const outputTypes: DMMF.SchemaField[] = [];
  for (const t of dmmf.schema.outputObjectTypes.prisma) {
    outputTypes.push(...t.fields);
  }

  const modelTemplate = await getTemplate("modelCommand");
  const operationTemplate = await getTemplate("operationCommand");

  for (const model of dmmf.datamodel.models) {
    const modelCamelCaseName = lowerCaseFirstLetter(model.name);

    await writeFileSafely(
      path.join(commandsDir, modelCamelCaseName, "index.mjs"),
      ejs.render(modelTemplate, {
        commandName: modelCamelCaseName,
        modelName: model.name,
      })
    );

    const modelOperations = dmmf.mappings.modelOperations.find(
      (m) => m.model === model.name
    );

    if (modelOperations) {
      const { model: modelName, ...operations } = modelOperations;

      for (const operationName in operations) {
        if (UNSUPPORTED_OPERATIONS.includes(operationName)) {
          continue;
        }
        const modelOperationName =
          operations[operationName as keyof typeof operations];
        const operationArgs = outputTypes.find(
          (f) => f.name === modelOperationName
        );

        const commandName = lowerCaseFirstLetter(model.name);

        const flags: Flag[] = [];
        if (operationArgs?.args?.length) {
          for (const arg of operationArgs.args) {
            flags.push(
              ...getFlagsForPrismaInputType(dmmf.schema, arg.inputTypes, [
                arg.name,
              ])
            );
          }
        }

        await writeFileSafely(
          path.join(commandsDir, commandName, `${operationName}.mjs`),
          ejs.render(operationTemplate, {
            clientModel: commandName,
            clientOperation: operationName.replace(/One$/, ""),
            operationName: upperCaseFirstLetter(
              modelOperationName ?? `${operationName}${model.name}`
            ),
            flags,
          })
        );
      }
    }
  }
}
