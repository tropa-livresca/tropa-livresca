import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";
import { AdminContext } from "./AdminContext";

export const AdminProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  const [loading, setLoading] = useState(true);

  const setUser = (value) => {
    setUserState(value);
  };

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const checkSession = async () => {
      try {
        const res = await apiFetch("/api/v1/auth/session-adm", {
          skipAuthRedirect: true,
          signal: controller.signal,
        });

        if (!isActive) return;

        if (res.ok) {
          const data = await res.json();
          setUserState(data.user);
        } else {
          setUserState(null);
        }
      } catch (err) {
        if (isActive && err.name !== "AbortError") {
          console.error("Erro ao verificar sessão administrativa:", err);
          setUserState(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const signin = async (email, senha) => {
    try {
      const res = await apiFetch("/api/v1/auth/signin-adm", {
        skipAuthRedirect: true,
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        console.error(
          `Falha na autenticação (${res.status}):`,
          data.error || res.statusText,
        );
        return data.error || "Erro ao fazer login administrativo";
      }

      setUser(data.user);
      return null;
    } catch (err) {
      console.error("Erro de rede no método signin administrativo:", err);
      return "Erro de conexão com o servidor.";
    }
  };

  const signout = async () => {
    try {
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();

      const res = await apiFetch("/api/v1/auth/signout-adm", {
        skipAuthRedirect: true,
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error(
          `Falha no encerramento de sessão (${res.status}):`,
          data.error || res.statusText,
        );
      }
    } catch (err) {
      console.error("Erro de rede no método signout administrativo:", err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        signed: !!user,
        loading,
        signin,
        signout,
        setUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
