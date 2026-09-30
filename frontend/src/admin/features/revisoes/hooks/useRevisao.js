import { useCallback, useState } from "react";
import { apiFetch } from "../../../../common/services/api.js";
import { LIVRO_ESTADO } from "../../../../common/config/livroEstados.js";

export const useRevisao = () => {
  const [revisoes, setRevisoes] = useState([]);
  const [livrosRevisados, setLivrosRevisados] = useState([]);
  const [livroRevisado, setLivroRevisado] = useState(null);
  const [meta, setMeta] = useState(null);
  const [revisaoAtual, setRevisaoAtual] = useState(null);
  const [revisor, setRevisor] = useState(false);
  const [nome, setNome] = useState("");
  const [manuscrito, setManuscrito] = useState(null);
  const [apontamento, setApontamento] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState(null);

  const validarCamposTexto = useCallback(() => {
    if (!nome || nome.trim().length === 0) return false;
    if (!apontamento || apontamento.trim().length === 0) return false;
    return true;
  }, [nome, apontamento]);

  const limparCampos = useCallback(() => {
    setNome("");
    setApontamento("");
    setManuscrito(null);
  }, []);

  const buscarLivroRevisao = useCallback(async (id) => {
    setCarregando(true);

    try {
      const busca = id ? `?busca=${encodeURIComponent(id)}` : "";
      const response = await apiFetch(`/api/v1/admin/revisao/livro${busca}`);

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao Buscar Revisões: ${response.status}`,
        );
      }

      const data = await response.json();
      setLivroRevisado(data?.data ?? data);
    } catch (err) {
      console.error("Erro ao buscar livro para revisão", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRevisoes = useCallback(async (filtros = {}) => {
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

      setRevisoes(result.data || []);
      setLivrosRevisados(result.livros || []);
      setMeta(result.meta || null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRevisaoById = useCallback(async (id) => {
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

      setRevisaoAtual(result.data);
      setLivroRevisado(result.livro);
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

  const buscarRevisaoByUserId = useCallback(async (id) => {
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

      const data = result.data;
      setRevisoes(data || []);
      setMeta(result.meta || null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRevisaoByLivroId = useCallback(async (id) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/revisao/livro/${id}`);

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao buscar revisão por ID: ${response.status}`,
        );
      }

      const result = await response.json();

      const data = result.data;
      setRevisaoAtual(data || null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const verificarRevisor = useCallback(async (livroId) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(
        `/api/v1/admin/revisao/verificarRevisor/${livroId}`,
      );

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao buscar revisão por ID: ${response.status}`,
        );
      }

      const result = await response.json();

      const data = result;

      if (data != null) {
        setRevisor(Boolean(data.revisor));
        setRevisaoAtual(data);
        setApontamento(data.apontamento || "");
        setNome(data.nome || "");
      } else {
        setRevisor(true);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const criarRevisao = useCallback(
    async (idLivro, novoEstado) => {
      if (!validarCamposTexto() || !manuscrito) {
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

        const revisaoCriada = await response.json();

        if (novoEstado && novoEstado !== LIVRO_ESTADO.EM_REVISAO) {
          const responseEstado = await apiFetch(
            `/api/v1/admin/revisao/estado-${novoEstado}`,
            {
              method: "PATCH",
              body: JSON.stringify({ idLivro, novoEstado }),
            },
          );

          if (!responseEstado.ok) {
            throw new Error(`Erro encontrado ao atualizar o estado do livro`);
          }

          const resultadoEstado = await responseEstado.json();
          setRevisaoAtual(resultadoEstado.revisao || resultadoEstado);
          setRevisor(false);
        } else {
          setRevisaoAtual(revisaoCriada);
        }
      } catch (err) {
        setError("erro");
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [nome, apontamento, manuscrito, validarCamposTexto],
  );

  const atualizarRevisao = useCallback(
    async (id, idLivro, novoEstado) => {
      console.log("a");

      if (!id) return;
      if (!validarCamposTexto()) {
        alert("Preencha todos os campos obrigatórios (Nome e Apontamento).");
        return;
      }

      console.log(novoEstado);

      setCarregando(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("apontamento", apontamento);
        formData.append("idLivro", idLivro);

        if (manuscrito && typeof manuscrito !== "string") {
          formData.append("manuscritoRevisto", manuscrito);
        }
        const response = await apiFetch(`/api/v1/admin/revisao/${id}`, {
          method: "PUT",
          body: formData,
          isFormData: true,
        });

        if (!response.ok) {
          throw new Error(`Erro retornado do servidor: ${response.status}`);
        }

        const revisaoAtualizada = await response.json();

        if (novoEstado && novoEstado !== LIVRO_ESTADO.EM_REVISAO) {
          const responseEstado = await apiFetch(
            `/api/v1/admin/revisao/estado-${novoEstado}`,
            {
              method: "PATCH",
              body: JSON.stringify({ idLivro, novoEstado }),
            },
          );

          if (!responseEstado.ok) {
            throw new Error(`Erro encontrado ao atualizar o estado do livro`);
          }

          const resultadoEstado = await responseEstado.json();
          setRevisaoAtual(resultadoEstado.revisao || resultadoEstado);
          setRevisor(false);
        } else {
          setRevisaoAtual(revisaoAtualizada);
        }
      } catch (err) {
        console.error("Erro ao atualizar revisão: ", err);
        setError(err.message);
      } finally {
        setCarregando(false);
      }
    },
    [nome, apontamento, manuscrito, validarCamposTexto],
  );

  const negarPublicacaoLivro = useCallback(async (idLivro) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/revisao/estado-negado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idLivro }),
      });

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao alterar estado do livro: ${response.status}`,
        );
      }

      return response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const publicarLivro = useCallback(async (idLivro) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(
        `/api/v1/admin/revisao/estado-publicado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idLivro }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao alterar estado do livro: ${response.status}`,
        );
      }

      return response.json();
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
    meta,
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
    buscarLivroRevisao,
    buscarRevisoes,
    buscarRevisaoById,
    buscarRevisaoByLivroId,
    verificarRevisor,
    criarRevisao,
    atualizarRevisao,
    negarPublicacaoLivro,
    publicarLivro,
    buscarRevisaoByUserId,
    limparCampos,
    revisor,
  };
};
