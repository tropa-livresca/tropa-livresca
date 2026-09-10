import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../../lib/supabaseClient";
import useAuth from "../../../../hooks/useAuth";
import { apiFetch } from "../../../../services/api";

export default function Callback() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const [deveRedefinirSenha, setDeveRedefinirSenha] = useState(false);

  useEffect(() => {
    const finalizarLogin = async () => {
      try {
        let code = null;
        let type = null;
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
          type = hashParams.get("type");
          console.log(hashParams.get("type"));
          console.log(type);
        }

        if (
          !type &&
          (location.search.includes("recovery") ||
            location.hash.includes("recovery"))
        ) {
          type = "recovery";
        }

        if (type === "recovery") {
          setDeveRedefinirSenha(true);
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
          response = await apiFetch("/api/v1/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
        } else {
          response = await apiFetch("/api/v1/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken, refreshToken }),
          });
        }

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            payload?.error || "Falha ao sincronizar a sessão no servidor."
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

        console.log(response);
        console.log(payload);

        if (type !== "recovery") {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Erro no fluxo de Callback:", error);
        navigate("/auth/login?error=Erro_na_autenticacao", { replace: true });
      }
    };

    finalizarLogin();
  }, []);

  const redefinirSenha = async (e) => {
    e.preventDefault();
    setError("");
    setSucesso("");

    if (novaSenha !== confirmarSenha) {
      setError("As senhas nao coincidem.");
      return;
    }

    setCarregando(true);

    try {
      console.log("a");
      const { data, error } = await supabase.auth.updateUser({
        password: novaSenha,
      });
      console.log(data);

      setSucesso("Senha atualizada com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
      setTimeout(() => navigate("/auth/login"), 3000);
    } catch (err) {
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  console.log(deveRedefinirSenha);

  if (deveRedefinirSenha == true) {
    return (
      <div>
        <form onSubmit={redefinirSenha}>
          <h1>REDEFINIR SENHA</h1>
          <p>
            Digite e confirme sua nova senha abaixo para atualizar sua conta
          </p>

          <div>
            <label htmlFor="novaSenha">Nova Senha</label>
            <input
              type="password"
              name="novaSenha"
              id="novaSenha"
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              disabled={carregando}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
            <input
              type="password"
              name="confirmarSenha"
              id="confirmarSenha"
              placeholder="Repita a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              disabled={carregando}
              required
            />
          </div>

          <div>
            {error && <span style={{ color: "red" }}>{error}</span>}
            {sucesso && <span style={{ color: "green" }}>{sucesso}</span>}
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? "ATUALIZANDO..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    );
  } else {
    return null;
  }
}
