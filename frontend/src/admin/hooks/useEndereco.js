import { useCallback, useState } from "react";
import { apiFetch } from "../../common/services/api";

export const useEndereco = () => {
  const [enderecos, setEnderecos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const BuscarEnderecos = useCallback(async (id) => {
    setCarregando(true);
    try {
      const response = await apiFetch(`/api/v1/admin/enderecos/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setEnderecos([]);
          return;
        }
        throw new Error(`Erro ${response.status}`);
      }

      const json = await response.json();
      const dadosEnderecos = json.data || json;
      console.log(dadosEnderecos);
      setEnderecos(dadosEnderecos);
    } catch (error) {
      console.error("Erro ao buscar endereços: ", error);
      setEnderecos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    enderecos,
    setEnderecos,
    BuscarEnderecos,
    carregando,
  };
};
