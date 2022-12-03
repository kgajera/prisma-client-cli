export function isDisabled() {
  return process.env["PRISMA_CLIENT_CLI"] === "false";
}
