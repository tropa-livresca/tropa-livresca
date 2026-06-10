import { apiFetch } from "../../services/api";

import { createContext, useState, useEffect } from "react";

export const LivroContext = createContext();

export const LivroProvider = ({ children }) => {

  const [Livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const BuscarLivros = async () => {
    setLivros([]);

    try {
      const res = await apiFetch("/api/livros/", { Method: "Get" });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setCarregando(true);
          setLivros([]);
          return;
        }

        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      const livros = data || [];
      setLivros(livros);
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  }

  const BuscarLivrosById = async () => {
    setLivros([]);
    try {
      const res = await apiFetch("/api/meuslivros/", { Method: "GET" });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivros([]);
          setCarregando(true);
          return;
        }

        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      const livros = data || [];
      setLivros(livros);
      setCarregando(false);
    } catch (error) {
      console.error("Erro em GetLivrosById", error);
    }
  };

  return (
    <LivroContext.Provider
      value={{
        carregando,
        Livros,
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
