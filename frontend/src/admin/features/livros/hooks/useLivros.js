import { apiFetch } from "../../../../common/services/api.js";
import { useCallback, useState } from "react";

export const useLivros = () => {
  const [livro, setLivro] = useState(null);
  const [livros, setLivros] = useState([]);
  const [count, setCount] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarLivros = useCallback(
    async (
      page = 1,
      limit = 8,
      busca = "",
      filtro = "",
      ordem = "",
      ativo = "",
      estado = "",
    ) => {
      setCarregando(true);

      try {
        let ativoBooleano = "";

        if (ativo === "true" || ativo === true) {
          ativoBooleano = true;
        }

        if (ativo === "false" || ativo === false) {
          ativoBooleano = false;
        }

        const res = await apiFetch(
          `api/v1/admin/livros/?page=${page}&limit=${limit}&busca=${encodeURIComponent(
            busca,
          )}&filtro=${filtro}&ordem=${ordem}&ativo=${ativoBooleano}&estado=${estado}`,
          {
            method: "GET",
          },
        );

        const result = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setLivros([]);
            setCount(0);
            return;
          }

          throw new Error(`Erro encontrado ao buscar livros: ${res.status}`);
        }

        setLivros(result.data || []);

        setCount(
          result.meta?.totalItems ??
            result.meta?.total ??
            result.count ??
            result.data?.length ??
            0,
        );
      } catch (error) {
        console.error("Erro detectado ao buscar os livros", error);

        setLivros([]);
        setCount(0);
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
          return;
        }

        throw new Error(json.error || `Erro ${res.status}`);
      }

      setLivro(json);
    } catch (error) {
      console.error("Erro detectado ao buscar livro por id", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarLivrosByUserId = useCallback(async (id) => {
    if (!id) return;

    setCarregando(true);

    try {
      const res = await apiFetch(`/api/v1/admin/livros/user/${id}`, {
        method: "GET",
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivros([]);
          setCount(0);
          return;
        }

        throw new Error(`Erro encontrado ao buscar livros: ${res.status}`);
      }

      setLivros(result || []);

      setCount(result?.count ?? result?.length ?? 0);
    } catch (error) {
      console.error("Erro detectado ao buscar os livros", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  const alterarAtivo = useCallback(async (id, ativo) => {
    const res = await apiFetch(`/api/v1/admin/livros/${id}/ativo`, {
      method: "PATCH",
      body: JSON.stringify({ ativo }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.error || "Não foi possível alterar o livro.");
    }

    return null;
  }, []);

  return {
    alterarAtivo,
    livro,
    setLivro,
    livros,
    setLivros,
    carregando,
    setCarregando,
    count,
    setCount,
    buscarLivros,
    buscarLivroById,
    buscarLivrosByUserId,
  };
};
