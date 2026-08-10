import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const { signin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    const res = await signin(email, senha);

    if (res) {
      setError(res);
      return;
    }

    navigate(from, { replace: true });
  };

  return {
    email, 
    setEmail,
    error,
    setError,
    senha,
    setSenha,
    handleSignin,

  };
};
