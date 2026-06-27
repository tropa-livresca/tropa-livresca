import { apiFetch } from "../services/api";
import { useState } from "react";

export const useSuporte = () => {
  const [error, setError] = useState({ text: "", success: false });
  const [carregando, setCarregando] = useState(false);

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [motivo, setMotivo] = useState("");
  const [telefone, setTelefone] = useState("");

  const enviarEmail = async () => {
    setCarregando(true);
    setError({ text: "", success: false });

    const dadosFormulario = {
      email: email,
      nome: nome,
      mensagem: mensagem,
      motivo: motivo,
      telefone: telefone,
    };

    try {
      const response = await apiFetch("/api/enviarEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosFormulario),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      setError({
        text: "Formulário enviado com sucesso! Em breve te responderemos, por e-mail ou telefone.",
        success: true,
      });

      setEmail("");
      setNome("");
      setMensagem("");
      setMotivo("");
      setTelefone("");
    } catch (err) {
      console.error("Erro em useSuporte.js", err);
      setError({
        text: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        success: false,
      });
    } finally {
      setCarregando(false);
    }
  };

  return {
    error,
    setError,
    carregando,
    email,
    setEmail,
    nome,
    setNome,
    mensagem,
    setMensagem,
    motivo,
    setMotivo,
    telefone,
    setTelefone,
    enviarEmail,
  };
};

export default useSuporte;
