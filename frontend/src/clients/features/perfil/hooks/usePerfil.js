import { useState } from "react";
import { apiFetch } from "../../../../services/api";

export const usePerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [email, setEmail] = useState("");
  const [redes, setRedes] = useState([]);

  const getPerfil = async () => {
    try {
      const response = await apiFetch("/api/perfil");

      if (!response.ok) {
        if (response.status === 404) {
          setPerfil(null);
          setNome("");
          setDescricao("");
          setTelefone("");
          setImagem("");
          setInstagram("");
          setFacebook("");
          setLinkedin("");
          setEmail("");
          setRedes([]);
          return;
        }

        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      
      const dadosPerfil = json.data || json;

      const listaRedes = dadosPerfil.usu_redes || [];
      setRedes(listaRedes);

      const insta = listaRedes.find(r => r.plataforma?.toLowerCase() === "instagram");
      const face = listaRedes.find(r => r.plataforma?.toLowerCase() === "facebook");
      const linke = listaRedes.find(r => r.plataforma?.toLowerCase() === "linkedin");
      const mail = listaRedes.find(r => r.plataforma?.toLowerCase() === "email");

      setInstagram(insta ? insta.url : "");
      setFacebook(face ? face.url : "");
      setLinkedin(linke ? linke.url : "");
      setEmail(mail ? mail.url : "");
      
      setPerfil(dadosPerfil);
      setNome(dadosPerfil.nome || "");
      setDescricao(dadosPerfil.descricao || "");
      setTelefone(dadosPerfil.telefone || "");
      setImagem(dadosPerfil.imagem || "");
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

      if (dados.usu_redes) {
        formData.append("redes", JSON.stringify(dados.usu_redes));
      }

      const response = await apiFetch("/api/perfil", {
        method: "PUT",
        body: formData,
      });

      const json = await response.json();
      const data = json.data || json; 

      if (!response.ok) {
        throw new Error(json.error || "Erro ao atualizar perfil");
      }

      setPerfil(data);
      setNome(data.nome || "");
      setTelefone(data.telefone || "");
      setImagem(data.imagem || "");
      setDescricao(data.descricao || "");
      setRedes(data.usu_redes || []);

      return { sucess: true }; 
    } catch (error) {
      console.error("Error ao atualizar perfil", error);
      return { sucess: false, error: error.message || "Erro ao atualizar perfil" };
    }
  };

  return {
    perfil,
        nome,
        telefone,
        imagem,
        descricao,
        instagram,
        facebook,
        linkedin,
        email,
        redes,
        setNome,
        setTelefone,
        setImagem,
        setDescricao,
        setInstagram,
        setFacebook,
        setLinkedin,
        setEmail,
        setRedes,
        updatePerfil,
        getPerfil,
  };        
};
