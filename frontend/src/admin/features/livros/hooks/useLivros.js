import { apiFetch } from "../../../../common/services/api.js";
import { useCallback, useState } from "react";

export const useLivros = () => {
  const [livro, setLivro] = useState(null);
  const [livros, setLivros] = useState([]);
  const [meta, setMeta] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarLivros = useCallback(
    async (page = 1, limit = 12, busca = "", filtro = "", ordem = "") => {
      setCarregando(true);
      try {
        const res = await apiFetch(
          `api/v1/admin/livros/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&filtro=${filtro}&ordem=${ordem}`,
        );

        const result = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setLivros([]);
            setMeta(null);
            setCarregando(false);
            return;
          }

          throw new Error(`Erro encontrado ao buscar livros: ${res.status}`);
        }

        setLivros(result.data || []);
        setMeta(result.meta);
        setCarregando(false);
      } catch (error) {
        console.error("Erro detectado ao buscar os livros", error);
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  const buscarLivroById = useCallback(async (id) => {
    if (!id) return;

    setCarregando(true);
    try {
      const res = await apiFetch(`/api/v1/admin/livros/${id}`, {
        method: "GET",
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivro(null);
          setCarregando(false);
          return;
        }
        throw new Error(json.error || `Erro ${res.status}`);
      }
      setLivro(json);
      setCarregando(false);
    } catch (error) {
      console.error(`Erro detectado ao buscar livro por id`, error);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    livro,
    setLivro,
    livros,
    setLivros,
    carregando,
    setCarregando,
    meta,
    setMeta,
    buscarLivros,
    buscarLivroById,
  };
};
