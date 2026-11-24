import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../services/api";

export const useRedefinirSenha = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const enviarRedefinirSenha = async (e) => {
    e.preventDefault();
    setError("");
    setSucesso("");

    if (novaSenha !== confirmarSenha) {
      setError("As senhas nao coincidem.");
      return;
    }

    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      setError("O link de redefinição é inválido ou expirou.");
      return;
    }

    setCarregando(true);

    try {
      const response = await apiFetch("/api/v1/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
        skipAuthRedirect: true,
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.error || "Erro ao processar a redefinição.");
      }

      setSucesso(resultado.message || "Senha atualizada com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
      setTimeout(() => navigate("/auth/login"), 3000);
    } catch (err) {
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return {
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    carregando,
    error,
    sucesso,
    enviarRedefinirSenha,
  };
};
