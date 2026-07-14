import { apiFetch } from "../../../services/api";
import { createContext, useState, useCallback, useContext } from "react";
import { supabase } from "../../../lib/supabaseClient.js";
import { AuthContext } from "../auth/Auth";

export const LivroContext = createContext();

export const LivroProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [livro, setLivro] = useState([]);
  const [autor, setAutor] = useState(null);
  const [colaboradores, setColaboradores] = useState(null);

  const [Livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [meta, setMeta] = useState(null);

  const BuscarLivros = useCallback(async (page = 1, limit = 12, busca = "") => {
    setCarregando(true);
    setMeta(null);

    try {

      const res = await apiFetch(
        `/api/livros/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}`,
        { method: "GET", skipAuthRedirect: true }
      );

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivros([]);
          setMeta(null);
          setCarregando(false);
          return;
        }

        throw new Error(result.error || `Erro ${res.status}`);
      }

      const livrosData = result.data || [];
      setLivros(livrosData);
      setMeta(result.meta);
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      setLivros([]);
      setCarregando(false);
    }
  }, []);

  const BuscarLivrosById = useCallback(async () => {
    setCarregando(true);
    setLivros([]);
    try {
      const res = await apiFetch("/api/meuslivros/", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivros([]);
          setCarregando(false);
          return;
        }
        throw new Error(data.error || `Erro ${res.status}`);
      }

      const livrosData = data.data || data || [];
      setLivros(livrosData);
      setCarregando(false);
    } catch (error) {
      console.error("Erro em GetLivrosById", error);
      setLivros([]);
      setCarregando(false);
    }
  }, []);

  const UpdateStatusAtivo = useCallback(async (id, ativo) => {
    setCarregando(true);
    try {
      const res = await apiFetch("/api/meuslivros/updateA/" + id, { method: "POST" });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }
      setCarregando(false);
    } catch (error) {
      console.error("Erro em UpdateStatusAtivo", error);
      setCarregando(false);
    }
  }, []);

  const BuscarLivroByAutor = useCallback(async (id) => {
    setLivro([]);
    setColaboradores(null);
    setAutor(null);
    setCarregando(true);

    try {

      const res = await apiFetch(`/api/livros/${id}`, { skipAuthRedirect: true });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setLivro([]);
          setAutor(null);
          setColaboradores(null);
          setCarregando(false);
          return;
        }
        throw new Error(json.error || `Erro ${res.status}`);
      }

      const livroData = json.data;
      setLivro(livroData);

      const colaboradoresData = json.data.colaboradores;
      setColaboradores(colaboradoresData);

      const autorData = json.data.users_profile;
      setAutor(autorData);

      setCarregando(false);
    } catch (err) {
      console.error("Erro em BuscarLivroByAutor", err);
      setLivro([]);
      setCarregando(false);
    };
  }, []);

  const InsertLivro = useCallback(async (dadosLivro, publicar = true) => {
    setCarregando(true);

    try {
      const userId = user?.id;

      if (!userId || typeof userId !== "string") {
        console.error("USER RECEBIDO:", user);

        throw new Error("ID do usuário inválido");
      }

      const conteudo = dadosLivro.conteudo;
      const capa = conteudo?.capa;

      const uploadArquivo = async (arquivo, tipo) => {
        if (!arquivo) {
          return null;
        }

        const extensao =
          arquivo.name?.split(".").pop() ||
          arquivo.type?.split("/")[1] ||
          "bin";

        const res = await apiFetch(
          "/api/livros/upload-url",
          {
            method: "POST",
            body: JSON.stringify({
              tipo,
              extensao,
            }),
          },
        );

        const uploadData = await res.json();

        if (!res.ok) {
          throw new Error(
            uploadData.error ||
            "Erro ao autorizar upload",
          );
        }

        const { bucket, path, token } = uploadData;

        const { error } = await supabase.storage
          .from(bucket)
          .uploadToSignedUrl(
            path,
            token,
            arquivo,
            {
              contentType: arquivo.type,
            },
          );

        if (error) {
          throw new Error(
            `Erro ao enviar ${tipo}: ${error.message}`,
          );
        }

        if (bucket === "capa-livros") {
          const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

          return data.publicUrl;
        }

        return path;
      };
      console.time("Tempo dos uploads");

      const [
        capaFrenteUrl,
        capaVersoUrl,
        capaOrelhasUrl,
        manuscritoPath,
      ] = await Promise.all([
        uploadArquivo(
          capa?.frente,
          "capa_frente",
        ),

        uploadArquivo(
          capa?.verso,
          "capa_verso",
        ),

        uploadArquivo(
          capa?.orelhas,
          "capa_orelhas",
        ),

        uploadArquivo(
          conteudo?.manuscrito,
          "manuscrito",
        ),
      ]);
      
      console.timeEnd("Tempo dos uploads");

      const payload = {
        dadosLivro: {
          detalhes: dadosLivro.detalhes,
          orcamento: dadosLivro.orcamento,
        },

        publicar,

        capa: {
          frente: capaFrenteUrl,
          verso: capaVersoUrl,
          orelhas: capaOrelhasUrl,
        },

        manuscritoPath,
      };

      console.time("Tempo do backend");

      const res = await apiFetch("/api/livros/insertLivro/", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      console.timeEnd("Tempo do backend");

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.error || `Erro ${res.status}`,
        );
      }

      console.log(
        "Livro inserido com sucesso:",
        json,
      );

      return json;
    } catch (error) {
      console.error(
        "Erro em InsertLivro:",
        error,
      );

      throw error;
    } finally {
      setCarregando(false);
    }
  }, [user]);

  return (
    <LivroContext.Provider
      value={{
        autor,
        colaboradores,
        meta,
        carregando,
        livro,
        Livros,
        setAutor,
        setMeta,
        setLivro,
        setLivros,
        setColaboradores,
        setCarregando,
        BuscarLivros,
        BuscarLivrosById,
        UpdateStatusAtivo,
        BuscarLivroByAutor,
        InsertLivro,
      }}
    >
      {children}
    </LivroContext.Provider>
  );
};
