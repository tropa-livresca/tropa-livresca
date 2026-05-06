import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/**
 * Ponto de entrada principal da aplicação React.
 * Inicializa o root do DOM, aplica o StrictMode e renderiza o componente raiz
 */

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
