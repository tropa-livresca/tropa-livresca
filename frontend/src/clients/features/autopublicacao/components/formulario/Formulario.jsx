import { useEffect, useState } from "react";
import styles from "./Formulario.module.css";

import { Link } from "react-router-dom";
import { useAutopublicacao } from "../../hooks/useAutopublicacao";
import { useMeusLivros } from "../../hooks/useMeusLivros";

import Detalhes from "../../pages/Detalhes/Detalhes";
import Conteudo from "../../pages/Conteudo/Conteudo";
import Orcamento from "../../pages/Orcamento/Orcamento";
import Confirmacao from "../../pages/Confirmacao/Confirmacao";
import Carregando from "../../../../components/Carregando/Carregando";

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

  const { buscarLivroById } = useMeusLivros();

  const [carregandoLivro, setCarregandoLivro] = useState(false);
  const [erroCarregar, setErroCarregar] = useState(null);
  const navegar = { irParaProximaEtapa, voltarEtapa };

  useEffect(() => {
    if (!idLivroEdicao) return;

    const buscarDadosDoLivro = async () => {
      try {
        setCarregandoLivro(true);
        setErroCarregar(null);

        const dadosDoLivroDoBanco = await buscarLivroById(idLivroEdicao);

        console.debug("Formulario: dadosDoLivroDoBanco:", dadosDoLivroDoBanco);

        if (dadosDoLivroDoBanco) {
          carregarDadosParaEdicao(dadosDoLivroDoBanco);
          setErroCarregar(null);
        } else {
          setErroCarregar("Não foram encontrados dados para este livro.");
        }
      } catch (error) {
        console.error("Erro ao inicializar dados de edição do livro:", error);
        setErroCarregar("Não foi possível carregar os dados deste livro.");
      } finally {
        setCarregandoLivro(false);
      }
    };

    buscarDadosDoLivro();
  }, [idLivroEdicao, carregarDadosParaEdicao, buscarLivroById]);

  if (carregandoLivro) {
    return <Carregando mensagem="Carregando dados do livro para edição..."/>;
  }

  if (idLivroEdicao && !carregandoLivro && erroCarregar) {
    return (
      <main>
        <div className={styles.erro}>
          {erroCarregar}
        </div>
        <Link to="/meuslivros" className={styles.btn}>
          Voltar a Meus Livros
        </Link>
      </main>
    );
  }

  const tituloFormulario = isEdicao
    ? isBloqueadoParaEdicao
      ? "Visualizar Livro"
      : "Editar Livro"
    : "Novo Livro";

  return (
    <main>
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

      <div className={styles.container}>

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
      </div>
    </main>
  );
}
