import { useState, useCallback } from "react";
import { usePopup } from "../../../components/PopUp/usePopup.js";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../../common/services/api";

export const useNovaSenha = () => {
  const navigate = useNavigate();
  const { mostrarPopup } = usePopup();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

  const verificarSenha = useCallback(() => {
    if (!novaSenha.trim()) {
      mostrarPopup("erro", "O campo nova senha deve ser preenchido.");
      return false;
    }

    if (!confirmarSenha.trim()) {
      mostrarPopup("erro", "O campo confirmar senha deve ser preenchido.");
      return false;
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!regexSenha.test(novaSenha)) {
      mostrarPopup(
        "erro",
        "A nova senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
      );
      return false;
    }

    if (novaSenha !== confirmarSenha) {
      mostrarPopup("erro", "As novas senhas não são iguais.");
      return false;
    }

    return true;
  }, [novaSenha, confirmarSenha, mostrarPopup]);

  const criarNovaSenha = useCallback(
    async (e) => {
      e?.preventDefault?.();

      if (carregando || !verificarSenha()) return;

      setCarregando(true);

      try {
        const response = await apiFetch("/api/v1/auth/senhaadm", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ novaSenha }),
        });

        const text = await response.text();

        let json = {};

        if (text) {
          try {
            json = JSON.parse(text);
          } catch {
            json = {};
          }
        }

        if (!response.ok) {
          mostrarPopup(
            "erro",
            json.message || json.error || "Erro ao atualizar senha.",
          );
          return;
        }

        mostrarPopup("sucesso", "Sucesso ao criar nova senha!");

        navigate("/admin/", { replace: true });
      } catch (error) {
        console.error("Erro ao atualizar a senha:", error);

        mostrarPopup("erro", "Erro de conexão com o servidor.");
      } finally {
        setCarregando(false);
      }
    },
    [novaSenha, carregando, verificarSenha, mostrarPopup, navigate],
  );

  const alterarSenhaAntiga = useCallback(
    async (e) => {
      e?.preventDefault?.();

      if (carregando) return;

      if (!senhaAntiga.trim()) {
        mostrarPopup("erro", "A senha antiga deve ser informada.");
        return;
      }

      if (!email.trim()) {
        mostrarPopup("erro", "O e-mail do administrador deve ser informado.");
        return;
      }

      if (!verificarSenha()) return;

      setCarregando(true);

      try {
        const response = await apiFetch("/api/v1/auth/senhaantiga", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senhaAntiga,
            novaSenha,
          }),
        });

        const text = await response.text();

        let json = {};

        if (text) {
          try {
            json = JSON.parse(text);
          } catch {
            json = {};
          }
        }

        if (!response.ok) {
          mostrarPopup(
            "erro",
            json.message || json.error || "Erro ao alterar a senha antiga.",
          );
          return;
        }

        mostrarPopup("sucesso", "Senha alterada com sucesso!");

        setSenhaAntiga("");
        setNovaSenha("");
        setConfirmarSenha("");
      } catch (error) {
        console.error("Erro ao alterar a senha:", error);

        mostrarPopup("erro", "Erro de conexão ao alterar a senha.");
      } finally {
        setCarregando(false);
      }
    },
    [senhaAntiga, novaSenha, carregando, verificarSenha, mostrarPopup, email],
  );

  return {
    novaSenha,
    carregando,
    email,
    setEmail,
    setNovaSenha,
    confirmarSenha,
    senhaAntiga,
    setSenhaAntiga,
    setConfirmarSenha,
    criarNovaSenha,
    alterarSenhaAntiga,
  };
};
