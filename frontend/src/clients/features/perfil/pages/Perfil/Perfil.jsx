import { usePerfil } from "../../hooks/usePerfil";
import styles from "./Perfil.module.css";
import Input from "../../../../../common/components/Input/Input";
import { useEffect, useState } from "react";

export default function Perfil() {
  const {
    perfil, nome, telefone, imagem, descricao, redesSociais,
    setNome, setTelefone, setImagem, setDescricao, setRedesSociais,
    updatePerfil, getPerfil,
  } = usePerfil();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      await getPerfil();
      setCarregando(false);
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (perfil) {
      if (perfil.imagem && imagem === "") {
        setPreviewUrl(perfil.imagem);
      } else if (imagem === "remover") {
        setPreviewUrl(null);
      }

      if (perfil.nome && !nome) setNome(perfil.nome);
      if (perfil.telefone && !telefone) setTelefone(perfil.telefone);
      if (perfil.descricao && !descricao) setDescricao(perfil.descricao);
    }
  }, [perfil, imagem]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoverImagem = (e) => {
    e.preventDefault();
    setImagem("remover");
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRedeChange = (plataforma, valor) => {
    setRedesSociais((prev) => ({ ...prev, [plataforma]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const resultado = await updatePerfil({
      nome,
      telefone,
      imagem: imagem === "remover" ? "" : imagem,
      descricao,
      redes_sociais: redesSociais,
    });

    if (resultado?.sucess) {
      alert("Perfil atualizado com sucesso!");
    } else {
      alert(`Erro ao atualizar perfil: ${resultado?.error || "Erro desconhecido"}`);
    }
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Bem-vindo ao seu perfil!</h1>
      </div>

      {perfil && (
        <div className={styles.dadosAtuais}>
          <p>Nome Atual: {perfil.nome || "Não informado"}</p>
          <p>Telefone Atual: {perfil.telefone || "Não informado"}</p>
          <p>Descrição atual: {perfil.descricao || "Não informado"}</p>
          <p>Instagram: {perfil.redes_sociais?.instagram || "Não informado"}</p>
          <p>Facebook: {perfil.redes_sociais?.facebook || "Não informado"}</p>
          <p>LinkedIn: {perfil.redes_sociais?.linkedin || "Não informado"}</p>
          <p>E-mail: {perfil.redes_sociais?.email || "Não informado"}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          {previewUrl ? (
            <img src={previewUrl} alt="Pré-visualização" width="150" />
          ) : (
            <div>Sem foto</div>
          )}
        </div>

        <Input
          type="text"
          placeholder="Nome"
          value={nome}
          handleOnChange={(e) => setNome(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Telefone"
          value={telefone}
          handleOnChange={(e) => setTelefone(e.target.value)}
        />
        <Input
          type="text"
          placeholder="E-mail de contato"
          value={redesSociais.email}
          handleOnChange={(e) => handleRedeChange("email", e.target.value)}
        />
        <Input
          type="text"
          placeholder="URL do Instagram"
          value={redesSociais.instagram}
          handleOnChange={(e) => handleRedeChange("instagram", e.target.value)}
        />
        <Input
          type="text"
          placeholder="URL do Facebook"
          value={redesSociais.facebook}
          handleOnChange={(e) => handleRedeChange("facebook", e.target.value)}
        />
        <Input
          type="text"
          placeholder="URL do LinkedIn"
          value={redesSociais.linkedin}
          handleOnChange={(e) => handleRedeChange("linkedin", e.target.value)}
        />

        <textarea
          id="Descricao"
          name="descricao"
          rows="5"
          cols="30"
          placeholder="Digite sua descrição..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>

        <Input
          key={imagem === "" || imagem === "remover" ? "resetado" : "com-arquivo"}
          type="file"
          handleOnChange={handleFileChange}
          accept="image/*"
        />

        <button type="button" onClick={handleRemoverImagem}>Tirar imagem do perfil</button>
        <button type="submit">Atualizar Perfil</button>
      </form>
    </main>
  );
}
