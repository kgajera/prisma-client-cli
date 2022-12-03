import type {
  EnumFlagOptions,
  FlagProps,
} from "@oclif/core/lib/interfaces/parser";
import type { DMMF } from "@prisma/generator-helper";
import { getFlagTypeForPrismaArgType } from "./getFlagTypeForPrismaArgType";

// Unsupported fields because they are circular
const UNSUPPORTED_FIELDS = ["AND", "NOT", "OR"];

export interface Flag {
  flagOptions?: FlagProps | EnumFlagOptions<any>;
  name: string;
  type: "boolean" | "enum" | "integer" | "string";
}

export function getFlagsForPrismaInputType(
  schema: DMMF.Schema,
  inputTypes: DMMF.SchemaArg["inputTypes"],
  parents: string[] = []
): Flag[] {
  const flags: Flag[] = [];

  // Prevent circular flags
  if (parents.length > 3) {
    return flags;
  }

  for (const inputType of inputTypes) {
    switch (inputType.location) {
      case "inputObjectTypes":
        const argType = schema.inputObjectTypes[inputType.namespace!]?.find(
          (i) => i.name === inputType.type
        );

        if (argType) {
          for (const field of argType.fields) {
            if (!UNSUPPORTED_FIELDS.includes(field.name)) {
              flags.push(
                ...getFlagsForPrismaInputType(schema, field.inputTypes, [
                  ...parents,
                  field.name,
                ])
              );
            }
          }
        }
        break;
      case "enumTypes":
        const values = schema.enumTypes[inputType.namespace!]?.find(
          (e) => e.name === inputType.type
        )?.values;
        flags.push({
          name: parents.join("."),
          type: "enum",
          ...(values && {
            flagOptions: {
              options: values,
            },
          }),
        });
        break;
      case "scalar":
        if (inputType.type !== "Null") {
          flags.push({
            name: parents.join("."),
            type: getFlagTypeForPrismaArgType(inputType.type),
          });
        }
        break;
      default:
        console.log(`Unknown input location: ${inputType.location}`);
        break;
    }
  }

  return flags;
}
