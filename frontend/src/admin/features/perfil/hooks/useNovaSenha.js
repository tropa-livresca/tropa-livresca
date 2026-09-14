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

  const criarNovaSenha = useCallback(
    async (e) => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }

      if (!novaSenha.trim()) {
        mostrarPopup(
          "erro",
          "O campo nova senha deve ser preenchido.",
        );
        return;
      }

      if (!confirmarSenha.trim()) {
        mostrarPopup(
          "erro",
          "O campo confirmar senha deve ser preenchido.",
        );
        return;
      }

      const regexSenha =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

      if (!regexSenha.test(novaSenha)) {
        mostrarPopup(
          "erro",
          "A nova senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
        );
        return;
      }

      if (novaSenha !== confirmarSenha) {
        mostrarPopup(
          "erro",
          "As novas senhas não são iguais.",
        );
        return;
      }

      setCarregando(true);

      try {
        const response = await apiFetch(
          "/api/v1/auth/senhaadm",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              novaSenha,
            }),
          },
        );

        const text = await response.text();
        const json = text ? JSON.parse(text) : {};

        if (!response.ok) {
          mostrarPopup(
            "erro",
            json.message ||
              json.error ||
              "Erro ao atualizar senha.",
          );
          return;
        }

        mostrarPopup(
          "sucesso",
          "Sucesso ao criar nova senha!",
        );

        navigate("/admin/", { replace: true });
      } catch (error) {
        console.error(
          "Erro ao atualizar a senha:",
          error,
        );

        mostrarPopup(
          "erro",
          "Erro de conexão com o servidor.",
        );
      } finally {
        setCarregando(false);
      }
    },
    [
      novaSenha,
      confirmarSenha,
      mostrarPopup,
      navigate,
    ],
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
