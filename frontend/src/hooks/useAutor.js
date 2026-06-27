import { apiFetch } from "../services/api";
import { useState } from "react";

export const useAutor = () => {
  const [autor, setAutor] = useState(null);

  const [redes, setRedes] = useState([]);
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [email, setEmail] = useState("");

  const [livros, setLivros] = useState(null);
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [meta, setMeta] = useState(null);

  const buscarAutorById = async (id, page = 1, limit = 12) => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await apiFetch(`/api/autores/${id}`, {
        skipAuthRedirect: true,
        method: "GET",
      });

      const json = await response.json();
      console.log("DADOS DO AUTOR VINDOS DA API:", json);

      if (response.ok) {
        const listaRedes = json.data.usu_redes || [];
        setRedes(listaRedes);

        const insta = listaRedes.find(
          (r) => r.plataforma.toLowerCase() === "instagram",
        );
        const face = listaRedes.find(
          (r) => r.plataforma.toLowerCase() === "facebook",
        );
        const linke = listaRedes.find(
          (r) => r.plataforma.toLowerCase() === "linkedin",
        );
        const mail = listaRedes.find(
          (r) => r.plataforma.toLowerCase() === "email",
        );

        setInstagram(insta ? insta.url : "");
        setFacebook(face ? face.url : "");
        setLinkedin(linke ? linke.url : "");
        setEmail(mail ? mail.url : "");

        setAutor(json.data);
        setLivros(json.data.livros || []);
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
  };

  const buscarAutores = async (page = 1, limit = 12, busca = "") => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await apiFetch(
        `/api/autores/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}`,
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
  };

  return {
    autores,
    carregando,
    erro,
    instagram,
    linkedin,
    facebook,
    email,
    livros,
    redes,
    recarregar: buscarAutores,
    buscarAutores,
    autor,
    meta,
    buscarAutorById,
  };
};
