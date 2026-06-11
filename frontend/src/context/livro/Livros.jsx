import { apiFetch } from "../../services/api";
import { createContext, useState, useCallback } from "react";

export const LivroContext = createContext();

export const LivroProvider = ({ children }) => {
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

  const BuscarLivrosByAutor = useCallback(async (id) => {
    try {

      const res = await apiFetch(`/api/livros/${id}`);

      const { data } = await res.json();

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
      console.error("Erro em BuscarLivrosByAutor", error);
      setLivros([]);
      setCarregando(false);
    };
  }, []);

  return (
    <LivroContext.Provider
      value={{
        meta,
        carregando,
        Livros,
        setMeta,
        setLivros,
        setCarregando,
        BuscarLivros,
        BuscarLivrosById
      }}
    >
      {children}
    </LivroContext.Provider>
  );
};
