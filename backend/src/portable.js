import path from "node:path";

const APP_ROOT = process.env.APP_ROOT
  ? path.resolve(process.env.APP_ROOT)
  : path.resolve(process.cwd(), "..");

process.env.APP_ROOT = APP_ROOT;

const ENV_PATH = path.join(APP_ROOT, "backend", ".env");

async function iniciar() {
  try {
    process.loadEnvFile(ENV_PATH);

    console.log("[Environment] Arquivo .env carregado.");
  } catch (error) {
    console.error(
      `[Environment] Não foi possível carregar ${ENV_PATH}:`,
      error.message,
    );

    process.exit(1);
  }

  await import("./api.js");
}

iniciar().catch((error) => {
  console.error("[Backend] Erro ao iniciar:", error);
  process.exit(1);
});
