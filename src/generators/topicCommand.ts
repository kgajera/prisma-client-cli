import type { DMMF } from "@prisma/generator-helper";
import { Project, StructureKind, VariableDeclarationKind } from "ts-morph";
import { lowerCaseFirstLetter } from "../utils/lowerCaseFirstLetter";

/**
 * Each model is a Topic (https://oclif.io/docs/topics) and this command will
 * output the help listing all operations available for the model/topic.
 */
export function generateTopicCommand(project: Project, model: DMMF.Model) {
  const commandName = lowerCaseFirstLetter(model.name);

  project.createSourceFile(
    `commands/${commandName}/index.ts`,
    {
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier: "@oclif/core",
          namedImports: ["Command", "Help"],
        },
        {
          kind: StructureKind.Class,
          name: `${model.name}Command`,
          extends: "Command",
          isDefaultExport: true,
          properties: [
            // This command is hidden because it's already shown as a "Topic" in the help
            {
              name: "hidden",
              initializer: "true",
              isStatic: true,
            },
          ],
          methods: [
            {
              name: `run`,
              isAsync: true,
              statements: [
                {
                  kind: StructureKind.VariableStatement,
                  declarationKind: VariableDeclarationKind.Const,
                  declarations: [
                    {
                      name: "help",
                      initializer: "new Help(this.config)",
                    },
                  ],
                },
                `help.showTopicHelp({ name: '${commandName}' })`,
              ],
            },
          ],
        },
      ],
    },
    { overwrite: true }
  );
}
