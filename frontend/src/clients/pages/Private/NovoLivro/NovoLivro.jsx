import { useState } from "react";
import styles from "./NovoLivro.module.css";

import useLivros from "../../../hooks/useLivros";

import Formato from "./Formato/Formato";
import Detalhes from "./Detalhes/Detalhes";
import Conteudo from "./Conteudo/Conteudo";
import Orcamento from "./Orcamento/Orcamento";
import Confirmacao from "./Confirmacao/Confirmacao";

export default function NovoLivro() {
  const [dadosLivro, setDadosLivro] = useState({
    formato: {
      tipoPublicacao: "",
    },
    detalhes: {
      idioma: "",
      titulo: "",
      subtitulo: "",
      numeroEdicao: "",
      autor: {
        nome: "",
        sobrenome: "",
      },
      colaboradores: [],
      descricao: "",
      direitoPublicacao: "",
      publicoPrincipal: "",
      categorias: [],
      palavrasChave: [],
    },
    conteudo: {
      manuscrito: null,
      capa: null,
    },
    orcamento: {
      tipoFormatacao: "",
      valorLivroFisico: "",
      valorLivroDigital: "",
    },
  });

  const [etapa, setEtapa] = useState(1);

  const irParaProximaEtapa = () => {
    setEtapa((atual) => Math.min(atual + 1, totalEtapas));
  };

  const voltarEtapa = () => {
    setEtapa((atual) => Math.max(atual - 1, 1));
  };

  const atualizarEtapa = (chave) => (novosDados) => {
    setDadosLivro((atual) => ({
      ...atual,
      [chave]: novosDados,
    }));
  };

  const navegar = { irParaProximaEtapa, voltarEtapa };

  return (
    <>
      <h1>Novo Livro</h1>
      <span>Etapa {etapa} de 5</span>

      <main className={styles.conteinerPrincipal}>
        {etapa === 1 && (
          <Formato
            dados={dadosLivro.formato}
            onChange={atualizarEtapa("formato")}
            {...navegar}
          />
        )}

        {etapa === 2 && (
          <Detalhes
            dados={dadosLivro.detalhes}
            onChange={atualizarEtapa("detalhes")}
            {...navegar}
          />
        )}

        {etapa === 3 && (
          <Conteudo
            dados={dadosLivro.conteudo}
            onChange={atualizarEtapa("conteudo")}
            {...navegar}
          />
        )}

        {etapa === 4 && (
          <Orcamento
            dados={dadosLivro.orcamento}
            onChange={atualizarEtapa("orcamento")}
            {...navegar}
          />
        )}

        {etapa === 5 && (
          <Confirmacao
            dados={dadosLivro}
            {...navegar}
          />
        )}
      </main>
    </>
  );
}
