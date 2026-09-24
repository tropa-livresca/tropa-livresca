import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback } from "react";

export const useLivrosLoja = () => {
  const [livro, setLivro] = useState(null);
  const [autor, setAutor] = useState(null);
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [livros, setLivros] = useState([]);
  const [meta, setMeta] = useState(null);

  const buscarLivroById = useCallback(async (id) => {
    setCarregando(true);
    try {
      const response = await apiFetch(`/api/v1/clients/loja/${id}`);
      const data = await response.json();
      if (!response.ok) {
        console.error("Erro ao buscar livros:", data.error);
        return;
      }

      setLivro(data);

      setAutor(data.users_profile);
      setColaboradores(data.colaboradores || []);
    } catch (err) {
      console.error("Erro ao buscar livro by id", err);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarLivros = useCallback(
    async (
      page = 1,
      limit = 12,
      busca = "",
      filtro = "",
      ordem = "",
      categoria = "",
    ) => {
      setCarregando(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          busca,
          filtro,
          ordem,
          categoria,
        });

        const response = await apiFetch(
          `/api/v1/clients/loja/?${params.toString()}`,
        );
        const data = await response.json();
        if (!response.ok) {
          console.error("Erro ao buscar livros:", data.error);
          return;
        }
        const livros = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.data)
            ? data.data.data
            : [];
        setLivros(livros);
        setMeta(data.meta || null);
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
    livro,
    setLivro,
    autor,
    colaboradores,
    livros,
    setLivros,
    meta,
    carregando,
    buscarLivros,
    buscarLivroById,
  };
};
