import fs from "fs";
import path from "path";
import { writeFileSafely } from "../utils/writeFile";

export function generateBin(outputDir: string) {
  const scriptPath = path.resolve(outputDir, "bin", "run");

  writeFileSafely(
    scriptPath,
    `#!/usr/bin/env node

const oclif = require('@oclif/core')

oclif.run().then(require('@oclif/core/flush')).catch(require('@oclif/core/handle'))`
  );

  fs.chmodSync(scriptPath, "755");
}
