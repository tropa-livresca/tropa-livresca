import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { loginComGoogle } from "../../../services/autenticacao";

export function useGoogle() {
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const iniciarLoginNativo = async () => {
    setCarregando(true);
    setError(null);

    try {
      const user = await loginComGoogle();
      setUser(user);
      navigate(location.state?.from?.pathname || "/", { replace: true });
      return user;
    } catch (err) {
      console.error("Erro ao realizar login com Google:", err);

      setError(
        err?.response?.message ||
          err?.message ||
          "Não foi possível realizar o login com Google.",
      );

      return null;
    } finally {
      setCarregando(false);
    }
  };

  return {
    iniciarLoginNativo,
    carregando,
    error,
  };
}
