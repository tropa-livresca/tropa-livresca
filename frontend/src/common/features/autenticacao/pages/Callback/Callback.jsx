import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { apiFetch } from "../../../../services/api";
import styles from "./Callback.module.css";

export default function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const finalizado = useRef(false);

  useEffect(() => {
    const finalizarLogin = async () => {
      if (finalizado.current) {
        return;
      }

      finalizado.current = true;

      try {
        const searchParams = new URLSearchParams(location.search);
        const erro = searchParams.get("erro");
        const resetToken = searchParams.get("token");

        if (resetToken) {
          navigate(
            `/auth/redefinir-senha?token=${encodeURIComponent(resetToken)}`,
            { replace: true },
          );
          return;
        }

        if (erro) {
          throw new Error(erro);
        }

        const response = await apiFetch("/api/v1/auth/session");
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            payload?.error || "Falha ao recuperar a sessão de autenticação.",
          );
        }

        if (payload?.user) {
          setUser?.(payload.user);
        } else {
          throw new Error("Dados de usuário não fornecidos pelo servidor.");
        }

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Erro no fluxo de Callback:", error);
        navigate("/auth/login?error=Erro_na_autenticacao", { replace: true });
      }
    };

    finalizarLogin();
  }, [location.search, navigate, setUser]);

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <p>Validando sua sessão...</p>
      </section>
    </main>
  );
}
