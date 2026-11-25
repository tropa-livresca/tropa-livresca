const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = __dirname;
const NODE_EXE = process.execPath;

const CONFIG = path.join(ROOT, "launcher-sea-config.json");
const BLOB = path.join(ROOT, "launcher.blob");
const OUTPUT = path.join(ROOT, "TropaLivresca.exe");

const POSTJECT = require.resolve("postject/dist/cli.js");

try {
  execFileSync(NODE_EXE, ["--experimental-sea-config", CONFIG], {
    cwd: ROOT,
    stdio: "inherit",
  });

  fs.copyFileSync(NODE_EXE, OUTPUT);

  execFileSync(
    NODE_EXE,
    [
      POSTJECT,
      OUTPUT,
      "NODE_SEA_BLOB",
      BLOB,
      "--sentinel-fuse",
      "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2",
      "--overwrite",
    ],
    { cwd: ROOT, stdio: "inherit" },
  );

  console.log("\nTropaLivresca.exe gerado com sucesso!");
} catch (error) {
  console.error("Erro ao gerar launcher:", error.message);
  process.exitCode = 1;
}
