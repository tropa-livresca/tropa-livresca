
import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback, useContext, useEffect } from "react";
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
    colaboradores: [],
    descricao: "",
    direitoPublicacao: "",
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

    const dadosSalvos = localStorage.getItem(chaveRascunho("dados"));

    const etapaSalva = Number(localStorage.getItem(chaveRascunho("etapa")));

    if (dadosSalvos) {
      try {
        const dadosRecuperados = JSON.parse(dadosSalvos);

        if (dadosRecuperados?.conteudo) {
          const conteudoRecuperado = dadosRecuperados.conteudo;

          dadosRecuperados.conteudo = {
            ...conteudoRecuperado,
            manuscrito:
              typeof conteudoRecuperado.manuscrito === "string"
                ? conteudoRecuperado.manuscrito
                : null,
            capa: {
              frente:
                typeof conteudoRecuperado.capa?.frente === "string"
                  ? conteudoRecuperado.capa.frente
                  : null,
              verso:
                typeof conteudoRecuperado.capa?.verso === "string"
                  ? conteudoRecuperado.capa.verso
                  : null,
            },
            capaPaths: {
              frente: conteudoRecuperado.capaPaths?.frente || null,
              verso: conteudoRecuperado.capaPaths?.verso || null,
            },
            manuscritoPath: conteudoRecuperado.manuscritoPath || null,
          };
        }

        setDadosLivro({
          ...ESTADO_INICIAL_LIVRO,
          ...dadosRecuperados,
          detalhes: {
            ...ESTADO_INICIAL_LIVRO.detalhes,
            ...(dadosRecuperados?.detalhes || {}),
          },
          conteudo: {
            ...ESTADO_INICIAL_LIVRO.conteudo,
            ...(dadosRecuperados?.conteudo || {}),
          },
          orcamento: {
            ...ESTADO_INICIAL_LIVRO.orcamento,
            ...(dadosRecuperados?.orcamento || {}),
          },
        });
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

    const conteudoAtual = dadosLivro.conteudo || {};

    const dadosParaSalvar = {
      ...dadosLivro,
      conteudo: {
        ...conteudoAtual,
        manuscrito:
          typeof conteudoAtual.manuscrito === "string"
            ? conteudoAtual.manuscrito
            : null,
        capa: {
          frente:
            typeof conteudoAtual.capa?.frente === "string"
              ? conteudoAtual.capa.frente
              : null,
          verso:
            typeof conteudoAtual.capa?.verso === "string"
              ? conteudoAtual.capa.verso
              : null,
        },
        capaPaths: {
          frente: conteudoAtual.capaPaths?.frente || null,
          verso: conteudoAtual.capaPaths?.verso || null,
        },
        manuscritoPath: conteudoAtual.manuscritoPath || null,
      },
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
  

  const dataURItoBlob = useCallback((dataURI) => {
    const [metadata, encoded] = dataURI.split(",");
    const mimeType = metadata.match(/data:(.*?);base64/)?.[1];
    if (!encoded || !mimeType) {
      throw new Error("Arquivo inválido.");
    }

    const byteString = atob(encoded);
    const bytes = new Uint8Array(byteString.length);
    for (let index = 0; index < byteString.length; index++) {
      bytes[index] = byteString.charCodeAt(index);
    }
    return new Blob([bytes], { type: mimeType });
  }, []);

  const uploadArquivo = useCallback(
    async (arquivo, tipo, tipoDeArquivo) => {
      if (!arquivo) return null;

      const blob = dataURItoBlob(arquivo);
      const mimeType = blob.type || tipoDeArquivo;
      const extensao = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/").pop();
      const formData = new FormData();
      formData.append("tipo", tipo);
      formData.append(
        "arquivo",
        new File([blob], `arquivo.${extensao}`, { type: mimeType }),
      );

      const response = await apiFetch(
        "/api/v1/clients/autopublicacao/upload-url",
        { method: "POST", body: formData },
      );
      const uploadData = await response.json();
      if (!response.ok) {
        throw new Error(uploadData.error || `Erro ao enviar ${tipo}.`);
      }
      if (!uploadData.path || !uploadData.url) {
        throw new Error(`O upload de ${tipo} não retornou caminho e URL.`);
      }
      return uploadData;
    },
    [dataURItoBlob],
  );

  const uploadManuscrito = useCallback(
    (arquivo) => uploadArquivo(arquivo, "manuscrito", "application/pdf"),
    [uploadArquivo],
  );

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
        const capa = conteudo.capa;

        const arquivosEnviados = [];

        let caminhosArquivos;

        try {
          const uploadCapaSeNova = async (parte, tipo) => {
            if (!capa?.[parte]?.startsWith("data:")) {
              return conteudo.capaPaths?.[parte] || null;
            }
            const resultado = await uploadArquivo(
              capa[parte],
              tipo,
              "image/png",
            );
            arquivosEnviados.push({ tipo, path: resultado.path });
            return resultado.path;
          };

          const capaFrentePath = await uploadCapaSeNova(
            "frente",
            "capa_frente",
          );
          const capaVersoPath = await uploadCapaSeNova("verso", "capa_verso");

          caminhosArquivos = {
            capa: {
              frente: capaFrentePath,

              verso: capaVersoPath,
            },
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

          manuscritoPath: conteudo.manuscritoPath || conteudo.manuscrito,
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

        setErro(null);
        return
      } catch (error) {
        console.error("Erro em salvar livro:", error);

        throw error;
      } finally {
        setCarregando(false);
      }
      
    },

    [user, isEdicao, estadoAtualLivro, uploadArquivo],
  );

  const publicarLivroNoContexto = async (
    estadoDesejado = LIVRO_ESTADO.RASCUNHO,
    arquivo,
  ) => {

    const error = await inserirLivro(dadosLivro, estadoDesejado, arquivo);

    if(error != null){
      setErro(error)
      setDadosLivro({...dadosLivro, conteudo: {...dadosLivro.conteudo , manuscrito: null}})
    }

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

        uploadManuscrito,

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




















