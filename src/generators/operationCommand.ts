import type { DMMF } from "@prisma/generator-helper";
import { CodeBlockWriter, Project, StructureKind } from "ts-morph";
import { lowerCaseFirstLetter } from "../utils/lowerCaseFirstLetter";
import { upperCaseFirstLetter } from "../utils/upperCaseFirstLetter";

// Unsupported fields because they are circular
const UNSUPPORTED_FIELDS = ["AND", "NOT", "OR"];

/**
 * Generates a command to execute a specific operation (create, findFirst, etc.)
 * for a model.
 */
export function generateOperationCommand(
  project: Project,
  model: DMMF.Model,
  operationName: string,
  operationArgs: DMMF.SchemaField | undefined,
  dmmf: DMMF.Document
) {
  const className = `${model.name}${upperCaseFirstLetter(operationName)}`;
  const commandName = lowerCaseFirstLetter(model.name);
  const argsType = `Prisma.${className.replace(/One$/, "")}Args`;
  const clientOperationName = operationName.replace(/One$/, "");

  project.createSourceFile(
    `commands/${commandName}/${operationName}.ts`,
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@oclif/core",
          namedImports: ["Flags"],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@prisma/client",
          namedImports: ["Prisma", "PrismaClient", model.name],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "../../QueryCommand",
          namedImports: ["QueryCommand"],
        },
        {
          kind: StructureKind.Class,
          name: className,
          extends: `QueryCommand<typeof ${className}, ${argsType}>`,
          isDefaultExport: true,
          properties: [
            {
              name: "flags",
              initializer: (writer) => {
                if (operationArgs?.args?.length) {
                  writer.inlineBlock(() => {
                    for (const arg of operationArgs.args) {
                      writeFlags(
                        writer,
                        dmmf.schema.inputObjectTypes,
                        arg.inputTypes,
                        [arg.name]
                      );
                    }
                  });
                }
              },
              isStatic: true,
            },
          ],
          methods: [
            {
              name: `query`,
              isAsync: true,
              parameters: [
                {
                  name: "client",
                  type: "PrismaClient",
                },
                {
                  name: "args",
                  type: argsType,
                },
              ],
              statements: [
                `return client.${commandName}.${clientOperationName}(args)`,
              ],
            },
          ],
        },
      ],
    },
    { overwrite: true }
  );
}

function writeFlags(
  writer: CodeBlockWriter,
  inputObjectTypes: DMMF.Schema["inputObjectTypes"],
  inputTypes: DMMF.SchemaArg["inputTypes"],
  parents: string[] = []
) {
  // Prevent circular flags
  if (parents.length > 3) {
    return;
  }
  for (const inputType of inputTypes) {
    switch (inputType.location) {
      case "inputObjectTypes":
        if (inputType.namespace) {
          const argType = inputObjectTypes[inputType.namespace]?.find(
            (i) => i.name === inputType.type
          );

          if (argType) {
            for (const field of argType.fields) {
              if (!UNSUPPORTED_FIELDS.includes(field.name)) {
                writeFlags(writer, inputObjectTypes, field.inputTypes, [
                  ...parents,
                  field.name,
                ]);
              }
            }
          }
        }
        break;
      case "scalar":
        if (inputType.type !== "Null") {
          const flag = argTypeToFlag(inputType.type);
          writer.writeLine(`['${parents.join(".")}']: Flags.${flag}({}),`);
        }
        break;
      default:
        break;
    }
  }
}

function argTypeToFlag(type: DMMF.ArgType) {
  if (type === "Int") {
    return "integer";
  }
  return "string";
}
