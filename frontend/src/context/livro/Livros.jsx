import { apiFetch } from "../../services/api";

import { createContext, useState, useEffect } from "react";


export const LivroContext = createContext();

export const LivroProvider = ({ children }) => {

  const [livros, setLivros] = useState([]);

  const GetLivros = async () => {
    try {
      const res = await apiFetch("/api/livros/", { Method: "Get" });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erro da API", data.error);
        return [];
      }

      return data.data || data;

    } catch (err){
      console.error("Erro ao buscar livros:", err);
      return[];
    }
  }

  const GetLivrosByAutor = async (userId) => {
    try {
      const res = await apiFetch("/api/livros/" + userId, { Method: "GET" });

      const data = await res.json();

      if (!res.ok) {
        return [];
      }

      return data.data || data;

    } catch {
      return [];
    }
  }

  return (
    <LivroContext.Provider
      value={{
        livros,
        setLivros,
        GetLivros,
        GetLivrosByAutor
      }}
    >
      {children}
    </LivroContext.Provider>
  );
};
