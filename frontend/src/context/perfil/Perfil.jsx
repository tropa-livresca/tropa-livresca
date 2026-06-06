import { createContext, useState } from "react";
import { apiFetch } from "../../services/api";

export const PerfilContext = createContext();

export const PerfilProvider = ({ children }) => {
  const [perfil, setPerfil] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);

  const getPerfil = async () => {
    try {
      const response = await apiFetch("/api/perfil");
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setPerfil(null);
          setNome("");
          setDescricao("");
          setTelefone("");
          setImagem("");
          return;
        }
        throw new Error(data.error || "Erro ao buscar perfil");
      }

      setPerfil(data);
      setNome(data.nome || "");
      setDescricao(data.descricao || "");
      setTelefone(data.telefone || "");
      setImagem(data.imagem || "");
    } catch (error) {
      console.error("Error recolher os dados do supabase", error);
    }
  };

  const updatePerfil = async (dados) => {
    try {
      const formData = new FormData();

      formData.append("nome", dados.nome || "");
      formData.append("telefone", dados.telefone || "");

      if (dados.descricao) {
        formData.append("descricao", dados.descricao);
      }

      if (dados.imagem) {
        formData.append("imagem", dados.imagem);
      }

      const response = await apiFetch("/api/perfil", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil");
      }

      setPerfil(data);
      setNome(data.nome || "");
      setTelefone(data.telefone || "");
      setImagem(data.imagem || "");
      setDescricao(data.descricao || "");

      return { sucess: true };
    } catch (error) {
      console.error("Error ao atualizar perfil", error);
      return { sucess: false, error: error.message || "Erro ao atualizar perfil" };
    }
  };

  return (
    <PerfilContext.Provider
      value={{
        perfil,
        nome,
        telefone,
        imagem,
        descricao,
        setNome,
        setTelefone,
        setImagem,
        setDescricao,
        updatePerfil,
        getPerfil,
      }}
    >
      {children}
    </PerfilContext.Provider>
  );
};
