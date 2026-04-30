import usePerfil from "../../../hooks/usePerfil";
import Styles from "./Perfil.module.css";
import Input from "../../../components/form/Input/Input";
import { useEffect, useState } from "react";

export default function Perfil() {
  const {
    perfil,
    nome,
    telefone,
    imagem,
    setNome,
    setTelefone,
    setImagem,
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
    const file = e.target.files[0];

    if (file) {
      setImagem(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultado = await updatePerfil({ nome, telefone, imagem });

    if (resultado?.sucess) {
      alert("Perfil atualizado com sucesso!");
    } else {
      alert(`Erro ao atualizar perfil: ${resultado.error}`);
    }
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <h1>Bem-vindo ao seu perfil!</h1>
      {perfil && (
        <div>
          <p>Nome Atual: {perfil.nome}</p>
          <p>Telefone Atual: {perfil.telefone}</p>
          {perfil.imagem && <img src={perfil.imagem} alt="Imagem de perfil" />}

          <form onSubmit={handleSubmit}>
            <div>
              {previewUrl ? (<img src={previewUrl} alt="Pré-visualização" width="150" />) : (
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

            <Input type="file" handleOnChange={handleFileChange}
              accept="image/*" />

            <button type="submit">Atualizar Perfil</button>
          </form>
        </div>
      )}
    </>
  );
}
