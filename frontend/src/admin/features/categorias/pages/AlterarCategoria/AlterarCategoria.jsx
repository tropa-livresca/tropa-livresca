import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoria } from "../../hooks/useCategoria";

export default function AlterarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    BuscarCategoriaById,
    AtualizarCategoria,
    nome,
    setNome,
    tipo,
    setTipo,
    descricao,
    setDescricao,
    carregando
  } = useCategoria();

  useEffect(() => {
    if (id) {
      BuscarCategoriaById(id);
    }
  }, [id, BuscarCategoriaById]);

  const handleSubmit = async (e) => {
    try {
      await AtualizarCategoria(id, e);
      navigate("/admin/categorias");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <h2>Alterar Categoria</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            type="text"
            value={nome || ""}
            onChange={(e) => setNome(e.target.value)}
            disabled={carregando}
          />
        </div>

        <div>
          <label htmlFor="tipo">Tipo:</label>
          <input
            id="tipo"
            type="text"
            value={tipo || ""}
            onChange={(e) => setTipo(e.target.value)}
            disabled={carregando}
          />
        </div>

        <div>
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            value={descricao || ""}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={carregando}
          />
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </main>
  );
}
