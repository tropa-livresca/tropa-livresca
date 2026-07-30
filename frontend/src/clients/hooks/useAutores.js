import { apiFetch } from "../../common/services/api";
import { useState, useCallback } from "react";

export const useAutores = () => {
  const [autor, setAutor] = useState(null);
  const [redesSociais, setRedesSociais] = useState({
    instagram: "",
    facebook: "",
    linkedin: "",
    email: "",
  });
  const [livros, setLivros] = useState(null);
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [meta, setMeta] = useState(null);

  const buscarAutorById = useCallback(async (id) => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await apiFetch(`/api/v1/clients/autores/${id}`, {
        skipAuthRedirect: true,
        method: "GET",
      });

      const json = await response.json();

      if (response.ok) {
        const dadosAutor = json.data;
        setAutor(dadosAutor);

        setRedesSociais({
          instagram: dadosAutor.redes_sociais?.instagram || "",
          facebook: dadosAutor.redes_sociais?.facebook || "",
          linkedin: dadosAutor.redes_sociais?.linkedin || "",
          email: dadosAutor.redes_sociais?.email || "",
        });

        const livrosTratados = (dadosAutor.livros || []).map((livro) => {
          let capaTratada = livro.capa;
          
          if (typeof livro.capa === "string") {
            try {
              capaTratada = JSON.parse(livro.capa);
            } catch (e) {
              console.error("Erro ao converter JSON da capa:", e);
              capaTratada = null;
            }
          }
          
          return {
            ...livro,
            capa: capaTratada
          };
        });

        setLivros(livrosTratados);
        setMeta(json.meta);
      } else {
        throw new Error(json.error || "Erro ao carregar autor");
      }
    } catch (error) {
      console.error("Erro ao buscar autor por id", error);
      setErro("Erro ao buscar autor");
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarAutores = useCallback(async (page = 1, limit = 12, busca = "") => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await apiFetch(
        `/api/v1/clients/autores/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}`,
        {
          skipAuthRedirect: true,
          method: "GET",
        },
      );

      const result = await response.json();

      if (response.ok) {
        setAutores(result.data);
        setMeta(result.meta);
      } else {
        throw new Error(result.error || "Erro ao carregar lista");
      }
    } catch (error) {
      console.error("Erro ao buscar autores", error);
      setErro("Erro ao buscar autores");
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    autores,
    carregando,
    erro,
    redesSociais,
    livros,
    recarregar: buscarAutores,
    buscarAutores,
    autor,
    meta,
    buscarAutorById,
  };
};
