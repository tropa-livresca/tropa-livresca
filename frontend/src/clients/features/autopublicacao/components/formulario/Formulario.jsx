import { useEffect, useState } from "react";
import styles from "./Formulario.module.css";

import { Link } from "react-router-dom";
import { useAutopublicacao } from "../../hooks/useAutopublicacao";
import { useMeusLivros } from "../../hooks/useMeusLivros";

import Detalhes from "../../pages/Detalhes/Detalhes";
import Conteudo from "../../pages/Conteudo/Conteudo";
import Orcamento from "../../pages/Orcamento/Orcamento";
import Confirmacao from "../../pages/Confirmacao/Confirmacao";

export default function Formulario({ idLivroEdicao }) {
  const {
    dadosLivro,
    etapa,
    isEdicao,
    estadoAtualLivro,
    isBloqueadoParaEdicao,
    carregarDadosParaEdicao,
    atualizarEtapa,
    irParaProximaEtapa,
    voltarEtapa,
    irParaEtapaEspecifica,
    publicarLivro,
  } = useAutopublicacao();

  const { BuscarLivroById } = useMeusLivros();

  const [carregandoLivro, setCarregandoLivro] = useState(false);
  const navegar = { irParaProximaEtapa, voltarEtapa };

  useEffect(() => {
    if (!idLivroEdicao) return;

    const buscarDadosDoLivro = async () => {
      try {
        setCarregandoLivro(true);

        const dadosDoLivroDoBanco = await BuscarLivroById(idLivroEdicao);

        if (dadosDoLivroDoBanco) {
          carregarDadosParaEdicao(dadosDoLivroDoBanco);
        }
      } catch (error) {
        console.error("Erro ao inicializar dados de edição do livro:", error);
        alert("Não foi possível carregar os dados deste livro.");
      } finally {
        setCarregandoLivro(false);
      }
    };

    buscarDadosDoLivro();
  }, [idLivroEdicao, carregarDadosParaEdicao, BuscarLivroById]);

  if (carregandoLivro) {
    return <div>Carregando dados do livro para edição...</div>;
  }

  const tituloFormulario = isEdicao
    ? isBloqueadoParaEdicao
      ? "Visualizar Livro"
      : "Editar Livro"
    : "Novo Livro";

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>{tituloFormulario}</h1>
        {isBloqueadoParaEdicao && (
          <div
            style={{
              color: "orange",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Este livro está em modo de leitura (revisado ou publicado) e não
            pode ser alterado.
          </div>
        )}
        <span className={styles.descricao}>
          Etapa <span className={styles.numero}>{etapa}</span> de{" "}
          <span className={styles.numero}>4</span>
        </span>
      </div>

      {etapa === 1 && (
        <Detalhes
          dados={dadosLivro.detalhes}
          onChange={atualizarEtapa("detalhes")}
          estadoAtualLivro={estadoAtualLivro}
          isBloqueadoParaEdicao={isBloqueadoParaEdicao}
          {...navegar}
        />
      )}

      {etapa === 2 && (
        <Conteudo
          dados={dadosLivro.conteudo}
          onChange={atualizarEtapa("conteudo")}
          isEdicao={isEdicao}
          isBloqueadoParaEdicao={isBloqueadoParaEdicao}
          {...navegar}
        />
      )}

      {etapa === 3 && (
        <Orcamento
          dados={dadosLivro.orcamento}
          onChange={atualizarEtapa("orcamento")}
          isBloqueadoParaEdicao={isBloqueadoParaEdicao}
          {...navegar}
        />
      )}

      {etapa === 4 && (
        <Confirmacao
          dados={dadosLivro}
          isEdicao={isEdicao}
          estadoAtualLivro={estadoAtualLivro}
          isBloqueadoParaEdicao={isBloqueadoParaEdicao}
          irParaEtapaEspecifica={irParaEtapaEspecifica}
          publicarLivro={publicarLivro}
        />
      )}
  <button className={styles.btn}>
      <Link to="/meuslivros" >
        Voltar a Meus Livros
      </Link>
      </button>
    </main>
  );
}
