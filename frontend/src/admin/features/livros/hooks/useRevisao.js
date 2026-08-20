import { useCallback, useState } from "react";
import { apiFetch } from "../../../../common/services/api.js";

export const useRevisao = () => {
  const [revisoes, setRevisoes] = useState([]);
  const [count, setCount] = useState(0);
  const [revisaoAtual, setRevisaoAtual] = useState(null);
  const [nome, setNome] = useState("");
  const [manuscrito, setManuscrito] = useState(null);
  const [apontamento, setApontamento] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState(null);

  const BuscarRevisoes = useCallback(async (filtros = {}) => {
    setCarregando(true);
    setError(null);
    try {
      const params = new URLSearchParams(filtros).toString();
      const response = await apiFetch(`/api/v1/admin/revisao?${params}`);

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao Buscar Revisões: ${response.status}`,
        );
      }

      const data = response.data;
      setRevisoes(data.data || []);
      setCount(data.count || 0);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const BuscarRevisaoById = useCallback(async (id) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/revisao/${id}`);

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao buscar revisão por ID: ${response.status}`,
        );
      }

      const data = response.data;
      setRevisaoAtual(data);
      setNome(data.nome || "");
      setApontamento(data.apontamento || "");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const CriarRevisao = useCallback(
    async (idLivro) => {
      setCarregando(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("apontamento", apontamento);
        formData.append("idLivro", idLivro);
        if (manuscrito) {
          formData.append("manuscritoRevisto", manuscrito);
        }

        const response = await apiFetch(`/api/v1/admin/revisao`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(
            `Erro encontrado ao criar revisão: ${response.status}`,
          );
        }

        const data = response.data;
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [nome, apontamento, manuscrito],
  );

  const AtualizarRevisao = useCallback(
    async (id, idLivro) => {
      setCarregando(true);
      setError(null);
      try {
        const corpo = {};
        if (nome) corpo.nome = nome;
        if (apontamento) corpo.apontamento = apontamento;
        if (idLivro) corpo.idLivro = idLivro;

        const response = await apiFetch(`/api/v1/admin/revisao/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(corpo),
        });

        if (!response.ok) {
          throw new Error(
            `Erro encontrado ao atualizar revisão: ${response.status}`,
          );
        }

        const data = response.data;
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [nome, apontamento],
  );

  const InativarRevisao = useCallback(async (id) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/revisao/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao inativar revisão: ${response.status}`,
        );
      }

      const data = response.data;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const AlterarEstadoLivro = useCallback(async (idLivro, novoEstado) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/revisao/alterar-estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idLivro, novoEstado }),
      });

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao alterar estado do livro: ${response.status}`,
        );
      }

      const data = response.data;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    revisoes,
    setRevisoes,
    count,
    revisaoAtual,
    setRevisaoAtual,
    nome,
    setNome,
    manuscrito,
    setManuscrito,
    apontamento,
    setApontamento,
    carregando,
    error,
    BuscarRevisoes,
    BuscarRevisaoById,
    CriarRevisao,
    AtualizarRevisao,
    InativarRevisao,
    AlterarEstadoLivro,
  };
};
