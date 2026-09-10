import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback } from "react";

export const useMeusLivros = () => {
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [livros, setLivros] = useState([]);
  const [meta, setMeta] = useState("");
  const [carregando, setCarregando] = useState(false);

  const buscarLivrosById = useCallback(
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
        const url = `/api/v1/clients/autopublicacao/buscar/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&filtro=${filtro}&ordem=${ordem}&estado=${estado}`;
        
        const res = await apiFetch(url, { method: "GET" });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setLivros([]);
            return;
          }
          throw new Error(data.error || `Erro ${res.status}`);
        }

        const livrosData = data.data || data || [];
        setLivros(livrosData);
        setMeta(data.meta || "");
      } catch (error) {
        console.error("Erro em buscarLivrosById", error);
        setLivros([]);
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  const buscarLivroById = useCallback(async (id) => {
    setCarregando(true);
    try {
      const res = await apiFetch("/api/v1/clients/autopublicacao/"+id, {
        method: "GET",
      });
      const data = await res.json();

       console.log(data);

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

  const updateEstado = useCallback(
    async (id, novoEstado, callbackAtualizar) => {
      setCarregando(true);
      try {
        const res = await apiFetch(
          `/api/v1/clients/autopublicacao/updateEstado/${id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ novoEstado }),
          },
        );
        if (!res.ok) throw new Error(`Erro ${res.status}`);

        if (callbackAtualizar) await callbackAtualizar();
      } catch (error) {
        console.error("Erro em updateEstado", error);
        setCarregando(false);
      }
    },
    [],
  );

  const inativarLivro = useCallback(async (id, callbackAtualizar) => {
    setCarregando(true);
    try {
      const res = await apiFetch(`/api/v1/clients/autopublicacao/ativo/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);

      if (callbackAtualizar) await callbackAtualizar();
    } catch (error) {
      console.error("Erro em inativarLivro", error);
      setCarregando(false);
    }
  }, []);

  return {
    carregando,
    livroSelecionado,
    livros,
    meta,
    setMeta,
    setCarregando,
    setLivroSelecionado,
    setLivros,
    buscarLivrosById,
    buscarLivroById,
    updateEstado,
    inativarLivro,
  };
};
