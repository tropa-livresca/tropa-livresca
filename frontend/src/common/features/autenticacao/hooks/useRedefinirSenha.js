import { useState, useCallback } from "react";
import {useNavigate} from "react-router-dom";
import { apiFetch } from "../../../services/api";

export const useRedefinirSenha = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [tokens, setTokens] = useState({ accessToken: "", refreshToken: "" });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const encontrarHash = useCallback(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      setTokens({
        accessToken: params.get("access_token") || "",
        refreshToken: params.get("refresh_token") || "",
      });
    }
  }, []);

  const enviarRedefinirSenha = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch("/api/v1/clients/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          novaSenha: novaSenha,
        }),
      });

      const resultado = await response.json();
      setMensagem(resultado.message);

      if (response.ok) {
        setNovaSenha("");
        setTimeout(() => navigate("/auth/login"), 3000);
      }
    } catch (err) {
      console.log(err);
      setMensagem("Erro ao processar a redefinição.");
    }
  };

  return {
    novaSenha,
    mensagem,
    setNovaSenha,
    encontrarHash,
    enviarRedefinirSenha,
  };
};
