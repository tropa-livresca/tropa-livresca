import { useContext, useCallback, useState } from "react";
import { PerfilContext } from "../../../context/PerfilContext.jsx";
import { apiFetch } from "../../../../common/services/api";

export const usePerfil = () => {
  const [popup, setPopup] = useState(null);

  const mostrarPopup = useCallback((tipo, mensagem) => {
    setPopup({
      tipo,
      mensagem,
    });
  }, []);

  const fecharPopup = useCallback(() => {
    setPopup(null);
  }, []);

  const context = useContext(PerfilContext);

  if (!context) {
    throw new Error("usePerfil deve ser utilizado dentro de um PerfilProvider");
  }

  const {
    perfil,
    setPerfil,
    nome,
    setNome,
    telefone,
    setTelefone,
    descricao,
    setDescricao,
    setImagem,
    redesSociais,
    setRedesSociais,
    previewUrl,
    setPreviewUrl,
    carregando,
    editando,
    setEditando,
    getPerfil,
  } = context;

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("imagem", file);

        const response = await apiFetch("/api/v1/clients/perfil/imagem", {
          method: "PATCH",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erro ao enviar a imagem para o servidor.");
        }

        const json = await response.json();
        const data = json && json.data ? json.data : json;

        if (!data) {
          throw new Error(
            "O servidor não retornou os dados do perfil atualizado.",
          );
        }

        const urlComCacheBuster = data.imagem
          ? `${data.imagem}?t=${Date.now()}`
          : null;

        setPreviewUrl(null);

        setTimeout(() => {
          setPerfil(data);
          setPreviewUrl(urlComCacheBuster);
        }, 50);

        mostrarPopup("sucesso", "Foto de perfil atualizada com sucesso!");
      } catch (error) {
        console.error(error);
        mostrarPopup("erro", error.message || "Erro ao carregar a imagem.");
      }
    },
    [setPerfil, setPreviewUrl, mostrarPopup],
  );

  const handleRemoverImagem = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      try {
        const response = await apiFetch("/api/v1/clients/perfil/imagem", {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Erro ao remover no servidor.");

        const json = await response.json();
        const data = json.data || json;

        setPerfil(data);
        setImagem("");
        setPreviewUrl(null);
        mostrarPopup("sucesso", "Foto de perfil removida com sucesso!");
      } catch (error) {
        console.error(error);
        mostrarPopup("erro", error.message || "Erro ao remover a imagem.");
      }
    },
    [setPerfil, setImagem, setPreviewUrl, mostrarPopup],
  );

  const handleRedeChange = useCallback(
    (plataforma, valor) => {
      setRedesSociais((prev) => ({ ...prev, [plataforma]: valor }));
    },
    [setRedesSociais],
  );

  const handleCancelar = useCallback(() => {
    setEditando(false);
    if (perfil) {
      setNome(perfil.nome || "");
      setTelefone(perfil.telefone || "");
      setDescricao(perfil.descricao || "");
      setRedesSociais({
        email: perfil.redes_sociais?.email || "",
        instagram: perfil.redes_sociais?.instagram || "",
        facebook: perfil.redes_sociais?.facebook || "",
        linkedin: perfil.redes_sociais?.linkedin || "",
      });
      setPreviewUrl(perfil.imagem || null);
      setImagem("");
    }
  }, [
    perfil,
    setEditando,
    setNome,
    setTelefone,
    setDescricao,
    setRedesSociais,
    setPreviewUrl,
    setImagem,
  ]);

  const updatePerfil = useCallback(async () => {
    try {
      const response = await apiFetch("/api/v1/clients/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          telefone,
          descricao,
          redes_sociais: redesSociais,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar dados.");

      const json = await response.json();
      const data = json.data || json;

      setPerfil(data);
      setEditando(false);
      alert("Informações atualizadas com sucesso!");
      return { success: true };
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, [nome, telefone, descricao, redesSociais, setPerfil, setEditando]);

  return {
    perfil,
    nome,
    telefone,
    descricao,
    redesSociais,
    previewUrl,
    carregando,
    editando,
    setNome,
    setTelefone,
    setDescricao,
    setEditando,
    handleFileChange,
    handleRemoverImagem,
    handleRedeChange,
    handleCancelar,
    updatePerfil,
    getPerfil,
    popup,
    fecharPopup,
  };
};
