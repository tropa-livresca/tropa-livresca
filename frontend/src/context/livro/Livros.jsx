import { createContext, useState } from "react";
import { apiFetch } from "../../services/api";

const LivroContext = createContext();

export const GetLivros = async () => {
  try {
    const res = await apiFetch("/api/livros/", { method: "GET" });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      return data.error;
    }

    return data;
  } catch {
    return "error";
  }
};

export const LivroProvider = ({ children }) => {
  const [livros, setLivros] = useState([]);

  return (
    <LivroContext.Provider
      value={{
        livros,
        setLivros,
        GetLivros,
      }}
    >
      {children}
    </LivroContext.Provider>
  );
};
