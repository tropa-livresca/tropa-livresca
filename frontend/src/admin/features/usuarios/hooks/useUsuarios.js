import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback } from "react";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [meta, setMeta] = useState(null);

  const buscarUsuarios = useCallback(
    async (page = 1, limit = 12, busca = "", ordem = "", filtro = "") => {
      setCarregando(true);
      setMeta(null);

      try {
        const res = await apiFetch(
          `/api/v1/admin/usuarios/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&ordem=${ordem}&filtro=${filtro}`,
          { method: "GET", skipAuthRedirect: true },
        );

        const result = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setUsuarios([]);
            setMeta(null);
            setCarregando(false);
            return;
          }
          throw new Error(result.error || `Erro ${res.status}`);
        }

        setUsuarios(result.data || []);
        setMeta(result.meta);
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        setUsuarios([]);
        setCarregando(false);
      }
    },
    [],
  );

  return {
    meta,
    carregando,
    usuarios,
    setUsuarios,
    setMeta,
    setCarregando,
    buscarUsuarios,
  };
};
