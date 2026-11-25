const { spawn } = require("node:child_process");
const path = require("node:path");

const ROOT = path.dirname(process.execPath);
const BAT = path.join(ROOT, "TropaLivresca.bat");

const processo = spawn("cmd.exe", ["/c", BAT], {
  cwd: ROOT,
  detached: false,
  stdio: "inherit",
  windowsHide: false,
});

processo.on("error", (error) => {
  console.error("Erro ao iniciar a Tropa Livresca:", error.message);
  process.exitCode = 1;
});

processo.on("exit", (code) => {
  process.exitCode = code ?? 0;
});
