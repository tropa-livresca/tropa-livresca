import { useState } from "react";
import styles from "./NovoLivro.module.css";

import useLivros from "../../../hooks/useLivros";

import Formato from "./Formato/Formato";
import Detalhes from "./Detalhes/Detalhes";
import Conteudo from "./Conteudo/Conteudo";
import Orcamento from "./Orcamento/Orcamento";
import Confirmacao from "./Confirmacao/Confirmacao";

export default function NovoLivro() {
  const { InsertLivro } = useLivros();

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
      valorLivroFisico: "",
      valorLivroDigital: "",
    },
  });

  const [etapa, setEtapa] = useState(1);

  const validarEtapaAtual = (etapa, dadosLivro) => {
    switch (etapa) {
      case 1:
        return !!dadosLivro.formato?.tipoPublicacao;

      case 2:
        const d = dadosLivro.detalhes;
        if (!d?.titulo || !d?.idioma || !d?.descricao || !d?.direitoPublicacao) return false;
        if (!d.autor?.nome || !d.autor?.sobrenome) return false;

        if (d.colaboradores?.length > 0) {
          const colaboradoresValidos = d.colaboradores.every(c => c.funcao && c.nome && c.sobrenome);
          if (!colaboradoresValidos) return false;
        }
        return true;

      case 3:
        return !!dadosLivro.conteudo?.manuscrito && !!dadosLivro.conteudo?.capa;

      case 4:
        const o = dadosLivro.orcamento;
        return !!o?.numeroPaginas && !!o?.valorLivroFisico && !!o?.valorLivroDigital;

      default:
        return true;
    }
  };

  const irParaEtapaEspecifica = (numeroDaEtapa) => {
    setEtapa(numeroDaEtapa);
  };

  const irParaProximaEtapa = () => {
    if (validarEtapaAtual(etapa, dadosLivro)) {
      setEtapa((atual) => Math.min(atual + 1, 5));
    } else {
      alert("Por favor, preencha todos os campos obrigatórios antes de continuar.");
    }
  };

  const voltarEtapa = () => {
    if (validarEtapaAtual(etapa, dadosLivro)) {
      setEtapa((atual) => Math.max(atual - 1, 1));
    } else {
      alert("Por favor, preencha todos os campos obrigatórios antes de continuar.");
    }
  };

  const atualizarEtapa = (chave) => (novosDados) => {
    setDadosLivro((atual) => ({
      ...atual,
      [chave]: novosDados,
    }));
  };

  const navegar = { irParaProximaEtapa, voltarEtapa };

  const publicarLivro = async (publicar = true) => {
    await InsertLivro(dadosLivro, publicar);
  };

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
            irParaEtapaEspecifica={irParaEtapaEspecifica}
            publicarLivro={publicarLivro}
          />
        )}
      </main>
    </>
  );
}
