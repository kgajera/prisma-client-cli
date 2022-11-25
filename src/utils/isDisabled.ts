export function isDisabled() {
  return process.env["PRISMA_GENERATOR_CLI"] === "false";
}
