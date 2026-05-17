import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../../services/api";

/** @type {import('react').Context<any>} */
export const AuthContext = createContext({});

/**
 * Provedor de Autenticação Supabase
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Elementos filhos que terão acesso ao contexto
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempEmail, setTempEmail] = useState(() => {
    return sessionStorage.getItem("temp_email") || "";
  }); //TempEmail grava o e-mail do usuário e o salva no sessionStorage

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await apiFetch("/api/auth/session");

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

  /**
   * Realiza o login com email e senha
   * @param {string} email
   * @param {string} password
   * @returns {Promise<string|undefined>} Retorna a mensagem de erro se falhar
   */
  const signin = async (email, password) => {
    try{
      const res = await apiFetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if(!res.ok){
        return data.error || "Erroo ao fazer login";
      }

      setUser(data.user);
    }catch(err){
      return "Erro de conexão com o servidor.";
    }
  };

  /**
   * Cria uma nova conta
   * @param {string} email
   * @param {string} password
   * @param {string} telefone
   * @param {string} nome
   */
  const signup = async (email, password, telefone, nome) => {
    try {
      const res = await apiFetch("/api/auth/signup", {
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
      return "Erro de conexão com o servidor.";
    }
  };
/*
  const confirmsignup = async (token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: tempEmail,
      token,
      type: "signup",
    });

    if (error) return error.message;
    return data;
  };*/
  
  /** Encerra a sessão do usuário */
  const signout = async () => {
    try{
      const res = await apiFetch("/api/auth/signout", {
        method: "POST",
      });

      if (res.ok) {
        setUser(null);
      }
    } catch(err){
      return "Erro de conexão com o servidor.";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
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
