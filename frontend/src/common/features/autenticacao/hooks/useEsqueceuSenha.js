import { useState } from "react";
import { apiFetch } from "../../../services/api";

export const useEsqueceuSenha = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviarRecuperarSenha = async (e) => {
    e.preventDefault();
    setError("");
    setSucesso("");
    setCarregando(true);

    try {
      const response = await apiFetch("/api/v1/clients/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.message || "Erro ao processar o pedido.");
      }

      setSucesso(dados.message || "E-mail de recuperação enviado com sucesso!");
      setEmail(""); // Limpa o campo de texto após o sucesso
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return {
    email,
    setEmail,
    error,
    setError,
    sucesso,
    setSucesso,
    carregando,
    enviarRecuperarSenha,
  };
};
