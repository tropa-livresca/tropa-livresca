import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <GoogleOAuthProvider clientId = "194173962299-8peqvpie7hcnkar1d7atqf3oqlu5bgge.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </StrictMode>,
  );
}
