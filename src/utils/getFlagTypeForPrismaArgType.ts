import type { DMMF } from "@prisma/generator-helper";
import type { Flag } from "./getFlagsForPrismaInputType";

export function getFlagTypeForPrismaArgType(type: DMMF.ArgType): Flag["type"] {
  if (type === "Int") {
    return "integer";
  }
  return "string";
}
