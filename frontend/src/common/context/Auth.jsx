import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempEmail, setTempEmail] = useState(() => {
    return sessionStorage.getItem("temp_email") || "";
  });

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const res = await apiFetch("/api/v1/clients/auth/session", {
          skipAuthRedirect: true,
        });

        if (isMounted) {
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            const data = await res.json().catch(() => ({}));
            console.error(
              `Falha na sessão (${res.status}):`,
              data.error || res.statusText,
            );
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Erro de conexão em checkSession:", err);
        if (isMounted) setUserState(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);
  
const signin = async (email, password) => {
    try {
      const res = await apiFetch("/api/v1/clients/auth/signin", {
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
      const res = await apiFetch("/api/v1/clients/auth/signup", {
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
      const res = await apiFetch("/api/v1/clients/auth/signout", {
        skipAuthRedirect: true,
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(
          `Falha no encerramento de sessão (${res.status}):`,
          data.error || res.statusText,
        );
        return data.error || "Erro ao desconectar usuário.";
      }

      setUser(null);
    } catch (err) {
      console.error("Erro de rede no método signout:", err);
      return "Erro de conexão com o servidor.";
    }
  };

  const setUser = (value) => {
    setUserState(value);
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
