import { useState, useCallback } from "react";
import { usePopup } from "../../../components/PopUp/usePopup.js";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../../common/services/api";

export const useNovaSenha = () => {
  const navigate = useNavigate();

  const { mostrarPopup } = usePopup();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const validarCampos = () => {
    if (!novaSenha || !novaSenha.trim()) {
      mostrarPopup("erro", "O campo nova senha deve ser preenchido.");
      return false;
    }

    if (!confirmarSenha || !confirmarSenha.trim()) {
      mostrarPopup("erro", "O campo confirmar senha deve ser preenchido.");
      return false;
    }

    return true;
  };

  const verificarSenha = () => {
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!regexSenha.test(novaSenha)) {
      mostrarPopup(
        "erro",
        "A nova senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.",
      );
      return false;
    }

    if (novaSenha.length < 6) {
      mostrarPopup("erro", "A nova senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (novaSenha !== confirmarSenha) {
      mostrarPopup("erro", "As novas senhas não são iguais.");
      return false;
    }

    return true;
  };

  const finalizarPayload = useCallback(() => {
    return JSON.stringify({
      novaSenha: novaSenha,
    });
  }, [novaSenha]);

  const criarNovaSenha = useCallback(
    async (e) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (!validarCampos()) return;
      if (!verificarSenha()) return;

      setCarregando(true);

      try {
        const response = await apiFetch(`/api/v1/auth/senhaadm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: finalizarPayload(),
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const json = await response.json();

        const data = json.data || json;

        if (!data) {
          mostrarPopup("erro", "Erro ao alterar a senha");
          return;
        }

        mostrarPopup("sucesso", "Sucesso ao criar nova senha!");

        navigate("/admin/");
      } catch (error) {
        console.error("Erro ao atualizar a senha", error);
        mostrarPopup("erro", "Erro ao atualizar senha.");
      } finally {
        setCarregando(false);
      }
    },
    [validarCampos, finalizarPayload],
  );

  return {
    novaSenha,
    carregando,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    criarNovaSenha,
  };
};
