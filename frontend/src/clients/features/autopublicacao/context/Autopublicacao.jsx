import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback, useContext, useEffect } from "react";
import { supabase } from "../../../../common/lib/supabaseClient.js";
import { AutopublicacaoContext } from "./AutopublicacaoContext";
import { AuthContext } from "../../../../common/context/auth/AuthContext";
import { LIVRO_ESTADO } from "../../../../common/config/livroEstados";
import Popup from "../../../components/PopUp/Popup";

const ESTADO_INICIAL_LIVRO = {
  detalhes: {
    idioma: "",
    titulo: "",
    subtitulo: "",
    ISBN: "",
    numeroEdicao: "",
    autor: {
      nome: "",
      sobrenome: "",
    },
    colaboradores: [],
    descricao: "",
    direitoPublicacao: "",
    imagensExplicitas: "",
    categoria: "",
  },

  conteudo: {
    manuscrito: null,
    manuscritoPath: null,
    capa: {
      frente: null,
      verso: null,
    },
    capaPaths: {
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

    const dadosSalvos = localStorage.getItem(chaveRascunho("dados"));
    const etapaSalva = Number(localStorage.getItem(chaveRascunho("etapa")));

    if (dadosSalvos) {
      try {
        setDadosLivro(JSON.parse(dadosSalvos));
      } catch {
        localStorage.removeItem(chaveRascunho("dados"));
      }
    }

    if (etapaSalva >= 1 && etapaSalva <= 4) setEtapa(etapaSalva);
    setRascunhoUsuarioId(userId);
  }, [chaveRascunho, userId]);

  useEffect(() => {
    if (isEdicao || !userId || rascunhoUsuarioId !== userId) return;

    localStorage.setItem(chaveRascunho("etapa"), etapa.toString());
    const dadosParaSalvar = {
      ...dadosLivro,
    };
    localStorage.setItem(
      chaveRascunho("dados"),
      JSON.stringify(dadosParaSalvar),
    );
  }, [chaveRascunho, dadosLivro, etapa, isEdicao, rascunhoUsuarioId, userId]);

  const carregarDadosParaEdicao = useCallback(async (dadosBanco) => {
    if (!dadosBanco) return;

    setIsEdicao(true);
    setEstadoAtualLivro(dadosBanco.estado || LIVRO_ESTADO.RASCUNHO);
    setEtapa(1);

    let capa = dadosBanco.capa;

    if (typeof capa === "string") {
      try {
        capa = JSON.parse(capa);
      } catch {
        capa = null;
      }
    }

    capa = {
      frente: capa?.frente || null,
      verso: capa?.verso || null,
    };

    if (!capa) {
      capa = {
        frente: null,
        verso: null,
      };
    }

    const manuscrito = dadosBanco.manuscrito || null;

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

    const imagensExplicitasNorm = normalizeBool(dadosBanco.imagens_explicitas);

    setDadosLivro({
      id: dadosBanco.id,

      detalhes: {
        idioma: dadosBanco.idioma || "",
        titulo: dadosBanco.titulo || "",
        subtitulo: dadosBanco.subtitulo || "",
        numeroEdicao: dadosBanco.numero_edicao || "",
        ISBN: dadosBanco.ISBN || "",

        autor: {
          nome: dadosBanco.autor_nome || "",
          sobrenome: dadosBanco.autor_sobrenome || "",
        },

        colaboradores: dadosBanco.colaboradores || [],
        descricao: dadosBanco.descricao || "",

        direitoPublicacao,
        imagensExplicitas: imagensExplicitasNorm ?? "",

        categoria: dadosBanco.categoria || "",
      },

      conteudo: {
        manuscrito,
        capa,
        manuscritoPath: dadosBanco.manuscritoPath || null,
        capaPaths: dadosBanco.capaPaths || {
          frente: null,
          verso: null,
        },
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
    const imagemExplicitaNaoInformada =
      detalhes.imagensExplicitas === undefined ||
      detalhes.imagensExplicitas === "";

    if (
      !detalhes.titulo ||
      !detalhes.idioma ||
      !detalhes.descricao ||
      !detalhes.direitoPublicacao ||
      !detalhes.categoria ||
      !detalhes.subtitulo ||
      !detalhes.numeroEdicao ||
      imagemExplicitaNaoInformada
    ) {
      return false;
    }

    if (!detalhes.autor?.nome || !detalhes.autor?.sobrenome) {
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
    !!conteudo.manuscrito && !!conteudo.capa?.frente && !!conteudo.capa?.verso;

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

      if (
        novosDados.titulo !== dadosAntigos.titulo ||
        novosDados.autor?.nome !== dadosAntigos.autor?.nome ||
        novosDados.autor?.sobrenome !== dadosAntigos.autor?.sobrenome
      ) {
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
        const userId = user?.id;
        if (!userId || typeof userId !== "string")
          throw new Error("ID do usuário inválido");

        const conteudo = dadosDoLivro.conteudo;
        const capa = conteudo?.capa;

        const arquivosEnviados = [];

        const uploadArquivo = async (arquivo, tipo, pathExistente) => {
          if (!arquivo) return null;
          if (typeof arquivo === "string") return pathExistente || arquivo;

          const extensao =
            arquivo.name?.split(".").pop() ||
            arquivo.type?.split("/").pop() ||
            "bin";

          const res = await apiFetch(
            "/api/v1/clients/autopublicacao/upload-url",
            {
              method: "POST",
              body: JSON.stringify({
                tipo,
                extensao,
                mimeType: arquivo.type,
                tamanho: arquivo.size,
              }),
            },
          );
          const uploadData = await res.json();

          if (!res.ok)
            throw new Error(uploadData.error || "Erro ao autorizar upload");

          const { bucket, path, token } = uploadData;
          const { error } = await supabase.storage
            .from(bucket)
            .uploadToSignedUrl(path, token, arquivo, {
              contentType: arquivo.type,
            });
          if (error)
            throw new Error(`Erro ao enviar ${tipo}: ${error.message}`);

          arquivosEnviados.push({ tipo, path });
          return false;
        };

        let caminhosArquivos;
        try {
          const [capaFrentePath, capaVersoPath, manuscritoPath] =
            await Promise.all([
              uploadArquivo(
                capa?.frente,
                "capa_frente",
                conteudo?.capaPaths?.frente,
              ),
              uploadArquivo(
                capa?.verso,
                "capa_verso",
                conteudo?.capaPaths?.verso,
              ),
              uploadArquivo(
                conteudo?.manuscrito,
                "manuscrito",
                conteudo?.manuscritoPath,
              ),
            ]);

          caminhosArquivos = {
            capa: {
              frente: capaFrentePath,
              verso: capaVersoPath,
            },
            manuscritoPath,
          };
        } catch (uploadError) {
          if (arquivosEnviados.length) {
            await apiFetch("/api/v1/clients/autopublicacao/upload-url", {
              method: "DELETE",
              body: JSON.stringify({ arquivos: arquivosEnviados }),
            }).catch((cleanupError) => {
              console.error(
                "Erro ao limpar uploads incompletos:",
                cleanupError,
              );
            });
          }
          throw uploadError;
        }

        const payload = {
          dadosLivro: {
            detalhes: dadosDoLivro.detalhes,
            orcamento: dadosDoLivro.orcamento,
          },
          ...(isEdicao ? {} : { estadoInicial: estadoDesejado }),
          capa: caminhosArquivos.capa,
          capaPaths: caminhosArquivos.capa,
          manuscritoPath: caminhosArquivos.manuscritoPath,
        };

        const rota = isEdicao
          ? `/api/v1/clients/autopublicacao/${dadosDoLivro.id}`
          : "/api/v1/clients/autopublicacao/";

        const metodo = isEdicao ? "PATCH" : "POST";

        const res = await apiFetch(rota, {
          method: metodo,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `Erro ${res.status}`);
        return json;
      } catch (error) {
        console.error("Erro em salvar livro:", error);
        throw error;
      } finally {
        setCarregando(false);
      }
    },
    [user, isEdicao, estadoAtualLivro],
  );

  const publicarLivroNoContexto = async (
    estadoDesejado = LIVRO_ESTADO.RASCUNHO,
  ) => {
    await inserirLivro(dadosLivro, estadoDesejado);

    localStorage.removeItem(chaveRascunho("dados"));
    localStorage.removeItem(chaveRascunho("etapa"));
    setDadosLivro(ESTADO_INICIAL_LIVRO);
    setIsEdicao(false);
    setEstadoAtualLivro(null);
    setEtapa(1);
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
