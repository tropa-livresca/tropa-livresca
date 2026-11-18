import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback, useContext, useEffect } from "react";
import { AutopublicacaoContext } from "./AutopublicacaoContext";
import { AuthContext } from "../../../../common/context/auth/AuthContext";
import { LIVRO_ESTADO } from "../../../../common/config/livroEstados";
import Popup from "../../../components/PopUp/Popup";
import {
  salvarRascunho,
  buscarRascunho,
  removerRascunho,
} from "../services/rascunhoDB.js";

const ESTADO_INICIAL_LIVRO = {
  detalhes: {
    idioma: "",
    titulo: "",
    subtitulo: "",
    ISBN: "",
    colaboradores: [],
    descricao: "",
    direitoPublicacao: "",
    categoria: "",
  },

  conteudo: {
    manuscrito: null,
    capa: {
      frente: null,
      verso: null,
    },
  },

  orcamento: {
    valorLivroFisico: "",
    valorLivroDigital: "",
    numeroPaginas: "",
  },
};

export const AutopublicacaoProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const userId = user?.id;

  const [popup, setPopup] = useState(null);

  const mostrarPopup = useCallback((tipo, mensagem) => {
    setPopup({
      tipo,

      mensagem,
    });
  }, []);

  const fecharPopup = useCallback(() => {
    setPopup(null);
  }, []);

  const [carregando, setCarregando] = useState(false);
  const [isEdicao, setIsEdicao] = useState(false);
  const [estadoAtualLivro, setEstadoAtualLivro] = useState(null);
  const [dadosLivro, setDadosLivro] = useState(ESTADO_INICIAL_LIVRO);
  const [etapa, setEtapa] = useState(1);
  const [rascunhoUsuarioId, setRascunhoUsuarioId] = useState(null);
  const [erro, setErro] = useState(null);

  const chaveRascunho = useCallback(
    (nome) =>
      userId ? `autopublicacao:${encodeURIComponent(userId)}:${nome}` : null,
    [userId],
  );

  useEffect(() => {
    setDadosLivro(ESTADO_INICIAL_LIVRO);
    setEtapa(1);
    setRascunhoUsuarioId(null);
    setIsEdicao(false);
    setEstadoAtualLivro(null);

    if (!userId) return;

    let ativo = true;

    const recuperarRascunho = async () => {
      try {
        const dadosSalvos = await buscarRascunho(userId);

        const etapaSalva = Number(localStorage.getItem(chaveRascunho("etapa")));

        if (!ativo) return;

        if (dadosSalvos?.dadosLivro) {
          setDadosLivro({
            ...ESTADO_INICIAL_LIVRO,
            ...dadosSalvos.dadosLivro,
            detalhes: {
              ...ESTADO_INICIAL_LIVRO.detalhes,
              ...dadosSalvos.dadosLivro.detalhes,
            },
            conteudo: {
              ...ESTADO_INICIAL_LIVRO.conteudo,
              ...dadosSalvos.dadosLivro.conteudo,
              capa: {
                ...ESTADO_INICIAL_LIVRO.conteudo.capa,
                ...dadosSalvos.dadosLivro.conteudo?.capa,
              },
            },
            orcamento: {
              ...ESTADO_INICIAL_LIVRO.orcamento,
              ...dadosSalvos.dadosLivro.orcamento,
            },
          });
        }

        if (etapaSalva >= 1 && etapaSalva <= 4) {
          setEtapa(etapaSalva);
        }

        setRascunhoUsuarioId(userId);
      } catch (error) {
        console.error("Erro ao recuperar rascunho:", error);

        if (ativo) {
          setRascunhoUsuarioId(userId);
          mostrarPopup(
            "erro",
            "Não foi possível recuperar o rascunho salvo neste dispositivo.",
          );
        }
      }
    };

    recuperarRascunho();

    return () => {
      ativo = false;
    };
  }, [userId, chaveRascunho, mostrarPopup]);

  useEffect(() => {
    if (isEdicao || !userId || rascunhoUsuarioId !== userId) {
      return;
    }

    localStorage.setItem(chaveRascunho("etapa"), etapa.toString());

    const timeout = setTimeout(async () => {
      try {
        await salvarRascunho(userId, {
          dadosLivro,
          etapa,
        });
      } catch (error) {
        console.error("Erro ao salvar rascunho:", error);

        setErro("Não foi possível salvar o rascunho neste dispositivo.");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [userId, dadosLivro, etapa, isEdicao, rascunhoUsuarioId, chaveRascunho]);

  const carregarDadosParaEdicao = useCallback(async (dadosBanco) => {
    if (!dadosBanco) return;

    setIsEdicao(true);

    setEstadoAtualLivro(dadosBanco.estado || LIVRO_ESTADO.RASCUNHO);

    setEtapa(1);

    const manuscrito = dadosBanco.manuscritoUrl || null;

    const capa = {
      frente: dadosBanco.capa_frenteUrl || null,
      verso: dadosBanco.capa_versoUrl || null,
    };

    const normalizeBool = (valor) => {
      if (
        valor === true ||
        valor === "true" ||
        valor === "sim" ||
        valor === "1" ||
        valor === 1
      ) {
        return true;
      }

      if (
        valor === false ||
        valor === "false" ||
        valor === "nao" ||
        valor === "não" ||
        valor === "0" ||
        valor === 0
      ) {
        return false;
      }

      return undefined;
    };

    const direitoNorm = normalizeBool(dadosBanco.direitos_de_publicacao);

    const direitoPublicacao =
      direitoNorm === true ? "sim" : direitoNorm === false ? "nao" : "";

    setDadosLivro({
      id: dadosBanco.id,

      detalhes: {
        idioma: dadosBanco.idioma || "",

        titulo: dadosBanco.titulo || "",

        subtitulo: dadosBanco.subtitulo || "",

        ISBN: dadosBanco.ISBN || "",

        colaboradores: dadosBanco.colaboradores || [],

        descricao: dadosBanco.descricao || "",

        direitoPublicacao,

        categoria: dadosBanco.categoria || "",
      },

      conteudo: {
        manuscrito,
        capa,
      },

      orcamento: {
        valorLivroFisico: dadosBanco.preco_fisico ?? "",

        valorLivroDigital: dadosBanco.preco_digital ?? "",

        numeroPaginas: dadosBanco.numero_paginas ?? "",
      },
    });
  }, []);

  const detalhes = dadosLivro.detalhes;

  const conteudo = dadosLivro.conteudo;

  const orcamento = dadosLivro.orcamento;

  const validarDetalhes = () => {
    if (
      !detalhes.titulo ||
      !detalhes.idioma ||
      !detalhes.descricao ||
      !detalhes.direitoPublicacao ||
      !detalhes.categoria ||
      !detalhes.subtitulo
    ) {
      return false;
    }

    return (
      !detalhes.colaboradores?.length ||
      detalhes.colaboradores.every(
        (colaborador) =>
          colaborador.funcao && colaborador.nome && colaborador.sobrenome,
      )
    );
  };

  const validarConteudo = () =>
    Boolean(
      (conteudo.manuscrito || conteudo.manuscritoPath) &&
      (conteudo.capa?.frente || conteudo.capaPaths?.frente) &&
      (conteudo.capa?.verso || conteudo.capaPaths?.verso),
    );

  const validarOrcamento = () =>
    !!orcamento.valorLivroFisico && !!orcamento.valorLivroDigital;

  const validarEtapaAtual = (etapaAtual) => {
    switch (etapaAtual) {
      case 1:
        return validarDetalhes();

      case 2:
        return validarConteudo();

      case 3:
        return validarOrcamento();

      default:
        return true;
    }
  };

  const irParaEtapaEspecifica = (numeroDaEtapa) => setEtapa(numeroDaEtapa);

  const voltarEtapa = () => setEtapa((atual) => Math.max(atual - 1, 1));

  const irParaProximaEtapa = () => {
    if (validarEtapaAtual(etapa)) {
      setEtapa((atual) => Math.min(atual + 1, 4));
    } else {
      mostrarPopup(
        "erro",

        "Preencha todos os campos obrigatórios antes de continuar.",
      );
    }
  };

  const atualizarEtapa = (chave) => (novosDados) => {
    if (chave === "detalhes" && estadoAtualLivro === LIVRO_ESTADO.PUBLICADO) {
      const dadosAntigos = dadosLivro.detalhes;

      if (novosDados.titulo !== dadosAntigos.titulo) {
        mostrarPopup(
          "erro",

          "Não é permitido alterar o Título ou o Autor de um livro já publicado.",
        );

        return;
      }
    }

    setDadosLivro((estadoAnterior) => {
      if (chave === "conteudo") {
        const { numeroPaginas, ...dadosConteudo } = novosDados;

        return {
          ...estadoAnterior,

          conteudo: dadosConteudo,

          orcamento: {
            ...estadoAnterior.orcamento,

            ...(Number.isInteger(Number(numeroPaginas)) &&
            Number(numeroPaginas) > 0
              ? { numeroPaginas: Number(numeroPaginas) }
              : {}),
          },
        };
      }

      return {
        ...estadoAnterior,

        [chave]: novosDados,
      };
    });
  };

  const converterParaArquivo = useCallback((arquivo, nome, mimePadrao) => {
    if (!arquivo) return null;

    if (arquivo instanceof File) return arquivo;

    if (arquivo instanceof Blob) {
      return new File([arquivo], nome, {
        type: arquivo.type || mimePadrao,
      });
    }

    if (typeof arquivo !== "string" || !arquivo.startsWith("data:")) {
      return null;
    }

    const [metadata, encoded] = arquivo.split(",");
    const mimeType = metadata.match(/data:(.*?);base64/)?.[1];

    if (!encoded || !mimeType) {
      throw new Error(`Arquivo ${nome} inválido.`);
    }

    const byteString = atob(encoded);
    const bytes = new Uint8Array(byteString.length);

    for (let index = 0; index < byteString.length; index++) {
      bytes[index] = byteString.charCodeAt(index);
    }

    return new File([bytes], nome, {
      type: mimeType || mimePadrao,
    });
  }, []);
  const inserirLivro = useCallback(
    async (dadosDoLivro, estadoDesejado = LIVRO_ESTADO.RASCUNHO) => {
      if (
        estadoAtualLivro === LIVRO_ESTADO.EM_REVISAO ||
        estadoAtualLivro === LIVRO_ESTADO.PUBLICADO
      ) {
        throw new Error("Este livro está travado para alterações no momento.");
      }

      setCarregando(true);

      try {
        if (!user?.id || typeof user.id !== "string") {
          throw new Error("ID do usuário inválido.");
        }

        const { detalhes, conteudo, orcamento } = dadosDoLivro;

        const formData = new FormData();

        const dadosParaEnviar = {
          detalhes,
          orcamento,
        };

        formData.append("dadosLivro", JSON.stringify(dadosParaEnviar));

        if (!isEdicao) {
          formData.append("estadoInicial", estadoDesejado);
        }

        const arquivos = [
          {
            campo: "manuscrito",
            arquivo: conteudo.manuscrito,
            nome: "manuscrito.pdf",
            mime: "application/pdf",
          },
          {
            campo: "capa_frente",
            arquivo: conteudo.capa?.frente,
            nome: "capa-frente",
            mime: "image/jpeg",
          },
          {
            campo: "capa_verso",
            arquivo: conteudo.capa?.verso,
            nome: "capa-verso",
            mime: "image/jpeg",
          },
        ];

        for (const item of arquivos) {
          const arquivo = converterParaArquivo(
            item.arquivo,
            item.nome,
            item.mime,
          );

          if (arquivo) {
            formData.append(item.campo, arquivo);
          }
        }

        const rota = isEdicao
          ? `/api/v1/clients/autopublicacao/${dadosDoLivro.id}`
          : "/api/v1/clients/autopublicacao/";

        const metodo = isEdicao ? "PATCH" : "POST";

        const res = await apiFetch(rota, {
          method: metodo,
          body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || `Erro ${res.status}`);
        }

        setErro(null);
        return json;
      } catch (error) {
        console.error("Erro ao salvar livro:", error);
        setErro(error.message);
        throw error;
      } finally {
        setCarregando(false);
      }
    },
    [user, isEdicao, estadoAtualLivro, converterParaArquivo],
  );

  const publicarLivroNoContexto = async (
    estadoDesejado = LIVRO_ESTADO.RASCUNHO,
  ) => {
    try {
      await inserirLivro(dadosLivro, estadoDesejado);

      if (userId) {
        await removerRascunho(userId);

        localStorage.removeItem(chaveRascunho("etapa"));
      }

      setErro(null);
      setDadosLivro(ESTADO_INICIAL_LIVRO);
      setIsEdicao(false);
      setEstadoAtualLivro(null);
      setEtapa(1);
    } catch (error) {
      setErro(error.message);
      throw error;
    }
  };
  
  const rascunhoPronto = Boolean(userId && rascunhoUsuarioId === userId);

  return (
    <AutopublicacaoContext.Provider
      value={{
        carregando,

        dadosLivro: rascunhoPronto ? dadosLivro : ESTADO_INICIAL_LIVRO,

        etapa: rascunhoPronto ? etapa : 1,

        isEdicao: rascunhoPronto && isEdicao,

        estadoAtualLivro: rascunhoPronto ? estadoAtualLivro : null,

        carregarDadosParaEdicao,

        atualizarEtapa,

        irParaProximaEtapa,

        voltarEtapa,

        irParaEtapaEspecifica,

        publicarLivro: publicarLivroNoContexto,

        erro,
      }}
    >
      {children}

      {popup && (
        <Popup
          tipo={popup.tipo}
          mensagem={popup.mensagem}
          fechar={fecharPopup}
        />
      )}
    </AutopublicacaoContext.Provider>
  );
};
