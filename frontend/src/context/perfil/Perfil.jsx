import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../../services/api";

const PerfilContext = createContext();

export const PerfilProvider = ({ children }) => {
  const [perfil, setPerfil] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
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
}
  
  getPerfil();
}, []);

const updatePerfil = async () => {
  try {
    const response = await apiFetch("/api/perfil", {
      method: "PUT",
      body: JSON.stringify({
        nome,
        telefone,
        imagem,
      }),
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao atualizar perfil");
    }

    setPerfil(data);
  } catch (error) {
    console.error("Error recolher os dados do supabase", error);
  }
}

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
