const FRONTEND_PORT = 5173;
const BACKEND_PORT = 3000;
const POCKETBASE_PORT = 8090;

const CODESPACE_NAME = process.env.CODESPACE_NAME;
const isCodespace = Boolean(CODESPACE_NAME);
const isProduction = process.env.NODE_ENV === "production";

const FRONTEND_URL = isCodespace
  ? `https://${CODESPACE_NAME}-${FRONTEND_PORT}.app.github.dev`
  : process.env.FRONTEND_URL?.replace(/\/+$/, "") ||
    (isProduction ? null : `http://localhost:${FRONTEND_PORT}`);

const BACKEND_URL = isCodespace
  ? `https://${CODESPACE_NAME}-${BACKEND_PORT}.app.github.dev`
  : process.env.BACKEND_URL?.replace(/\/+$/, "") ||
    (isProduction ? null : `http://localhost:${BACKEND_PORT}`);

const POCKETBASE_URL =
  process.env.POCKETBASE_URL?.replace(/\/+$/, "") ||
  (isCodespace
    ? `https://${CODESPACE_NAME}-${POCKETBASE_PORT}.app.github.dev`
    : isProduction
      ? null
      : `http://127.0.0.1:${POCKETBASE_PORT}`);

if (!FRONTEND_URL || !BACKEND_URL || !POCKETBASE_URL) {
  throw new Error(
    "Configure FRONTEND_URL, BACKEND_URL e POCKETBASE_URL no ambiente de produção.",
  );
}

const AUTH_REDIRECT_URL = `${FRONTEND_URL}/auth/callback`;

const RESET_PASSWORD_URL = `${FRONTEND_URL}/auth/callback`;
const RESET_PASSWORD_CALLBACK_URL = `${BACKEND_URL}/api/v1/auth/callback-redefinir-senha`;

const EMAIL_CONFIRMATION_URL = `${FRONTEND_URL}/confirmacao-email`;

const REDIRECT_ADMIN_URL = `${FRONTEND_URL}/admin/configuracoes/novasenha`;

export {
  FRONTEND_URL,
  BACKEND_URL,
  POCKETBASE_URL,
  AUTH_REDIRECT_URL,
  RESET_PASSWORD_URL,
  RESET_PASSWORD_CALLBACK_URL,
  EMAIL_CONFIRMATION_URL,
  REDIRECT_ADMIN_URL,
};
