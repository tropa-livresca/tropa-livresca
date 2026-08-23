import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export const useCadastro = () => {
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);

  const mostrarPopup = useCallback((tipo, mensagem) => {
    setPopup({
      tipo,
      mensagem,
    });
  }, []);

  const fecharPopup = useCallback(() => {
    setPopup(null);
    navigate("/auth/login");
  }, [navigate]);

  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");

  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !senha || !confSenha || !telefone || !nome) {
      setError("Preencha todos os campos.");
      return;
    }

    let novosErros = [];

    if (senha.length < 8) {
      novosErros.push("A senha precisa ter, no mínimo, 8 caracteres.");
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!regexSenha.test(senha)) {
      novosErros.push(
        "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.",
      );
    }

    if (senha !== confSenha) {
      novosErros.push("As senhas não são iguais.");
    }

    if (telefone.length !== 15) {
      novosErros.push("Número de telefone incorreto.");
    }

    if (novosErros.length > 0) {
      setError(novosErros);
      return;
    }

    const resError = await signup(email, senha, telefone, nome);

    if (resError) {
      setError(resError);
      return;
    }

    mostrarPopup("sucesso", "Cadastro realizado com sucesso!");
  };

  return {
    email,
    setEmail,
    senha,
    setSenha,
    error,
    setError,
    nome,
    setNome,
    confSenha,
    setConfSenha,
    telefone,
    setTelefone,
    navigate,
    handleSignup,
    popup,
    fecharPopup,
  };
};
