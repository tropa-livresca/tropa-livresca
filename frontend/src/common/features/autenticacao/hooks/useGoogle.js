import { useState } from "react";
import pb from "../../../services/pocketbase";

export function useGoogle() {
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState(null);

  const iniciarLoginNativo = async () => {
    setCarregando(true);
    setError(null);

    try {
      await pb.collection("users").authWithOAuth2({
        provider: "google",
      });
    } catch (err) {
      console.error("Erro ao iniciar o login com Google:", err);

      setError(
        err?.response?.message ||
          err?.message ||
          "Não foi possível realizar o login com Google.",
      );
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
