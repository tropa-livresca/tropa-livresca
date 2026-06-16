import { apiFetch } from "../../services/api";
import { createContext, useState, useCallback } from "react";

export const LivroContext = createContext();

export const LivroProvider = ({ children }) => {
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
        `/api/livros/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}`,
        { method: "GET" }
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

  const BuscarLivrosById = useCallback(async () => {
    setCarregando(true);
    setLivros([]);
    try {
      const res = await apiFetch("/api/meuslivros/", { method: "GET" });
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

  const UpdateStatusAtivo = useCallback(async (id,ativo) => {
    setCarregando(true);
    try {
      const res = await apiFetch("/api/meuslivros/updateA/"+id, { method: "POST" });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }
      setCarregando(false);
    } catch (error) {
      console.error("Erro em UpdateStatusAtivo", error);
      setCarregando(false);
    }
  }, []);

  const BuscarLivroByAutor = useCallback(async (id) => {
    setLivro([]);
    setColaboradores(null);
    setAutor(null);
    setCarregando(true);

    try {

      const res = await apiFetch(`/api/livros/${id}`);

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivro([]);
          setAutor(null);
          setColaboradores(null);
          setCarregando(false);
          return;
        }
        throw new Error(json.error || `Erro ${res.status}`);
      }

      const livroData = json.data;
      setLivro(livroData);

      const colaboradoresData = json.data.colaboradores;
      setColaboradores(colaboradoresData);

      const autorData = json.data.users_profile;
      setAutor(autorData);

      setCarregando(false);
    } catch (err) {
      console.error("Erro em BuscarLivroByAutor", err);
      setLivro([]);
      setCarregando(false);
    };
  }, []);

  const InsertLivro = useCallback(async () => {
    setCarregando(true);
    console.log("l");
    try {
      console.log("k");
      const res = await apiFetch("/api/livros/insertLivro", { method: "POST" });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }
      setCarregando(false);
    } catch (error) {
      console.error("Erro em UpdateStatusAtivo", error);
      setCarregando(false);
    }
  }, []);

  return (
    <LivroContext.Provider
      value={{
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
        BuscarLivrosById,
        UpdateStatusAtivo,
        BuscarLivroByAutor,
        InsertLivro,
      }}
    >
      {children}
    </LivroContext.Provider>
  );
};
