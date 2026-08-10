import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../../services/api.js";

export const useLoginAdmin = () => {
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/";

  const signinAdmin = async (username, senha) => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/v1/admin/auth/signin", {
        method: "POST",
        body: JSON.stringify({ username, senha }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login como administrador.");
        return null;
      }

      if (data?.status === "EXIGIR_TROCA_DE_SENHA") {
        navigate("/admin/trocar-senha", { state: { userId: data.userId } });
        return null;
      }

      setUser(data.user);
      return data;
    } catch (err) {
      console.error("Erro em useLoginAdmin", err);
      setError("Erro de conexão com o servidor.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAdmin = async (e) => {
    e.preventDefault();

    if (!username || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    const loginSucesso = await signinAdmin(username, senha);

    if (loginSucesso) {
      navigate(from, { replace: true });
    }
  };

  const signoutAdmin = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/v1/admin/auth/signout", {
        method: "POST",
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data.error || "Erro ao fazer logout como administrador.");
        return null;
      }
      
      setUser(null);
      navigate("/auth/login", { replace: true });
    } catch (err) {
      console.error("Erro no logout", err);
      setError("Erro de conexão com o servidor.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    user,
    setUser,
    senha,
    setSenha,
    error,
    setError,
    loading,
    handleLoginAdmin,
    signoutAdmin,
  };
};
