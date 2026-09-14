const BACKEND_PORT = 3000;

const hostname = window.location.hostname;

const isCodespace = hostname.endsWith(".app.github.dev");

const BACKEND_URL = isCodespace
  ? `${window.location.protocol}//${hostname.replace(
      /-\d+\.app\.github\.dev$/,
      `-${BACKEND_PORT}.app.github.dev`
    )}`
  : `http://localhost:${BACKEND_PORT}`;

export {
  BACKEND_URL,
};