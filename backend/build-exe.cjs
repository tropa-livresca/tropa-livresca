const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const BACKEND_DIR = __dirname;
const BUILD_DIR = path.join(BACKEND_DIR, "build");

const NODE_EXE = process.execPath;
const SEA_CONFIG = path.join(BACKEND_DIR, "sea-config.json");
const SEA_BLOB = path.join(BUILD_DIR, "backend.blob");
const OUTPUT_EXE = path.join(BUILD_DIR, "Backend.exe");

const POSTJECT_CLI = require.resolve("postject/dist/cli.js");

function executar(comando, argumentos, opcoes = {}) {
  execFileSync(comando, argumentos, {
    cwd: BACKEND_DIR,
    stdio: "inherit",
    ...opcoes,
  });
}

async function gerarExecutavel() {
  try {
    if (!fs.existsSync(SEA_CONFIG)) {
      throw new Error("sea-config.json não encontrado.");
    }

    if (!fs.existsSync(path.join(BUILD_DIR, "backend.cjs"))) {
      throw new Error("backend.cjs não encontrado. Gere o bundle primeiro.");
    }

    console.log("\n[1/3] Gerando SEA Blob...");

    executar(NODE_EXE, ["--experimental-sea-config", SEA_CONFIG]);

    if (!fs.existsSync(SEA_BLOB)) {
      throw new Error("O arquivo backend.blob não foi gerado.");
    }

    console.log("\n[2/3] Copiando executável do Node.js...");

    fs.copyFileSync(NODE_EXE, OUTPUT_EXE);

    console.log("\n[3/3] Incorporando o backend...");

    executar(NODE_EXE, [
      POSTJECT_CLI,
      OUTPUT_EXE,
      "NODE_SEA_BLOB",
      SEA_BLOB,
      "--sentinel-fuse",
      "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2",
      "--overwrite",
    ]);

    console.log("\nBackend.exe gerado com sucesso!");
    console.log(OUTPUT_EXE);
  } catch (error) {
    console.error("\nErro ao gerar Backend.exe:");
    console.error(error.message);
    process.exitCode = 1;
  }
}

gerarExecutavel();
