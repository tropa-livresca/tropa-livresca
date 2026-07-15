import { usePerfil } from "../../hooks/usePerfil";
import styles from "./Perfil.module.css";
import Input from "../../../../../common/components/Input/Input";
import { useEffect, useState } from "react";

export default function Perfil() {
  const {
    perfil,
    nome,
    telefone,
    imagem,
    descricao,
    instagram,
    facebook,
    linkedin,
    email,
    setNome,
    setTelefone,
    setImagem,
    setDescricao,
    setInstagram,
    setFacebook,
    setLinkedin,
    setEmail,
    updatePerfil,
    getPerfil,
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
    if (perfil && perfil.imagem) {
      setPreviewUrl(perfil.imagem);
    }
  }, [perfil]);

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

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const redesParaEnviar = [];

    if (instagram)
      redesParaEnviar.push({ plataforma: "Instagram", url: instagram });

    if (facebook) 
      redesParaEnviar.push({ plataforma: "Facebook", url: facebook });

    if (linkedin)
      redesParaEnviar.push({ plataforma: "LinkedIn", url: linkedin });

    if (email) 
      redesParaEnviar.push({ plataforma: "Email", url: email });

    const resultado = await updatePerfil({
      nome,
      telefone,
      imagem,
      descricao,
      usu_redes: redesParaEnviar,
    });

    if (resultado?.success) {
      alert("Perfil updated com sucesso!");
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
        <div>
          <p>Nome Atual: {perfil.nome}</p>
          <p>Telefone Atual: {perfil.telefone}</p>
          <p>Descrição atual: {perfil.descricao}</p>
          <p>
            Instagram:{" "}
            {perfil.usu_redes?.find(
              (r) => r.plataforma.toLowerCase() === "instagram",
            )?.url || "Não informado"}
          </p>

          <p>
            Facebook:{" "}
            {perfil.usu_redes?.find(
              (r) => r.plataforma.toLowerCase() === "facebook",
            )?.url || "Não informado"}
          </p>

          <p>
            LinkedIn:{" "}
            {perfil.usu_redes?.find(
              (r) => r.plataforma.toLowerCase() === "linkedin",
            )?.url || "Não informado"}
          </p>

          <p>
            E-mail:{" "}
            {perfil.usu_redes?.find(
              (r) => r.plataforma.toLowerCase() === "email",
            )?.url || "Não informado"}
          </p>

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
              value={email}
              handleOnChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="text"
              placeholder="URL do Instagram"
              value={instagram}
              handleOnChange={(e) => setInstagram(e.target.value)}
            />

            <Input
              type="text"
              placeholder="URL do Facebook"
              value={facebook}
              handleOnChange={(e) => setFacebook(e.target.value)}
            />

            <Input
              type="text"
              placeholder="URL do LinkedIn"
              value={linkedin}
              handleOnChange={(e) => setLinkedin(e.target.value)}
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
              type="file"
              handleOnChange={handleFileChange}
              accept="image/*"
            />

            <button type="submit">Atualizar Perfil</button>
          </form>
        </div>
      )}
    </main>
  );
}
