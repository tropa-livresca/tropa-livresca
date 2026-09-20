import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback } from "react";

export const useMeusLivros = () => {
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [livros, setLivros] = useState([]);
  const [meta, setMeta] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarLivros = useCallback(
    async (
      page = 1,
      limit = 12,
      busca = "",
      filtro = "",
      ordem = "",
      estado = "",
    ) => {
      setCarregando(true);
      try {
        const url = `/api/v1/clients/autopublicacao/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&filtro=${filtro}&ordem=${ordem}&estado=${estado}`;
        const res = await apiFetch(url, { method: "GET" });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setLivros([]);
            setMeta({});
            return;
          }
          throw new Error(data.error || `Erro ${res.status}`);
        }

        setLivros(data.data || data || []);
        setMeta(data.meta || {});
      } catch (error) {
        console.error("Erro em buscarLivrosById", error);
        setLivros([]);
        setMeta({});
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  const buscarLivroById = useCallback(async (id) => {
    setCarregando(true);
    try {
      const res = await apiFetch(`/api/v1/clients/autopublicacao/${id}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);

      const detalhe = data.data ?? data;
      setLivroSelecionado(detalhe);
      return detalhe;
    } catch (error) {
      console.error("Erro em buscarLivroById", error);
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  const deletarLivro = useCallback(async (id) => {
    setCarregando(true);
    try {
      const res = await apiFetch(`/api/v1/clients/autopublicacao/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);

      return data;
    } catch (error) {
      console.error("Erro em deletar livro", error);
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  const atualizarEstado = useCallback(
    async (id, novoEstado, callbackAtualizar) => {
      setCarregando(true);
      try {
        const res = await apiFetch(
          `/api/v1/clients/autopublicacao/estado/${id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ novoEstado }),
          },
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);

        if (callbackAtualizar) await callbackAtualizar();
      } catch (error) {
        console.error("Erro em updateEstado", error);
        throw error;
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  return {
    carregando,
    livroSelecionado,
    livros,
    meta,
    setMeta,
    setCarregando,
    setLivroSelecionado,
    setLivros,
    buscarLivros,
    buscarLivroById,
    atualizarEstado,
    deletarLivro,
  };
};
