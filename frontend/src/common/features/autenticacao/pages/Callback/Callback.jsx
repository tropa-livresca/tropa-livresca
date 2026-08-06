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
                const params = new URLSearchParams(location.search);
                const code = params.get("code") || params.get("token") || null;

                if (code) {
                    const response = await apiFetch("/api/v1/clients/auth/session", {
                        method: "POST",
                        body: JSON.stringify({ code }),
                    });

                    const payload = await response.json().catch(() => ({}));

                    if (!response.ok) {
                        throw new Error(
                            payload?.error ||
                            "Não foi possível finalizar a sessão do Google.",
                        );
                    }

                    if (payload?.user) {
                        setUser?.(payload.user);
                    } else {
                        const { data, error } = await supabase.auth.getSession();
                        if (!error && data?.session?.user) {
                            setUser?.(data.session.user);
                        }
                    }
                } else {
                    const { data, error } = await supabase.auth.getSession();
                    if (error || !data?.session?.user) {
                        throw new Error(
                            error?.message || "Sessão do Google não foi criada.",
                        );
                    }

                    setUser?.(data.session.user);
                }

                navigate("/", { replace: true });
            } catch (error) {
                console.error("Erro ao finalizar login com Google:", error);
                navigate("/auth/login", { replace: true });
            }
        };

        finalizarLogin();
    }, [location.hash, location.search, navigate, setUser]);

    return null;
}
