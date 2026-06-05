import usePerfil from "../../../hooks/usePerfil";
import Styles from "./Perfil.module.css";
import Input from "../../../components/form/Input/Input";
import { useEffect } from "react";

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

  useEffect(() => {
    getPerfil();
  }, [getPerfil]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImagem(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePerfil({
      nome,
      telefone,
      imagem,
    });
  };

  return (
    <>
      <h1>Bem-vindo ao seu perfil!</h1>
      {perfil && (
        <div>
          <p>Nome: {perfil.nome}</p>
          <p>Telefone: {perfil.telefone}</p>
          {perfil.imagem && <img src={perfil.imagem} alt="Imagem de perfil" />}

          <form onSubmit={handleSubmit}>
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
            <Input type="file" handleOnChange={handleFileChange} />
            <button type="submit">Atualizar Perfil</button>
          </form>
        </div>
      )}
    </>
  );
}
