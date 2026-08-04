import { apiFetch } from "../../../../common/services/api";
import { useState, useCallback, useContext, useEffect } from "react";
import { supabase } from "../../../../common/lib/supabaseClient.js";
import { AutopublicacaoContext } from "./AutopublicacaoContext";
import { AuthContext } from "../../../../common/context/AuthContext";

const ESTADO_INICIAL_LIVRO = {
  detalhes: {
    idioma: "",
    titulo: "",
    subtitulo: "",
    ISBN: "",
    numeroEdicao: "",
    autor: { nome: "", sobrenome: "" },
    colaboradores: [],
    descricao: "",
    direitoPublicacao: "",
    publicoPrincipal: "",
    categorias: [],
    palavrasChave: [],
  },
  conteudo: { manuscrito: null, capa: null },
  orcamento: { valorLivroFisico: "", valorLivroDigital: "", numeroPaginas: "" },
};

export const AutopublicacaoProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [livro, setLivro] = useState([]);
  const [autor, setAutor] = useState(null);
  const [colaboradores, setColaboradores] = useState(null);
  const [Livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [meta, setMeta] = useState(null);

  const [isEdicao, setIsEdicao] = useState(false);
  const [estadoAtualLivro, setEstadoAtualLivro] = useState(null);

  const [dadosLivro, setDadosLivro] = useState(() => {
    const salvos = localStorage.getItem("rascunhoDadosLivro");
    return salvos ? JSON.parse(salvos) : ESTADO_INICIAL_LIVRO;
  });

  const [etapa, setEtapa] = useState(() => {
    const etapaSalva = localStorage.getItem("rascunhoEtapaLivro");
    return etapaSalva ? Number(etapaSalva) : 1;
  });

  const isBloqueadoParaEdicao =
    estadoAtualLivro === "em_revisao" || estadoAtualLivro === "publicado";

  useEffect(() => {
    if (isEdicao || isBloqueadoParaEdicao) return;

    localStorage.setItem("rascunhoEtapaLivro", etapa.toString());
    const dadosParaSalvar = {
      ...dadosLivro,
      conteudo: { manuscrito: null, capa: null },
    };
    localStorage.setItem("rascunhoDadosLivro", JSON.stringify(dadosParaSalvar));
  }, [dadosLivro, etapa, isEdicao, isBloqueadoParaEdicao]);

  const carregarDadosParaEdicao = useCallback((dadosBanco) => {
    if (!dadosBanco) return;

    console.debug("carregarDadosParaEdicao payload:", dadosBanco);

    setIsEdicao(true);
    setEstadoAtualLivro(
      dadosBanco.estado ||
      dadosBanco.estado_atual ||
      dadosBanco.estadoAtual ||
      "rascunho",
    );
    setEtapa(1);

    const pick = (...keys) => {
      for (const k of keys) {
        if (k in dadosBanco && dadosBanco[k] != null) return dadosBanco[k];
      }
      return undefined;
    };

    const autorNome =
      (dadosBanco.autor &&
        (dadosBanco.autor.nome || dadosBanco.autor.nome === ""
          ? dadosBanco.autor.nome
          : undefined)) ||
      pick("autor_nome", "autorNome", "autorNome") ||
      "";

    const autorSobrenome =
      (dadosBanco.autor &&
        (dadosBanco.autor.sobrenome || dadosBanco.autor.sobrenome === ""
          ? dadosBanco.autor.sobrenome
          : undefined)) ||
      pick("autor_sobrenome", "autorSobrenome") ||
      "";

    let palavras = pick(
      "palavras_chave",
      "palavrasChave",
      "keywords",
      "tags",
      "palavras",
    );
    if (typeof palavras === "string") {
      palavras = palavras
        .split(/,|;|\n/)
        .map((p) => p.trim())
        .filter(Boolean);
    }
    if (!Array.isArray(palavras)) palavras = palavras || [];

    const manuscrito =
      pick(
        "manuscrito",
        "manuscrito_path",
        "manuscritoPath",
        "manuscrito_url",
        "manuscritoUrl",
        "arquivo",
        "file",
      ) || null;

    let capa = pick("capa", "cover", "capa_json");
    if (typeof capa === "string") {
      try {
        capa = JSON.parse(capa);
      } catch (e) {
        capa = null;
      }
    }

    if (!capa) {
      const frente = pick(
        "capa_frente",
        "capaFrente",
        "cover_front",
        "coverFront",
      );
      const verso = pick("capa_verso", "capaVerso", "cover_back", "coverBack");
      const orelhas = pick(
        "capa_orelhas",
        "capaOrelhas",
        "cover_flaps",
        "coverFlaps",
      );
      if (frente || verso || orelhas) {
        capa = {
          frente: frente || null,
          verso: verso || null,
          orelhas: orelhas || null,
        };
      }
    }

    if (!capa) capa = { frente: null, verso: null, orelhas: null };

    const direitoRaw = pick(
      "direitos_de_publicacao",
      "direitoPublicacao",
      "direito_publicacao",
      "direito",
      "has_publication_rights",
    );

    const imagensExplicitasRaw = pick(
      "imagens_explicitas",
      "imagensExplicitas",
      "imagens_explicitas",
      "has_explicit_images",
    );

    const normalizeBool = (v) => {
      if (v === true || v === "true" || v === "sim" || v === "1" || v === 1)
        return true;
      if (
        v === false ||
        v === "false" ||
        v === "nao" ||
        v === "não" ||
        v === "0" ||
        v === 0
      )
        return false;
      return undefined;
    };

    const direitoNorm = (() => {
      if (typeof direitoRaw === "string") {
        const low = direitoRaw.toLowerCase();
        if (low === "sim" || low === "true" || low === "1") return "sim";
        if (low === "nao" || low === "não" || low === "false" || low === "0")
          return "nao";
      }
      if (typeof direitoRaw === "boolean") return direitoRaw ? "sim" : "nao";
      return direitoRaw || "";
    })();

    const imagensExplicitasNorm = (() => {
      const b = normalizeBool(imagensExplicitasRaw);
      if (b === true) return true;
      if (b === false) return false;
      // also accept explicit string values inside detalhes
      if (typeof imagensExplicitasRaw === "string") {
        const low = imagensExplicitasRaw.toLowerCase();
        if (low === "sim" || low === "true") return true;
        if (low === "nao" || low === "não" || low === "false") return false;
      }
      return undefined;
    })();

    setDadosLivro({
      id: dadosBanco.id,
      detalhes: {
        idioma: pick("idioma", "language") || "",
        titulo: pick("titulo", "title") || "",
        subtitulo: pick("subtitulo", "subTitle") || "",
        numeroEdicao: pick("numero_edicao", "numeroEdicao") || "",
        ISBN: pick("ISBN", "isbn") || "",
        autor: {
          nome: autorNome,
          sobrenome: autorSobrenome,
        },
        colaboradores: pick("colaboradores", "contributors") || [],
        descricao: pick("descricao", "description") || "",
        direitoPublicacao: direitoNorm || "",
        imagensExplicitas: imagensExplicitasNorm,
        publicoPrincipal:
          pick("publico_alvo", "publicoPrincipal", "publico") || "",
        categorias: pick("categorias", "categories") || [],
        palavrasChave: palavras,
      },
      conteudo: {
        manuscrito,
        capa,
      },
      orcamento: {
        valorLivroFisico: pick("preco_fisico", "valorLivroFisico") || "",
        valorLivroDigital: pick("preco_digital", "valorLivroDigital") || "",
        numeroPaginas: pick("numero_paginas", "numeroPaginas") || "",
      },
    });
  }, []);

  const d = dadosLivro.detalhes;
  const c = dadosLivro.conteudo;
  const o = dadosLivro.orcamento;

  const validarEtapaAtual = (etapaAtual) => {
    switch (etapaAtual) {
      case 1:
        if (
          !d?.titulo ||
          !d?.idioma ||
          !d?.descricao ||
          !d?.direitoPublicacao ||
          !d?.ISBN
        )
          return false;
        if (!d.autor?.nome || !d.autor?.sobrenome) return false;
        if (d.colaboradores?.length > 0) {
          return d.colaboradores.every(
            (c) => c.funcao && c.nome && c.sobrenome,
          );
        }
        return true;
      case 2:
        return (
          !!c?.manuscrito &&
          !!c?.capa?.frente &&
          !!c?.capa?.verso &&
          !!c?.capa?.orelhas
        );
      case 3:
        return (
          !!o?.numeroPaginas && !!o?.valorLivroFisico && !!o?.valorLivroDigital
        );
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
      alert(
        "Por favor, preencha todos os campos obrigatórios antes de continuar.",
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
        alert(
          "Não é permitido alterar o Título ou o Autor de um livro já publicado.",
        );
        return;
      }
    }

    setDadosLivro((atual) => ({ ...atual, [chave]: novosDados }));
  };

  const InsertLivro = useCallback(
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
            arquivo.name?.split(".").pop() || arquivo.type?.split("/") || "bin";

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
          ? `/api/v1/clients/autopublicacao/updateLivro/${dadosDoLivro.id}`
          : "/api/v1/clients/autopublicacao/insertLivro/";

        const metodo = isEdicao ? "PUT" : "POST";

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
    await InsertLivro(dadosLivro, estadoDesejado);

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
        autor,
        colaboradores,
        meta,
        carregando,
        livro,
        Livros,
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
        publicarLivro: publicarLivroNoContexto,
        setAutor,
        setMeta,
        setLivro,
        setLivros,
        setColaboradores,
        setCarregando,
      }}
    >
      {children}
    </AutopublicacaoContext.Provider>
  );
};
