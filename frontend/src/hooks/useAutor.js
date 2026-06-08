import { apiFetch } from "../services/api";
import { useState } from "react";

export const useAutor = () => {
  const [autor, setAutor] = useState(null);

  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarAutorById = async (id) => {
    setCarregando(true);
    setErro(null);

    try {
        const response = await apiFetch(`/api/autores/${id}`, { method: "GET" });

        const data = await response.json();

        if (response.ok) {
            setAutor(data);
        }else{
            throw new Error(data.error || "Erro ao carregar autor");
        }

        
    }catch(error){
        console.error("Erro ao buscar autor por id", error);
        setErro("Erro ao buscar autor");
    }
    finally{
        setCarregando(false);
    }
  }

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

  return {
    autores,
    carregando,
    erro,
    recarregar: buscarAutores,
    buscarAutores,
    autor,
    buscarAutorById,
  };
};
