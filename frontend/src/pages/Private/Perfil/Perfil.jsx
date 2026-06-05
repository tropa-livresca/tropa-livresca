import usePerfil from "../../../hooks/usePerfil";
import Styles from "../Perfil.module.css";
import Input from "../../../components/form/Input/Input";
import { useEffect, useState } from "react";

export default function Perfil() {
  const {updatePerfil} = usePerfil();

  const [perfil, setPerfil] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagem, setImagem] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updatePerfil();
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
            <Input
              type="file"
              placeholder="URL da imagem"
              value={imagem || ""}
              handleOnChange={handleFileChange}
            />
            <button type="submit">Atualizar Perfil</button>
          </form>
        </div>
      )}
    </>
  );
}
