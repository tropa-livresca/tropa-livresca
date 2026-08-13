import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../../services/api.js";
import useAuth from "../../../hooks/useAuth";

export const useLoginAdmin = () => {
  const { setUser } = useAuth(); 

  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUserLocal] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/";

  const signinAdmin = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/v1/auth/signin", {
        skipAuthRedirect: true,
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: senha,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data.message || data.error || "Erro ao fazer login.");
        return null;
      }

      const usuario = data.user;

      if (!usuario || usuario.is_admin !== true) {
        setError("Acesso negado. Você não possui privilégios de administrador.");
        return null;
      }

      setUserLocal(usuario);
      setUser(usuario); 
      return data;
    } catch (err) {
      console.error("Erro em useLoginAdmin", err);
      setError("Erro de conexão com o servidor.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [email, senha, setUser]);

  const handleLoginAdmin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email || !senha) {
        setError("Preencha todos os campos.");
        return;
      }

      const loginSucesso = await signinAdmin();

      if (loginSucesso) {
        navigate(from, { replace: true });
      }
    },
    [from, navigate, email, senha, signinAdmin],
  );

  const signoutAdmin = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/v1/auth/signout", {
        method: "POST",
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data.message || data.error || "Erro ao fazer logout.");
        return null;
      }

      setUserLocal(null);
      setUser(null);
      navigate("/auth/admin", { replace: true });
    } catch (err) {
      console.error("Erro no logout", err);
      setError("Erro de conexão com o servidor.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser]);

  return {
    email,
    setEmail,
    user,
    setUser: setUserLocal,
    senha,
    setSenha,
    error,
    setError,
    loading,
    handleLoginAdmin,
    signoutAdmin,
  };
};
