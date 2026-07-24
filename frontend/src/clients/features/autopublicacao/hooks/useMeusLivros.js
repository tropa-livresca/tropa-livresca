import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback } from "react";

export const useMeusLivros = () => {
  const [livro, setLivro] = useState([]);
  const [Livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const BuscarLivrosById = useCallback(async () => {
    setCarregando(true);
    setLivros([]);
    try {
      const res = await apiFetch("/api/v1/clients/autopublicacao/", {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivros([]);
          setCarregando(false);
          return;
        }
        throw new Error(data.error || `Erro ${res.status}`);
      }

      const livrosData = data.data || data || [];
      setLivros(livrosData);
      setCarregando(false);
    } catch (error) {
      console.error("Erro em GetLivrosById", error);
      setLivros([]);
      setCarregando(false);
    }
  }, []);

  const BuscarLivroById = useCallback(async (id) => {
    try {
      const res = await apiFetch("/api/v1/clients/livros/detalhes/" + id, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);

      return data.data;
    } catch (error) {
      console.error("Erro em BuscarLivroById", error);
      throw error;
    }
  }, []);

  const UpdateEstado = useCallback(async (id, estado) => {
    setCarregando(true);
    try {
      const res = await apiFetch(
        "/api/v1/clients/autopublicacao/updateEstado/" + id + "/" + estado,
        {
          method: "PATCH",
        },
      );
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      setCarregando(false);
    } catch (error) {
      console.error("Erro em UpdateStatusAtivo", error);
      setCarregando(false);
    }
  }, []);

  const InativarLivro = useCallback(async (id) => {
    setCarregando(true);
    try {
      const res = await apiFetch("/api/v1/clients/autopublicacao/ativo/" + id, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      setCarregando(false);
    } catch (error) {
      console.error("Erro em InativarLivro", error);
      setCarregando(false);
    }
  }, []);

  return {
    carregando,
    livro,
    Livros,
    setCarregando,
    setLivro,
    setLivros,
    BuscarLivrosById,
    BuscarLivroById,
    UpdateEstado,
    InativarLivro,
  };
};
