import { useCallback, useState } from "react";
import { apiFetch } from "../../../../common/services/api";

export const useTrocarSenha = () => {
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [senha, setSenha] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const ConfirmarSenha = useCallback(() => {
        const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

        if (!regexSenha.test(novaSenha)) {
            setMensagem(
                "A nova senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.",
            );
            return false;
        }

        if (novaSenha !== confirmarSenha) {
            setMensagem("As novas senhas não são iguais.");
            return false;
        }

        return true;
    }, [confirmarSenha, novaSenha]);

    const finalizarPayload = useCallback(() => {
        return JSON.stringify({
            senhaAntiga: senha,
            senhaNova: novaSenha,
        });
    }, [senha, novaSenha]);

    const AlterarSenha = useCallback(async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setMensagem("");

        if (!ConfirmarSenha()) return;
        setCarregando(true);

        try {
            const response = await apiFetch(`/api/v1/clients/auth/senha`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: finalizarPayload(),
            });

            const errorData = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(errorData.error || errorData.message || `Erro ${response.status}`);
            }

            setMensagem(errorData.message || "Senha alterada com sucesso.");
            setSenha("");
            setNovaSenha("");
            setConfirmarSenha("");
        } catch (error) {
            setMensagem(error.message || "Erro ao alterar senha.");
            console.error("Erro ao alterar senha: ", error);
        } finally {
            setCarregando(false);
        }
    }, [ConfirmarSenha, finalizarPayload]);

    return {
        senha,
        setSenha,
        novaSenha,
        setNovaSenha,
        confirmarSenha,
        setConfirmarSenha,
        carregando,
        AlterarSenha,
        mensagem,
    };
};
