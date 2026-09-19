import { apiFetch } from "../../common/services/api";
import { useState, useCallback } from "react";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [redesSociais, setRedesSociais] = useState({
    instagram: "",
    facebook: "",
    linkedin: "",
    email: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [meta, setMeta] = useState(null);

  const buscarUsuarios = useCallback(
    async (page = 1, limit = 12, busca = "", filtro = "", ordem = "") => {
      setCarregando(true);
      setMeta(null);

      console.log(ordem);

      try {
        const res = await apiFetch(
          `/api/v1/admin/usuarios/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&ordem=${ordem}&filtro=${filtro}`,
          { method: "GET", skipAuthRedirect: true },
        );

        const result = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setUsuarios([]);
            setMeta(null);
            setCarregando(false);
            return;
          }
          throw new Error(result.error || `Erro ${res.status}`);
        }

        console.log(result);

        setUsuarios(result.data || []);
        setMeta(result.meta);
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        setUsuarios([]);
        setCarregando(false);
      }
    },
    [],
  );

  const buscarUsuarioById = useCallback(async (id) => {
    setCarregando(true);
    try {
      const res = await apiFetch(`/api/v1/admin/usuarios/${id}`, {
        method: "GET",
        skipAuthRedirect: true,
      });
      console.log(id);

      const result = await res.json();
      const dadosUsuario = result.data || result;

      if (!res.ok) {
        if (res.status === 404) {
          setUsuarios([]);
          setMeta(null);
          setCarregando(false);
          return;
        }
        throw new Error(result.error || `Erro ${res.status}`);
      }

      setUsuario(dadosUsuario);
      setNome(dadosUsuario.nome || "");
      setDescricao(dadosUsuario.descricao || "");
      setTelefone(dadosUsuario.telefone || "");
      setPreviewUrl(dadosUsuario.imagem || null);
      setRedesSociais({
        email: dadosUsuario.redes_sociais?.email || "",
        instagram: dadosUsuario.redes_sociais?.instagram || "",
        facebook: dadosUsuario.redes_sociais?.facebook || "",
        linkedin: dadosUsuario.redes_sociais?.linkedin || "",
      });
    } catch (error) {
      console.error("Erro ao recolher os dados do supabase", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    meta,
    carregando,
    usuarios,
    usuario,
    nome,
    previewUrl,
    telefone,
    descricao,
    redesSociais,
    setPreviewUrl,
    setRedesSociais,
    setDescricao,
    setTelefone,
    setNome,
    setUsuarios,
    setUsuario,
    setMeta,
    setCarregando,
    buscarUsuarios,
    buscarUsuarioById,
  };
};
