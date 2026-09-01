import { apiFetch } from "../../common/services/api";
import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../../common/context/AuthContext";

export const useLivros = () => {
  const { user } = useContext(AuthContext);
  const [livro, setLivro] = useState(null);
  const [autor, setAutor] = useState(null);
  const [colaboradores, setColaboradores] = useState(null);
  const [Livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [meta, setMeta] = useState(null);

  const BuscarLivros = useCallback(async (page = 1, limit = 12, busca = "", filtro = "", ordem = "") => {
    setCarregando(true);
    setMeta(null);

    try {
      const res = await apiFetch(
        `/api/v1/clients/livros/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&filtro=${filtro}&ordem=${ordem}`,
        { method: "GET", skipAuthRedirect: true },
      );

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivros([]);
          setMeta(null);
          setCarregando(false);
          return;
        }
        throw new Error(result.error || `Erro ${res.status}`);
      }

      setLivros(result.data || []);
      setMeta(result.meta);
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      setLivros([]);
      setCarregando(false);
    }
  }, []);


  const BuscarDetalhesLivro = useCallback(async (id) => {
    setLivro(null);
    setColaboradores(null);
    setAutor(null);
    setCarregando(true);
    try {
      const res = await apiFetch(`/api/v1/clients/livros/detalhes/${id}`, {
        skipAuthRedirect: true,
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
      setAutor(json.users_profile || null);
      setCarregando(false);
    } catch (err) {
      console.error("Erro em BuscarDetalhesLivro", err);
      setLivro(null);
      setCarregando(false);
    }
  }, []);

  return {
    user,
    autor,
    colaboradores,
    meta,
    carregando,
    livro,
    Livros,
    setAutor,
    setMeta,
    setLivro,
    setLivros,
    setColaboradores,
    setCarregando,
    BuscarLivros,
    BuscarDetalhesLivro,
  };
};
