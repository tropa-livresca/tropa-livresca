import { useCallback, useState } from "react";
import { apiFetch } from "../../common/services/api.js";

export const useRevisao = () => {
  const [revisoes, setRevisoes] = useState([]);
  const [livrosRevisados, setLivrosRevisados] = useState([]);
  const [livroRevisado, setLivroRevisado] = useState(null);
  const [count, setCount] = useState(0);
  const [revisaoAtual, setRevisaoAtual] = useState(null);
  const [nome, setNome] = useState("");
  const [manuscrito, setManuscrito] = useState(null);
  const [apontamento, setApontamento] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState(null);

  const ValidarCamposTexto = useCallback(() => {
    if (!nome || nome.trim().length === 0) return false;
    if (!apontamento || apontamento.trim().length === 0) return false;
    return true;
  }, [nome, apontamento]);

  const LimparCampos = useCallback(() => {
    setNome("");
    setApontamento("");
    setManuscrito(null);
  }, []);

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

      const result = await response.json();

      console.log(result);

      const data = result.data;
      setRevisoes(data || []);
      setLivrosRevisados(data.livros || []);
      setCount(data.count || 0);
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

      const result = await response.json();

      console.log(result);

      setRevisaoAtual(result.data);
      setLivrosRevisados(result.livro);
      setNome(result.data.nome || "");
      setApontamento(result.data?.apontamento || "");
      setManuscrito(result.data?.arquivo || null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const BuscarRevisaoByUserId = useCallback(async (id) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/revisao/user/${id}`);

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao buscar revisão por ID: ${response.status}`,
        );
      }

      const result = await response.json();

      console.log(result);

      const data = result.data;
      setRevisoes(data || []);
      setCount(data.count || 0);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const CriarRevisao = useCallback(
    async (idLivro, novoEstado) => {
      if (!ValidarCamposTexto() || !manuscrito) {
        throw new Error("Preencha todos os campos e anexe o manuscrito.");
      }

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
          isFormData: true,
        });

        if (!response.ok) {
          throw new Error(
            `Erro encontrado ao criar revisão: ${response.status}`,
          );
        }

        if (novoEstado) {
          const responseEstado = await apiFetch(
            `/api/v1/admin/revisao/novoEstado`,
            {
              method: "PATCH",
              body: JSON.stringify({ idLivro, novoEstado }),
            },
          );

          if (!responseEstado.ok) {
            throw new Error(`Erro encontrado ao atualizar o estado do livro`);
          }
        }

        return response.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [nome, apontamento, manuscrito, ValidarCamposTexto],
  );

  const AtualizarRevisao = useCallback(
    async (id, e, idLivro) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();

      if (!id) return;
      if (!ValidarCamposTexto()) {
        alert("Preencha todos os campos obrigatórios (Nome e Apontamento).");
        return;
      }

      setCarregando(true);
      setError(null);
      try {
        const corpo = {};
        if (nome) corpo.nome = nome;
        if (apontamento) corpo.apontamento = apontamento;

        const libroIdAtual = idLivro || livroRevisado?.id;
        if (libroIdAtual) corpo.idLivro = libroIdAtual;

        const response = await apiFetch(`/api/v1/admin/revisao/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(corpo),
        });

        if (!response.ok) {
          throw new Error(`Erro retornado do servidor: ${response.status}`);
        }

        const json = response.data || response;
        setRevisaoAtual(json.data || json);

        alert("Informações atualizadas com sucesso!");
      } catch (err) {
        console.error("Erro ao atualizar revisão: ", err);
        setError(err.message);
        alert("Ocorreu um erro ao atualizar a revisão.");
      } finally {
        setCarregando(false);
      }
    },
    [nome, apontamento, livroRevisado, ValidarCamposTexto],
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

      return response.data;
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

      return response.data;
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
    livroRevisado,
    setLivroRevisado,
    livrosRevisados,
    setLivrosRevisados,
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
    BuscarRevisaoByUserId,
    CriarRevisao,
    AtualizarRevisao,
    InativarRevisao,
    AlterarEstadoLivro,
    LimparCampos,
  };
};
