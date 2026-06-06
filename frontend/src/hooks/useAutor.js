import {apiFetch} from "../services/api";
import { useState, useEffect } from "react";

export const useAutor = () => {
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarAutores = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await apiFetch("/api/autores/", { method: "GET" });

      const data = await response.json();

      if (response.ok) {
        setAutores(data);
      } else {
        throw new Error(data.error || "Erro ao carregar lista");
      }
    } catch (error) {
      console.error("Erro ao buscar autores", error);
      setErro("Erro ao buscar autores");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarAutores();
  }, []);

  return { autores, carregando, erro, recarregar: buscarAutores };
};
