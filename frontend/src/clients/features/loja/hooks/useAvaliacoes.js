import { apiFetch } from "../../../../common/services/api.js";
import { useState, useCallback } from "react";

const BASE = "/api/v1/clients/avaliacoes";

export const useAvaliacoes = () => {
  const [resumo, setResumo] = useState({ media: 0, total: 0 });
  const [minhaAvaliacao, setMinhaAvaliacao] = useState(null);
  const [podeAvaliar, setPodeAvaliar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  // Média e quantidade de avaliações do livro (não exige login).
  const buscarResumo = useCallback(async (livroId) => {
    if (!livroId) return;
    try {
      const response = await apiFetch(`${BASE}/livro/${livroId}`, {
        skipAuthRedirect: true,
      });
      if (response.ok) setResumo(await response.json());
    } catch (err) {
      console.error("Não foi possível buscar as avaliações do livro.", err);
    }
  }, []);

  // Avaliação do usuário logado e se ele comprou o livro.
  const buscarMinhaAvaliacao = useCallback(async (livroId) => {
    if (!livroId) return;
    try {
      const response = await apiFetch(`${BASE}/${livroId}`, {
        skipAuthRedirect: true,
      });
      if (!response.ok) return;

      const json = await response.json();
      setMinhaAvaliacao(json.avaliacao);
      setPodeAvaliar(json.podeAvaliar);
    } catch (err) {
      console.error("Não foi possível buscar sua avaliação.", err);
    }
  }, []);

  const avaliar = useCallback(async (livroId, qtdEstrelas) => {
    setSalvando(true);
    setErro(null);
    try {
      const response = await apiFetch(`${BASE}/${livroId}`, {
        method: "POST",
        body: JSON.stringify({ qtd_estrelas: qtdEstrelas }),
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json.error || "Não foi possível salvar a avaliação.");
      }

      setMinhaAvaliacao(json.avaliacao);
      return true;
    } catch (err) {
      setErro(err.message);
      return false;
    } finally {
      setSalvando(false);
    }
  }, []);

  return {
    resumo,
    minhaAvaliacao,
    podeAvaliar,
    salvando,
    erro,
    buscarResumo,
    buscarMinhaAvaliacao,
    avaliar,
  };
};
