const FRONTEND_PORT = 5173;
const BACKEND_PORT = 3000;

const CODESPACE_NAME = process.env.CODESPACE_NAME;

const isCodespace = Boolean(CODESPACE_NAME);

const FRONTEND_URL = isCodespace
  ? `https://${CODESPACE_NAME}-${FRONTEND_PORT}.app.github.dev`
  : `http://localhost:${FRONTEND_PORT}`;

const BACKEND_URL = isCodespace
  ? `https://${CODESPACE_NAME}-${BACKEND_PORT}.app.github.dev`
  : `http://localhost:${BACKEND_PORT}`;

const SUPABASE_AUTH_REDIRECT_URL =
  `${FRONTEND_URL}/auth/callback`;

const SUPABASE_RESET_PASSWORD_URL =
  `${FRONTEND_URL}/auth/callback`;

const SUPABASE_RESET_PASSWORD_CALLBACK_URL =
  `${BACKEND_URL}/api/v1/auth/callback-redefinir-senha`;

const SUPABASE_EMAIL_CONFIRMATION_URL =
  `${FRONTEND_URL}/confirmacao-email`;

const SUPABASE_REDIRECT_ADMIN_URL =
  `${FRONTEND_URL}/admin/primeiro-acesso`;

export {
  FRONTEND_URL,
  BACKEND_URL,
  SUPABASE_AUTH_REDIRECT_URL,
  SUPABASE_RESET_PASSWORD_URL,
  SUPABASE_RESET_PASSWORD_CALLBACK_URL,
  SUPABASE_EMAIL_CONFIRMATION_URL,
  SUPABASE_REDIRECT_ADMIN_URL,
};