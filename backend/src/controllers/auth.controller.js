import { supabaseAdmin } from "../config/supabase.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/confirmacao-email",
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ user: data.user, message: "Cadastro Realizado! Por favor, verifique seu email para confirmar a conta." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }

};

export const signout = async (req, res) => {
  try {
    await supabaseAdmin.auth.signOut();
    res.clearCookie("auth-token");
    res.json({ message: "Desconectado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao desconectar usuário." });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if(error){
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ user: data.user, message: "Login Realizado!" });
};
