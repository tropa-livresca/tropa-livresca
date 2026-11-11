import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api";

export const useBibliotecaPessoal = () => {
  const [livros, setLivros] = useState([]);
  const [meta, setMeta] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarMeusLivros = useCallback(
    async (
      page = 1,
      limit = 12,
      busca = "",
      filtro = "",
      ordem = "",
      categoria = "",
      idioma = "",
      livroId = "",
    ) => {
      setCarregando(true);
      setErro(null);

      try {
        const parametros = {
          page: String(page),
          limit: String(limit),
          busca,
          filtro,
          ordem,
          categoria,
          idioma,
        };
        if (livroId) parametros.livroId = String(livroId);
        const params = new URLSearchParams(parametros);
        const response = await apiFetch(
          `/api/v1/clients/loja/bibliotecapessoal?${params.toString()}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Não foi possível carregar sua biblioteca.",
          );
        }

        setLivros(data.livros || []);
        setMeta(data.meta || null);
        return data.livros || [];
      } catch (error) {
        setErro(error.message);
        setLivros([]);
        setMeta(null);
        return null;
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  return { livros, meta, buscarMeusLivros, carregando, erro };
};
