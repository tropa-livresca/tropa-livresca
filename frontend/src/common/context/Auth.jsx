import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  
  const [loading, setLoading] = useState(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    const pathname = window.location.pathname;

    const temTokens = hash.includes("access_token") || search.includes("code") || search.includes("token");
    const ehRotaAuth = pathname.includes("/auth/");

    return !(temTokens || ehRotaAuth);
  });

  const [tempEmail, setTempEmail] = useState(() => {
    return sessionStorage.getItem("temp_email") || "";
  });

  const setUser = (value) => {
    setUserState(value);
  };

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();
    const { signal } = controller;

    const hash = window.location.hash;
    const search = window.location.search;
    const pathname = window.location.pathname;

    const temTokens = hash.includes("access_token") || search.includes("code") || search.includes("token");
    const ehRotaAuth = pathname.includes("/auth/");

    if (temTokens || ehRotaAuth) {
      return () => {
        isActive = false;
        controller.abort();
      };
    }

    const checkSession = async () => {
      try {
        const res = await apiFetch("/api/v1/auth/dados-sessao", {
          skipAuthRedirect: true,
          signal,
        });

        if (isActive) {
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        if (isActive && err.name !== "AbortError") {
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

  const signin = async (email, password) => {
    try {
      const res = await apiFetch("/api/v1/auth/signin", {
        skipAuthRedirect: true,
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        console.error(
          `Falha na autenticação (${res.status}):`,
          data.error || res.statusText,
        );
        return data.error || "Erro ao fazer login";
      }

      setUser(data.user);
      return null;
    } catch (err) {
      console.error("Erro de rede no método signin:", err);
      return "Erro de conexão com o servidor.";
    }
  };

  const signup = async (email, password, telefone, nome) => {
    try {
      const res = await apiFetch("/api/v1/auth/signup", {
        skipAuthRedirect: true,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, telefone, nome }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(
          `Falha no cadastro (${res.status}):`,
          data.error || res.statusText,
        );
        return data.error || "Erro ao criar conta";
      }

      setTempEmail(email);
      sessionStorage.setItem("temp_email", email);

      return null;
    } catch (err) {
      console.error("Erro de rede no método signup:", err);
      return "Erro de conexão com o servidor.";
    }
  };

  const signout = async () => {
    try {
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();

      const res = await apiFetch("/api/v1/auth/signout", {
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
      console.error("Erro de rede no método signout:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        loading,
        signin,
        signup,
        signout,
        tempEmail,
        setTempEmail,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
