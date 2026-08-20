import { apiFetch } from "../../../services/api";
import { useState } from "react";

export function useGoogle() {
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState(null);

  const iniciarLoginNativo = async () => {
    setCarregando(true);
    setError(null);

    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const response = await apiFetch("/api/v1/auth/signin/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectTo }),
      });
      const resultado = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          resultado?.error || "Não foi possível iniciar o login com Google.",
        );
      }

      const urlRedirecionamento = resultado?.data?.url || resultado?.url;

      if (urlRedirecionamento) {
        window.location.assign(urlRedirecionamento);
      } else {
        throw new Error(
          "URL de redirecionamento não foi encontrada na resposta.",
        );
      }
    } catch (err) {
      console.error("Erro ao iniciar o login com Google:", err.message);
      setError(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return {
    iniciarLoginNativo,
    carregando,
    error,
  };
}
