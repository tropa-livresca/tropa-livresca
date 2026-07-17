import { apiFetch } from "../../services/api";
import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/Auth";

export const useLivros = () => {
  const { user } = useContext(AuthContext);
  const [livro, setLivro] = useState([]);
  const [autor, setAutor] = useState(null);
  const [colaboradores, setColaboradores] = useState(null);
  const [Livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [meta, setMeta] = useState(null);

  const BuscarLivros = useCallback(async (page = 1, limit = 12, busca = "") => {
    setCarregando(true);
    setMeta(null);

    try {
      const res = await apiFetch(
        `/api/v1/clients/livros/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}`,
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

      const livrosData = result.data || [];
      setLivros(livrosData);
      setMeta(result.meta);
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      setLivros([]);
      setCarregando(false);
    }
  }, []);

  const BuscarLivroByAutor = useCallback(async (id) => {
      setLivro([]); setColaboradores(null); setAutor(null); setCarregando(true);
      try {
        const res = await apiFetch(`/api/v1/clients/livros/${id}`, { skipAuthRedirect: true });
        const json = await res.json();
        if (!res.ok) {
          if (res.status === 404) {
            setLivro([]); setAutor(null); setColaboradores(null); setCarregando(false);
            return;
          }
          throw new Error(json.error || `Erro ${res.status}`);
        }
        setLivro(json.data);
        setColaboradores(json.data.colaboradores);
        setAutor(json.data.users_profile);
        setCarregando(false);
      } catch (err) {
        console.error("Erro em BuscarLivroByAutor", err);
        setLivro([]); setCarregando(false);
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
    BuscarLivroByAutor,
  };
};
