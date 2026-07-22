import { useState } from "react";
import { apiFetch } from "../../../../common/services/api";

export const usePerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [redesSociais, setRedesSociais] = useState({
    instagram: "",
    facebook: "",
    linkedin: "",
    email: "",
  });

  const resetEstados = () => {
    setPerfil(null);
    setNome("");
    setDescricao("");
    setTelefone("");
    setImagem("");
    setRedesSociais({ instagram: "", facebook: "", linkedin: "", email: "" });
  };

  const getPerfil = async () => {
    try {
      const response = await apiFetch("/api/v1/clients/perfil");
      if (!response.ok) {
        if (response.status === 404) {
          resetEstados();
          return;
        }
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      const json = await response.json();
      const dadosPerfil = json.data || json;

      setPerfil(dadosPerfil);
      setNome(dadosPerfil.nome || "");
      setDescricao(dadosPerfil.descricao || "");
      setTelefone(dadosPerfil.telefone || "");
      setImagem(dadosPerfil.imagem || "");
      setRedesSociais({
        instagram: dadosPerfil.redes_sociais?.instagram || "",
        facebook: dadosPerfil.redes_sociais?.facebook || "",
        linkedin: dadosPerfil.redes_sociais?.linkedin || "",
        email: dadosPerfil.redes_sociais?.email || "",
      });
    } catch (error) {
      console.error("Erro ao recolher os dados do supabase", error);
    }
  };

  const tirarImagemPerfil = () => {
    setImagem("");
  };

  const updatePerfil = async (dados) => {
    try {
      const formData = new FormData();
      formData.append("nome", dados.nome || "");
      formData.append("telefone", dados.telefone || "");
      if (dados.descricao) formData.append("descricao", dados.descricao);
      
      if (dados.imagem === "") {
        formData.append("imagem", "");
      } else if (dados.imagem) {
        formData.append("imagem", dados.imagem);
      }

      formData.append("redes_sociais", JSON.stringify(dados.redes_sociais));

      const response = await apiFetch("/api/v1/clients/perfil", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Erro ${response.status} ao atualizar perfil`);
      }

      const json = await response.json();
      const data = json.data || json;

      setPerfil(data);
      setNome(data.nome || "");
      setTelefone(data.telefone || "");
      setImagem(data.imagem || "");
      setDescricao(data.descricao || "");
      setRedesSociais({
        instagram: data.redes_sociais?.instagram || "",
        facebook: data.redes_sociais?.facebook || "",
        linkedin: data.redes_sociais?.linkedin || "",
        email: data.redes_sociais?.email || "",
      });

      return { sucess: true };
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      return {
        sucess: false,
        error: error.message || "Erro ao atualizar perfil",
      };
    }
  };

  return {
    perfil, nome, telefone, imagem, descricao, redesSociais,
    setNome, setTelefone, setImagem, setDescricao, setRedesSociais,
    updatePerfil, tirarImagemPerfil, getPerfil,
  };
};
