import { useCallback, useState } from "react";
import { apiFetch } from "../../../../common/services/api";

export const useGraficos = () => {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarEstatisticasVendas = useCallback(async (periodo = "30d") => {
    setCarregando(true);

    try {
      const params = new URLSearchParams({ periodo });

      const response = await apiFetch(
        `/api/v1/admin/loja/estatisticas?${params.toString()}`,
        {
          method: "GET",
        },
      );

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          json.error ||
            json.mensagem ||
            "Não foi possível obter os dados dos gráficos.",
        );
      }

      const estatisticas = await json.estatisticas;
      setDados(estatisticas);
    } catch (err) {
      console.error("Problema ao carregar os gráficos:", err);
      setDados(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    buscarEstatisticasVendas,
    dados,
    carregando,
  };
};
