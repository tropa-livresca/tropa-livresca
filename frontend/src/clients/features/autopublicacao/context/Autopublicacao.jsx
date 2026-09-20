import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback, useContext, useEffect } from "react";
import { supabase } from "../../../../common/lib/supabaseClient.js";
import { AutopublicacaoContext } from "./AutopublicacaoContext";
import { AuthContext } from "../../../../common/context/auth/AuthContext";
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
    palavrasChave: [],
  },

  conteudo: {
    manuscrito: null,
    capa: null,
  },

  orcamento: {
    valorLivroFisico: "",
    valorLivroDigital: "",
    numeroPaginas: "",
  },
};

export const AutopublicacaoProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

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

  const [dadosLivro, setDadosLivro] = useState(() => {
    const salvos = localStorage.getItem("rascunhoDadosLivro");

    if (!salvos) {
      return ESTADO_INICIAL_LIVRO;
    }

    try {
      return JSON.parse(salvos);
    } catch {
      localStorage.removeItem("rascunhoDadosLivro");
      return ESTADO_INICIAL_LIVRO;
    }
  });

  const [etapa, setEtapa] = useState(() => {
    const etapaSalva = Number(localStorage.getItem("rascunhoEtapaLivro"));

    return etapaSalva >= 1 && etapaSalva <= 4 ? etapaSalva : 1;
  });

  useEffect(() => {
    if (isEdicao) return;

    localStorage.setItem("rascunhoEtapaLivro", etapa.toString());
    const dadosParaSalvar = {
      ...dadosLivro,
      conteudo: { manuscrito: null, capa: null },
    };
    localStorage.setItem("rascunhoDadosLivro", JSON.stringify(dadosParaSalvar));
  }, [dadosLivro, etapa, isEdicao]);

  const carregarDadosParaEdicao = useCallback(async (dadosBanco) => {
    if (!dadosBanco) return;

    setIsEdicao(true);
    setEstadoAtualLivro(dadosBanco.estado || "rascunho");
    setEtapa(1);

    let palavras = dadosBanco.palavras_chave || [];

    if (typeof palavras === "string") {
      palavras = palavras
        .split(/,|;|\n/)
        .map((palavra) => palavra.trim())
        .filter(Boolean);
    }

    if (!Array.isArray(palavras)) {
      palavras = [];
    }

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
      orelhas: capa?.orelhas || null,
    };

    if (!capa) {
      capa = {
        frente: null,
        verso: null,
        orelhas: null,
      };
    }

    let manuscrito = dadosBanco.manuscrito || null;

    if (manuscrito && !manuscrito.startsWith("http")) {
      const { data, error } = await supabase.storage
        .from("manuscritos-livros")
        .createSignedUrl(manuscrito, 3600);

      if (!error) {
        manuscrito = data.signedUrl;
      } else {
        console.error("Erro ao gerar URL do manuscrito:", error);
      }
    }

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

        publicoPrincipal: dadosBanco.publico_alvo || "",

        categoria: dadosBanco.categoria || "",

        palavrasChave: palavras,
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
    !!conteudo.manuscrito &&
    !!conteudo.capa?.frente &&
    !!conteudo.capa?.verso &&
    !!conteudo.capa?.orelhas;

  const validarOrcamento = () =>
    !!orcamento.numeroPaginas &&
    !!orcamento.valorLivroFisico &&
    !!orcamento.valorLivroDigital;

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
    if (estadoAtualLivro === "publicado" && chave === "detalhes") {
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

    setDadosLivro((atual) => ({ ...atual, [chave]: novosDados }));
  };

  const inserirLivro = useCallback(
    async (dadosDoLivro, estadoDesejado = "rascunho") => {
      if (
        estadoAtualLivro === "em_revisao" ||
        estadoAtualLivro === "publicado"
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

        const uploadArquivo = async (arquivo, tipo) => {
          if (!arquivo) return null;
          if (typeof arquivo === "string") return arquivo;

          const extensao =
            arquivo.name?.split(".").pop() ||
            arquivo.type?.split("/").pop() ||
            "bin";

          const res = await apiFetch(
            "/api/v1/clients/autopublicacao/upload-url",
            {
              method: "POST",
              body: JSON.stringify({ tipo, extensao }),
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

          if (bucket === "capa-livros") {
            const { data } = supabase.storage.from(bucket).getPublicUrl(path);
            return data.publicUrl;
          }
          return path;
        };

        const [capaFrenteUrl, capaVersoUrl, capaOrelhasUrl, manuscritoPath] =
          await Promise.all([
            uploadArquivo(capa?.frente, "capa_frente"),
            uploadArquivo(capa?.verso, "capa_verso"),
            uploadArquivo(capa?.orelhas, "capa_orelhas"),
            uploadArquivo(conteudo?.manuscrito, "manuscrito"),
          ]);

        const payload = {
          dadosLivro: {
            detalhes: dadosDoLivro.detalhes,
            orcamento: dadosDoLivro.orcamento,
          },
          estadoInicial: isEdicao ? estadoAtualLivro : estadoDesejado,
          capa: {
            frente: capaFrenteUrl,
            verso: capaVersoUrl,
            orelhas: capaOrelhasUrl,
          },
          manuscritoPath,
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

  const publicarLivroNoContexto = async (estadoDesejado = "rascunho") => {
    await inserirLivro(dadosLivro, estadoDesejado);

    localStorage.removeItem("rascunhoDadosLivro");
    localStorage.removeItem("rascunhoEtapaLivro");
    setDadosLivro(ESTADO_INICIAL_LIVRO);
    setIsEdicao(false);
    setEstadoAtualLivro(null);
    setEtapa(1);
  };

  return (
    <AutopublicacaoContext.Provider
      value={{
        carregando,
        dadosLivro,
        etapa,
        isEdicao,
        estadoAtualLivro,
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
