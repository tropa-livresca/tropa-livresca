import { useState, useEffect } from "react";
import styles from "./NovoLivro.module.css";

import useLivros from "../../../hooks/useLivros";

import Detalhes from "./Detalhes/Detalhes";
import Conteudo from "./Conteudo/Conteudo";
import Orcamento from "./Orcamento/Orcamento";
import Confirmacao from "./Confirmacao/Confirmacao";

const ESTADO_INICIAL = {
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
}
export default function NovoLivro() {
  const { InsertLivro } = useLivros();

  const [dadosLivro, setDadosLivro] = useState(() => {
    const salvos = localStorage.getItem("rascunhoDadosLivro");
    return salvos ? JSON.parse(salvos) : ESTADO_INICIAL;
  });

  const [etapa, setEtapa] = useState(() => {
    const etapaSalva = localStorage.getItem("rascunhoEtapaLivro");
    return etapaSalva ? Number(etapaSalva) : 1;
  });

  useEffect(() => {
    localStorage.setItem("rascunhoEtapaLivro", etapa.toString());

    const dadosParaSalvar = {
      ...dadosLivro,
      conteudo: { manuscrito: null, capa: null }
    }

    localStorage.setItem("rascunhoDadosLivro", JSON.stringify(dadosParaSalvar));
  }, [dadosLivro, etapa]);

  const validarEtapaAtual = (etapa, dadosLivro) => {
    switch (etapa) {
      case 1:
        const d = dadosLivro.detalhes;
        if (!d?.titulo || !d?.idioma || !d?.descricao || !d?.direitoPublicacao) return false;
        if (!d.autor?.nome || !d.autor?.sobrenome) return false;

        if (d.colaboradores?.length > 0) {
          const colaboradoresValidos = d.colaboradores.every(c => c.funcao && c.nome && c.sobrenome);
          if (!colaboradoresValidos) return false;
        }
        return true;

      case 2:
        const c = dadosLivro.conteudo;
        return !!c?.manuscrito && !!c?.capa.frente && !!c?.capa.verso && !!c?.capa.orelhas;

      case 3:
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
      setEtapa((atual) => Math.min(atual + 1, 4));
    } else {
      alert("Por favor, preencha todos os campos obrigatórios antes de continuar.");
    }
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

  const publicarLivro = async (publicar = true) => {
    await InsertLivro(dadosLivro, publicar);
    localStorage.removeItem("rascunhoDadosLivro");
    localStorage.removeItem("rascunhoEtapaLivro");
  };

  return (
    <>
      <main>
        <h1>Novo Livro</h1>
        <span>Etapa {etapa} de 4</span>

        {etapa === 1 && (
          <Detalhes
            dados={dadosLivro.detalhes}
            onChange={atualizarEtapa("detalhes")}
            {...navegar}
          />
        )}

        {etapa === 2 && (
          <Conteudo
            dados={dadosLivro.conteudo}
            onChange={atualizarEtapa("conteudo")}
            {...navegar}
          />
        )}

        {etapa === 3 && (
          <Orcamento
            dados={dadosLivro.orcamento}
            onChange={atualizarEtapa("orcamento")}
            {...navegar}
          />
        )}

        {etapa === 4 && (
          <Confirmacao
            dados={dadosLivro}
            irParaEtapaEspecifica={irParaEtapaEspecifica}
            publicarLivro={publicarLivro}
          />
        )}
      </main >
    </>
  );
}
