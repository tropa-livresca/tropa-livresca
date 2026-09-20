import { useCallback, useState } from "react";
import { apiFetch } from "../../../../common/services/api.js";

export const useRevisao = () => {
  const [revisoes, setRevisoes] = useState([]);
  const [livros, setLivros] = useState([]);
  const [livro, setLivro] = useState(null);
  const [count, setCount] = useState(0);
  const [revisaoAtual, setRevisaoAtual] = useState(null);
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
      const response = await apiFetch(`/api/v1/admin/revisao/livro`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao Buscar Revisões: ${response.status}`,
        );
      }

      const data = response.data.json();
      setLivro(data);
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

      const data = response.data;
      const dadosLivro = response.livros;
      setRevisoes(data.data || []);
      setLivros(dadosLivro || []);
      setCount(data.count || 0);
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

      const data = response.data;

      setRevisaoAtual(data.data);
      setLivro(data.livro);
      setNome(data.data?.nome || "");
      setApontamento(data.data?.apontamento || "");
      setManuscrito(data.data?.manuscritoRevisto || null);
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
    [nome, apontamento, manuscrito, validarCamposTexto],
  );

  const atualizarRevisao = useCallback(
    async (id, e, idLivro) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();

      if (!id) return;
      if (!validarCamposTexto()) {
        alert("Preencha todos os campos obrigatórios (Nome e Apontamento).");
        return;
      }

      setCarregando(true);
      setError(null);
      try {
        const corpo = {};
        if (nome) corpo.nome = nome;
        if (apontamento) corpo.apontamento = apontamento;

        const libroIdAtual = idLivro || livro?.id;
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
    [nome, apontamento, livro, validarCamposTexto],
  );

  const inativarRevisao = useCallback(async (id) => {
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

      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const solicitarCorrecaoLivro = useCallback(async (idLivro) => {
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/revisao/estado-correcao`, {
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

      return response.data;
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
    livro,
    setLivro,
    livros,
    setLivros,
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
    criarRevisao,
    atualizarRevisao,
    inativarRevisao,
    negarPublicacaoLivro,
    publicarLivro,
    solicitarCorrecaoLivro,
    limparCampos,
  };
};
