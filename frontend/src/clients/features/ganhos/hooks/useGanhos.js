import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api";

export const useGanhos = () => {
  const [ganhos, setGanhos] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarGanhos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await apiFetch("/api/v1/clients/movimentacoes");
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json.error || "Não foi possível carregar seus ganhos.");
      }

      setGanhos(json.dados);
    } catch (err) {
      setErro(err.message);
      setGanhos(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  return { ganhos, carregando, erro, buscarGanhos };
};
