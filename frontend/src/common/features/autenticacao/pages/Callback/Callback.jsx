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
                let type = null;

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
                    type = hashParams.get("type");
                }

                if (!type && (location.search.includes("recovery") || location.hash.includes("recovery"))) {
                    type = "recovery";
                }

                if (!code && !accessToken) {
                    const { data: localData } = await supabase.auth.getSession();
                    if (localData?.session) {
                        accessToken = localData.session.access_token;
                        refreshToken = localData.session.refresh_token;
                    }
                }

                if (!code && !accessToken) {
                    throw new Error("Nenhum código ou token foi encontrado na URL.");
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
                    throw new Error(payload?.error || "Falha ao sincronizar a sessão no servidor.");
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

                if (type === "recovery") {
                    navigate("/auth/redefinir-senha", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            } catch (error) {
                console.error("Erro no fluxo de Callback:", error);
                navigate("/auth/login?error=Erro_na_autenticacao", { replace: true });
            }
        };

        finalizarLogin();
    }, [location.search, location.hash, navigate, setUser]);

  return null;
}
