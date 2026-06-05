import { createContext, useState } from "react";
import { apiFetch } from "../../services/api";

const PerfilContext = createContext();

export const PerfilProvider = ({ children }) => {
  const [perfil, setPerfil] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagem, setImagem] = useState(null);

  const getPerfil = async () => {
    try {
      const response = await apiFetch("/api/perfil");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar perfil");
      }

      setPerfil(data);
      setNome(data.nome || "");
      setTelefone(data.telefone || "");
      setImagem(data.imagem || "");
    } catch (error) {
      console.error("Error recolher os dados do supabase", error);
    }
  };

  const updatePerfil = async (dados) => {
    try {
      const formData = new FormData();

      formData.append("nome", dados.nome);
      formData.append("telefone", dados.telefone);

      if (dados.descricao) {
        formData.append("descricao", dados.descricao);
      }

      if (dados.imagem) {
        formData.append("imagem", dados.imagem);
      }

      const response = await apiFetch("/api/perfil/putPerfil", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil");
      }

      setPerfil(data);
    } catch (error) {
      console.error("Error ao atualizar perfil", error);
    }
  };

  return (
    <PerfilContext.Provider
      value={{
        perfil,
        nome,
        telefone,
        imagem,
        setNome,
        setTelefone,
        setImagem,
        updatePerfil,
        getPerfil,
      }}
    >
      {children}
    </PerfilContext.Provider>
  );
};
