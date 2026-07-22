import { apiFetch } from "../../../../common/services/api";
import { createContext, useState, useCallback, useContext, useEffect } from "react";
import { supabase } from "../../../../common/lib/supabaseClient.js";
import { AuthContext } from "../../../../common/context/Auth";

export const AutopublicacaoContext = createContext();

const ESTADO_INICIAL_LIVRO = {
  detalhes: {
    idioma: "", titulo: "", subtitulo: "", numeroEdicao: "",
    autor: { nome: "", sobrenome: "" },
    colaboradores: [], descricao: "", direitoPublicacao: "",
    publicoPrincipal: "", categorias: [], palavrasChave: [],
  },
  conteudo: { manuscrito: null, capa: null },
  orcamento: { valorLivroFisico: "", valorLivroDigital: "" },
};

export const AutopublicacaoProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [livro, setLivro] = useState([]);
  const [autor, setAutor] = useState(null);
  const [colaboradores, setColaboradores] = useState(null);
  const [Livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [meta, setMeta] = useState(null);

  const [dadosLivro, setDadosLivro] = useState(() => {
    const salvos = localStorage.getItem("rascunhoDadosLivro");
    return salvos ? JSON.parse(salvos) : ESTADO_INICIAL_LIVRO;
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
    };
    localStorage.setItem("rascunhoDadosLivro", JSON.stringify(dadosParaSalvar));
  }, [dadosLivro, etapa]);

  const validarEtapaAtual = (etapaAtual) => {
    switch (etapaAtual) {
      case 1:
        const d = dadosLivro.detalhes;
        if (!d?.titulo || !d?.idioma || !d?.descricao || !d?.direitoPublicacao) return false;
        if (!d.autor?.nome || !d.autor?.sobrenome) return false;
        if (d.colaboradores?.length > 0) {
          return d.colaboradores.every(c => c.funcao && c.nome && c.sobrenome);
        }
        return true;
      case 2:
        const c = dadosLivro.conteudo;
        return !!c?.manuscrito && !!c?.capa?.frente && !!c?.capa?.verso && !!c?.capa?.orelhas;
      case 3:
        const o = dadosLivro.orcamento;
        return !!o?.numeroPaginas && !!o?.valorLivroFisico && !!o?.valorLivroDigital;
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
      alert("Por favor, preencha todos os campos obrigatÃ³rios antes de continuar.");
    }
  };

  const atualizarEtapa = (chave) => (novosDados) => {
    setDadosLivro((atual) => ({ ...atual, [chave]: novosDados }));
  };

  const InsertLivro = useCallback(async (dadosDoLivro, publicar = true) => {
    setCarregando(true);
    try {
      const userId = user?.id;
      if (!userId || typeof userId !== "string") throw new Error("ID do usuÃ¡rio invÃ¡lido");

      const conteudo = dadosDoLivro.conteudo;
      const capa = conteudo?.capa;

      const uploadArquivo = async (arquivo, tipo) => {
        if (!arquivo) return null;
        const extensao = arquivo.name?.split(".").pop() || arquivo.type?.split("/") || "bin";

        const res = await apiFetch("/api/v1/clients/autopublicacao/upload-url", {
          method: "POST",
          body: JSON.stringify({ tipo, extensao }),
        });
        const uploadData = await res.json();
        if (!res.ok) throw new Error(uploadData.error || "Erro ao autorizar upload");

        const { bucket, path, token } = uploadData;
        const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, arquivo, {
          contentType: arquivo.type,
        });
        if (error) throw new Error(`Erro ao enviar ${tipo}: ${error.message}`);

        if (bucket === "capa-livros") {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          return data.publicUrl;
        }
        return path;
      };

      const [capaFrenteUrl, capaVersoUrl, capaOrelhasUrl, manuscritoPath] = await Promise.all([
        uploadArquivo(capa?.frente, "capa_frente"),
        uploadArquivo(capa?.verso, "capa_verso"),
        uploadArquivo(capa?.orelhas, "capa_orelhas"),
        uploadArquivo(conteudo?.manuscrito, "manuscrito"),
      ]);

      const payload = {
        dadosLivro: { detalhes: dadosDoLivro.detalhes, orcamento: dadosDoLivro.orcamento },
        publicar,
        capa: { frente: capaFrenteUrl, verso: capaVersoUrl, orelhas: capaOrelhasUrl },
        manuscritoPath,
      };

      const res = await apiFetch("/api/v1/clients/autopublicacao/insertLivro/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erro ${res.status}`);
      return json;
    } catch (error) {
      console.error("Erro em InsertLivro:", error);
      throw error;
    } finally {
      setCarregando(false);
    }
  }, [user]);

  const publicarLivroNoContexto = async (publicar = true) => {
    await InsertLivro(dadosLivro, publicar);
    localStorage.removeItem("rascunhoDadosLivro");
    localStorage.removeItem("rascunhoEtapaLivro");
    setDadosLivro(ESTADO_INICIAL_LIVRO);
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




