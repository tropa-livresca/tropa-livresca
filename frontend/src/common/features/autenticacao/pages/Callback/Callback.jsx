import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";
import { apiFetch } from "../../../../services/api";

export default function Callback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    useEffect(() => {
        const finalizarLogin = async () => {
            try {
                let code = null;
                let accessToken = null;
                let refreshToken = null;

                const searchParams = new URLSearchParams(location.search);
                code = searchParams.get("code") || searchParams.get("token");

                const hashTarget = location.hash || window.location.hash;
                if (hashTarget) {
                    const hashClean = hashTarget.startsWith("#")
                        ? hashTarget.substring(1)
                        : hashTarget;
                    const hashParams = new URLSearchParams(hashClean);
                    accessToken = hashParams.get("access_token");
                    refreshToken = hashParams.get("refresh_token");
                }

                if (!code && !accessToken) {
                    const { data: localData } = await supabase.auth.getSession();
                    if (localData?.session) {
                        accessToken = localData.session.access_token;
                        refreshToken = localData.session.refresh_token;
                    }
                }

                if (!code && !accessToken) {
                    throw new Error(
                        "Nenhum código ou token de autenticação foi encontrado na URL de retorno.",
                    );
                }

                let response;

                if (code) {
                    response = await apiFetch("/api/v1/clients/auth/session", {
                        method: "POST",
                        body: JSON.stringify({ code }),
                    });
                } else {
                    response = await apiFetch("/api/v1/clients/auth/session", {
                        method: "POST",
                        body: JSON.stringify({ accessToken, refreshToken }),
                    });
                }

                const payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        payload?.error || "Não foi possível finalizar a sessão do Google.",
                    );
                }

                if (payload?.user) {
                    setUser?.(payload.user);

                    if (payload?.session) {
                        await supabase.auth.setSession({
                            access_token: payload.session.access_token,
                            refresh_token: payload.session.refresh_token,
                        });
                    }
                } else {
                    throw new Error("Dados de usuário não fornecidos pelo servidor.");
                }

                navigate("/", { replace: true });
            } catch (error) {
                console.error("Erro ao finalizar login com Google:", error);
                navigate("/auth/login", { replace: true });
            }
        };

        finalizarLogin();
    }, [location.search, location.hash, navigate, setUser]);

    return null;
}
