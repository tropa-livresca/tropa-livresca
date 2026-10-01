import { apiFetch } from "../../../../common/services/api.js";
import { useState, useCallback } from "react";

export const useAvaliacoes = () => {
  const [qtdEstrelas, setQtdEstrelas] = useState(0);
  const [media, setMedia] = useState(0);
  const [avaliacao, setAvaliacao] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarAvaliacao = useCallback(async (livroid) => {
    if (!livroid) return;

    setCarregando(true);

    try {
      const response = await apiFetch(`/api/v1/clients/avaliacao/${livroid}`);

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao buscar avaliação:", data.error);
        return;
      }

      setAvaliacao(data || 0);
    } catch (err) {
      console.error("Erro ao buscar a avaliação do autor.", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarAvaliacoes = useCallback(async () => {
    setCarregando(true);

    try {
      const response = await apiFetch(`/api/v1/clients/avaliacao/`);

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao buscar avaliações:", data.error);
        return;
      }

      setMedia(data);
    } catch (err) {
      console.error("Não foi possível buscar as avaliações do livro.", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const realizarAvaliacao = useCallback(async (livroid, e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!informouEstrelas) return;

    setCarregando(true);

    try {
      const response = await apiFetch(`/api/v1/clients/avaliacao/${livroid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qtdEstrelas }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao realizar avaliação:", data.error);
        return;
      }
      setAvaliacao(data);
    } catch (err) {
      console.error("Não foi possível realizar a avaliação", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const informouEstrelas = useCallback(() => {
    if (!qtdEstrelas || qtdEstrelas.trim() === "") return false;
  });

  const alterarAvaliacao = useCallback(async (avaliacaoId, e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!avaliacaoId) return;
    if (!informouEstrelas) return;

    setCarregando(true);

    try {
      const response = await apiFetch(
        `/api/v1/clients/avaliacao/${avaliacaoId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qtdEstrelas }),
        },
      );

      if (!response.ok) {
        console.error("Erro ao alterar avaliação:", data.error);
        return;
      }

      const data = response.json();

      setAvaliacao(data);
    } catch (err) {
      console.error(
        "Não foi possível alterar a avaliação feita para o livro.",
        err,
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    media,
    qtdEstrelas,
    avaliacao,
    carregando,
    setQtdEstrelas,
    buscarAvaliacao,
    buscarAvaliacoes,
    realizarAvaliacao,
    alterarAvaliacao,
  };
};
