import { apiFetch } from "../../../services/api";
import Input from "../../../components/form/Input/Input";
import { useEffect, useState } from "react";

export default function Perfil() {
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
    };

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
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil");
      }

      setPerfil(data);
    } catch (error) {
      console.error("Error recolher os dados do supabase", error);
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
              type="text"
              placeholder="URL da imagem"
              value={imagem || ""}
              handleOnChange={(e) => setImagem(e.target.value)}
            />
            <button type="submit">Atualizar Perfil</button>
          </form>
        </div>
      )}
    </>
  );
}
