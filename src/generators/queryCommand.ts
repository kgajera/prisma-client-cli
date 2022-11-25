import {
  Project,
  Scope,
  StructureKind,
  VariableDeclarationKind,
} from "ts-morph";

const CSV_OUTPUT_FLAG_NAME = "_csv";

/**
 * Generates a base class (https://oclif.io/docs/base_class) containing
 * functionality to execute and ouput the results of Prisma query.
 */
export function generateQueryCommand(project: Project) {
  project.createSourceFile(
    "QueryCommand.ts",
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@oclif/core",
          namedImports: ["CliUx", "Command", "Flags", "Interfaces"],
        },
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@prisma/client",
          namedImports: ["PrismaClient"],
        },
        {
          kind: StructureKind.TypeAlias,
          name: "QueryCommandFlags<T extends typeof Command>",
          type: "Interfaces.InferredFlags<typeof QueryCommand['globalFlags'] & T['flags']",
          isExported: true,
        },
        {
          kind: StructureKind.Class,
          name: "QueryCommand<T extends typeof Command, QueryArgs>",
          extends: "Command",
          isAbstract: true,
          isExported: true,
          properties: [
            {
              name: "globalFlags",
              initializer: (writer) => {
                writer.block(() => {
                  writer.write(`${CSV_OUTPUT_FLAG_NAME}: Flags.boolean(),`);
                });
              },
              isStatic: true,
            },
            {
              name: "flags",
              type: "QueryCommandFlags",
              scope: Scope.Protected,
            },
          ],
          methods: [
            {
              name: "init",
              isAsync: true,
              returnType: "Promise<void>",
              statements: (writer) => {
                writer
                  .writeLine("await super.init()")
                  .writeLine(
                    "const { flags } = await this.parse(this.constructor as Interfaces.Command.Class)"
                  )
                  .writeLine("this.flags = flags");
              },
            },
            {
              name: "query",
              isAbstract: true,
              isAsync: true,
              parameters: [
                {
                  name: "client",
                  type: "PrismaClient",
                },
                {
                  name: "args",
                  type: "QueryArgs",
                },
              ],
            },
            {
              name: "getQueryArgs",
              returnType: "QueryArgs",
              scope: Scope.Protected,
              statements: [
                (writer) => {
                  writer
                    .writeLine(
                      "return Object.keys(this.flags).reduce((acc, path) =>"
                    )
                    .block(() => {
                      writer
                        .writeLine("const keys = path.split('.')")
                        .writeLine("let cur = acc")
                        .writeLine(`if (path === "${CSV_OUTPUT_FLAG_NAME}")`)
                        .block(() => {
                          writer.writeLine("return acc");
                        })
                        .writeLine("keys.forEach((key, i) =>")
                        .block(() => {
                          writer
                            .writeLine("if (i < keys.length - 1)")
                            .block(() => {
                              writer
                                .writeLine("cur[key] = cur[key] || {}")
                                .writeLine("cur = cur[key]");
                            })
                            .write("else")
                            .block(() => {
                              writer.writeLine("cur[key] = this.flags[path]");
                            });
                        })
                        .writeLine("return acc");
                    })
                    .write(", {})");
                },
              ],
            },
            {
              name: "outputQueryResult",
              isAsync: true,
              scope: Scope.Protected,
              parameters: [
                {
                  name: "data",
                },
              ],
              statements: [
                {
                  kind: StructureKind.VariableStatement,
                  declarationKind: VariableDeclarationKind.Const,
                  declarations: [
                    {
                      name: "isArray",
                      initializer: `Array.isArray(data)`,
                    },
                  ],
                },
                (writer) => {
                  writer
                    .writeLine("if (data === null)")
                    .block(() => {
                      writer
                        .writeLine('console.log("Record not found")')
                        .writeLine("return");
                    })
                    .writeLine("else if (isArray && data.length === 0)")
                    .block(() => {
                      writer
                        .writeLine('console.log("No records found")')
                        .writeLine("return");
                    });
                },
                {
                  kind: StructureKind.VariableStatement,
                  declarationKind: VariableDeclarationKind.Const,
                  declarations: [
                    {
                      name: "dataArray",
                      initializer: `isArray ? data : [data]`,
                    },
                    {
                      name: "keys",
                      initializer: `Object.keys(dataArray[0])`,
                    },
                    {
                      name: "columns",
                      initializer: `{}`,
                    },
                  ],
                },
                (writer) => {
                  writer
                    .writeLine("for (const key of keys)")
                    .block(() => {
                      writer.writeLine("columns[key] = {}");
                    })
                    .writeLine(
                      `CliUx.ux.table(dataArray, columns, { csv: this.flags["${CSV_OUTPUT_FLAG_NAME}"] ?? false })`
                    );
                },
              ],
            },
            {
              name: "run",
              isAsync: true,
              statements: [
                {
                  kind: StructureKind.VariableStatement,
                  declarationKind: VariableDeclarationKind.Const,
                  declarations: [
                    {
                      name: "client",
                      initializer: "new PrismaClient()",
                    },
                    {
                      name: "args",
                      initializer: `this.getQueryArgs()`,
                    },
                    {
                      name: "result",
                      initializer: `await this.query(client, args)`,
                    },
                  ],
                },
                "this.outputQueryResult(result)",
              ],
            },
          ],
        },
      ],
    },
    { overwrite: true }
  );
}
