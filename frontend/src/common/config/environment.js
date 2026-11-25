const BACKEND_PORT = 3000;

const hostname = window.location.hostname;

const isCodespace = hostname.endsWith(".app.github.dev");

const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

const isPortable = import.meta.env.VITE_PORTABLE_MODE === "true";

const configuredBackendUrl = import.meta.env.VITE_API_URL?.trim();

const BACKEND_URL = isPortable
  ? ""
  : configuredBackendUrl
    ? configuredBackendUrl.replace(/\/+$/, "")
    : isCodespace
      ? `${window.location.protocol}//${hostname.replace(
          /-\d+\.app.github\.dev$/,
          `-${BACKEND_PORT}.app.github.dev`,
        )}`
      : isLocalhost
        ? `http://localhost:${BACKEND_PORT}`
        : null;

if (BACKEND_URL === null) {
  throw new Error(
    "VITE_API_URL não foi configurada para o ambiente de produção.",
  );
}

export { BACKEND_URL };
