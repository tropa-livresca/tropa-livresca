import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempEmail, setTempEmail] = useState(() => {
    return sessionStorage.getItem("temp_email") || "";
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await apiFetch("/api/v1/clients/auth/session", {
          skipAuthRedirect: true,
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signin = async (email, password) => {
    try {
      const res = await apiFetch("/api/v1/clients/auth/signin", {
        skipAuthRedirect: true,
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return data.error || "Erro ao fazer login";
      }

      setUser(data.user);
    } catch (err) {
      return "Erro de conexÃ£o com o servidor.";
    }
  };

  const signup = async (email, password, telefone, nome) => {
    try {
      const res = await apiFetch("/api/v1/clients/auth/signup", {
        skipAuthRedirect: true,
        method: "POST",
        body: JSON.stringify({ email, password, telefone, nome }),
      });

      const data = await res.json();

      if (!res.ok) {
        return data.error || "Erro ao criar conta";
      }

      setTempEmail(email);
      sessionStorage.setItem("temp_email", email);

      return null;

    } catch (err) {
      return "Erro de conexÃ£o com o servidor.";
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
        return data.error || "Erro ao desconectar usuÃ¡rio.";
      }

      setUser(null);
    } catch (err) {
      return "Erro de conexÃ£o com o servidor.";
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


