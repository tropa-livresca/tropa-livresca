import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../../services/api";

/**
 * Página de confirmação de email
 * 
 * @returns {JSX.Element}
 */
export default function ConfirmacaoEmail() {
    const [status, setStatus] = useState("Aguardando confirmação de e-mail...");
    const navigate = useNavigate();

    useEffect(() => {
        let hash = window.location.hash.substring(1);

        if (!hash && window.location.href.includes("#")) {
            hash = window.location.href.split("#")[1];
        }

        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        const searchParams = new URLSearchParams(window.location.search);
        const tokenFinal = accessToken || searchParams.get("access_token");
        const refreshFinal = refreshToken || searchParams.get("refresh_token");

        if (tokenFinal && refreshFinal) {
            setStatus("Tokens encontrados! Confirmando com o servidor...");

            apiFetch("/api/auth/session", {
                method: "POST",
                skipAuthRedirect: true,
                body: JSON.stringify({ accessToken: tokenFinal, refreshToken: refreshFinal }),
            })
                .then(async (res) => {
                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || "Erro desconhecido");
                    }

                    setStatus("E-mail confirmado com sucesso! Redirecionando para página inicial...");
                    setTimeout(() => navigate("/login"), 2000);
                })
                .catch((err) => {
                    setStatus(`Falha na validação com o servidor: ${err.message}`);
                    console.error("Erro no fetch da sessão:", err);
                });
        } else {
            setStatus("Link de confirmação inválido, expirado ou formato incorreto.");
        }
    }, [navigate]);

    return (
        <div >
            <h2>{status}</h2>
        </div>
    );
}
