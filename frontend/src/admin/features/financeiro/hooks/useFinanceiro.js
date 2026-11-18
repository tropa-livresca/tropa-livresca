import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api";

export const useFinanceiro = () => {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarFinanceiro = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await apiFetch("/api/v1/admin/movimentacoes", {
        skipAuthRedirect: true,
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          json.error || "Não foi possível carregar os dados financeiros.",
        );
      }

      setDados(json.dados);
    } catch (err) {
      setErro(err.message);
      setDados(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  return { dados, carregando, erro, buscarFinanceiro };
};
