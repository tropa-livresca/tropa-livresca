import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const { signin, user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

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

    const deOndeVeio = location.state?.from?.pathname || "/";
    const ehRotaAdmin =
      deOndeVeio.startsWith("/admin") || deOndeVeio.includes("/auth/admin");

    if (user?.is_admin || user?.funcao === "master") {
      const destinoAdmin = ehRotaAdmin ? deOndeVeio : "/admin/dashboard";
      navigate(destinoAdmin, { replace: true });
    } else {
      const destinoComum =
        ehRotaAdmin || deOndeVeio === "/" ? "/" : deOndeVeio;
      navigate(destinoComum, { replace: true });
    }
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
