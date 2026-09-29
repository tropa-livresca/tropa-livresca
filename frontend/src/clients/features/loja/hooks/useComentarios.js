import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback } from "react";

export const useComentario = () => {

  const [carregando, setCarregando] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [meta, setMeta] = useState(null);

  const buscarComentarios = useCallback(
    async (
      idLivro,
      secao = 1,
      limit = 12,
    ) => {
      setCarregando(true);
      try {
        const params = new URLSearchParams({
          secao: String(secao),
          limit: String(limit),
          idLivro: String(idLivro),
        });

        const response = await apiFetch(
          `/api/v1/clients/comentarios/?${params.toString()}`,
        );
        const res = await response.json();
        if (!response.ok) {
          console.error("Erro ao buscar livros:", res.error);
          return;
        }

        console.log(res);

        setComentarios(res.data);
        setMeta(res.meta || null);
      } catch (err) {
        console.error("Erro ao buscar livros da loja:", err);
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  return {
    comentarios,
    setComentarios,
    meta,
    carregando,
    buscarComentarios,
  };
};
