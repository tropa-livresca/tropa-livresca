import { supabase } from "../../lib/supabaseClient";
import { createContext, useState, useEffect } from "react";

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
  const [tempEmail, setTempEmail] = useState(() => {
    return sessionStorage.getItem("temp_email") || "";
  });//TempEmail grava o e-mail do usuário e o salva no sessionStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Realiza o login com email e senha
   * @param {string} email
   * @param {string} password
   * @returns {Promise<string|undefined>} Retorna a mensagem de erro se falhar
   */
  const signin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return error.message;
  };

  /**
   * Cria uma nova conta
   * @param {string} email
   * @param {string} password
   * @param {string} telefone
   * @param {string} nome
   */
  const signup = async (email, password, telefone, nome) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome, telefone } },
    });

    if (!error) {
      setTempEmail(email);
      sessionStorage.setItem("temp_email", email);
    }
    return error;
  };

  /**
   * Confirma o cadastro via OTP (Token)
   * @param {string} token
   */
  const confirmsignup = async (token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: tempEmail,
      token,
      type: "signup",
    });

    if (error) return error.message;
    return data;
  };

  /** Encerra a sessão do usuário */
  const signout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        signin,
        signup,
        confirmsignup, // Adicionado para documentação
        signout,
        tempEmail,
        setTempEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
