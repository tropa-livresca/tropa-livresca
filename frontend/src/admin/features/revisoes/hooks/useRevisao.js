import { useCallback, useState } from "react";
import { apiFetch } from "../../../../common/services/api.js";
import { LIVRO_ESTADO } from "../../../../common/config/livroEstados.js";

/**
 * Lê a resposta da API e apresenta mensagens de erro consistentes.
 */
async function lerResposta(response, mensagemErro) {
  let resultado = null;

  try {
    resultado = await response.json();
  } catch {
    // Algumas respostas podem não conter JSON.
  }

  if (!response.ok) {
    const mensagem =
      resultado?.message ||
      resultado?.mensagem ||
      resultado?.error ||
      resultado?.erro ||
      `${mensagemErro} (${response.status}).`;

    throw new Error(mensagem);
  }

  return resultado;
}

/**
 * Aceita tanto respostas diretas quanto respostas envelopadas em "data".
 */
function extrairDados(resultado) {
  return resultado?.data ?? resultado;
}

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
    return (
      typeof nome === "string" &&
      nome.trim().length > 0 &&
      typeof apontamento === "string" &&
      apontamento.trim().length > 0
    );
  }, [nome, apontamento]);

  const limparCampos = useCallback(() => {
    setNome("");
    setApontamento("");
    setManuscrito(null);
    setRevisaoAtual(null);
    setError(null);
  }, []);

  const buscarLivroRevisao = useCallback(async (id) => {
    setCarregando(true);
    setError(null);

    try {
      const busca = id ? `?busca=${encodeURIComponent(id)}` : "";

      const response = await apiFetch(`/api/v1/admin/revisao/livro${busca}`);

      const resultado = await lerResposta(
        response,
        "Erro ao buscar livro para revisão",
      );

      setLivroRevisado(extrairDados(resultado));

      return extrairDados(resultado);
    } catch (err) {
      setError(err.message || "Erro ao buscar livro para revisão.");
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRevisoes = useCallback(async (filtros = {}) => {
    setCarregando(true);
    setError(null);

    try {
      const parametros = new URLSearchParams();

      Object.entries(filtros).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && valor !== "") {
          parametros.append(chave, String(valor));
        }
      });

      const query = parametros.toString();
      const url = query
        ? `/api/v1/admin/revisao?${query}`
        : "/api/v1/admin/revisao";

      const response = await apiFetch(url);

      const resultado = await lerResposta(response, "Erro ao buscar revisões");

      setRevisoes(resultado?.data ?? []);
      setLivrosRevisados(resultado?.livros ?? []);
      setMeta(resultado?.meta ?? null);

      return resultado;
    } catch (err) {
      setError(err.message || "Erro ao buscar revisões.");
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRevisaoById = useCallback(async (id) => {
    if (!id) {
      throw new Error("Id da revisão não informado.");
    }

    setCarregando(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/api/v1/admin/revisao/${encodeURIComponent(id)}`,
      );

      const resultado = await lerResposta(
        response,
        "Erro ao buscar revisão por ID",
      );

      const revisao = resultado?.data ?? null;

      setRevisaoAtual(revisao);
      setLivroRevisado(resultado?.livro ?? null);
      setNome(revisao?.nome ?? "");
      setApontamento(revisao?.apontamento ?? "");
      setManuscrito(revisao?.arquivo ?? null);

      return resultado;
    } catch (err) {
      setError(err.message || "Erro ao buscar revisão.");
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRevisaoByUserId = useCallback(async (id) => {
    if (!id) {
      throw new Error("Id do usuário não informado.");
    }

    setCarregando(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/api/v1/admin/revisao/user/${encodeURIComponent(id)}`,
      );

      const resultado = await lerResposta(
        response,
        "Erro ao buscar revisões do usuário",
      );

      setRevisoes(resultado?.data ?? []);
      setMeta(resultado?.meta ?? null);

      return resultado;
    } catch (err) {
      setError(err.message || "Erro ao buscar revisões do usuário.");
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarRevisaoByLivroId = useCallback(async (id) => {
    if (!id) {
      throw new Error("Id do livro não informado.");
    }

    setCarregando(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/api/v1/admin/revisao/livro/${encodeURIComponent(id)}`,
      );

      const resultado = await lerResposta(
        response,
        "Erro ao buscar revisão do livro",
      );

      const revisao = extrairDados(resultado);

      setRevisaoAtual(revisao ?? null);

      return revisao;
    } catch (err) {
      setError(err.message || "Erro ao buscar revisão do livro.");
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const verificarRevisor = useCallback(async (livroId) => {
    if (!livroId) {
      throw new Error("Id do livro não informado.");
    }

    setCarregando(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/api/v1/admin/revisao/verificarRevisor/${encodeURIComponent(livroId)}`,
      );

      const resultado = await lerResposta(
        response,
        "Erro ao verificar revisor",
      );

      const data = extrairDados(resultado);

      if (data != null) {
        setRevisor(Boolean(data.revisor));
        setRevisaoAtual(data);
        setApontamento(data.apontamento ?? "");
        setNome(data.nome ?? "");
        setManuscrito(data.arquivo ?? null);
      } else {
        // Mantém a regra anterior: ausência de revisão significa
        // que o usuário pode prosseguir com a operação.
        setRevisor(true);
        setRevisaoAtual(null);
        setApontamento("");
        setNome("");
        setManuscrito(null);
      }

      return data;
    } catch (err) {
      setError(err.message || "Erro ao verificar revisor.");
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const alterarEstadoLivro = useCallback(async (idLivro, novoEstado) => {
    const response = await apiFetch(
      `/api/v1/admin/revisao/estado-${novoEstado}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idLivro, novoEstado }),
      },
    );

    return lerResposta(
      response,
      "A revisão foi salva, mas não foi possível atualizar o estado do livro",
    );
  }, []);

  const criarRevisao = useCallback(
    async (idLivro, novoEstado) => {
      if (!idLivro) {
        throw new Error("Id do livro não informado.");
      }

      if (!validarCamposTexto()) {
        throw new Error("Preencha os campos obrigatórios: Nome e Apontamento.");
      }

      if (!manuscrito || typeof manuscrito === "string") {
        throw new Error("Anexe o manuscrito revisado.");
      }

      setCarregando(true);
      setError(null);

      let revisaoSalva = false;

      try {
        const formData = new FormData();

        formData.append("nome", nome.trim());
        formData.append("apontamento", apontamento.trim());
        formData.append("idLivro", idLivro);
        formData.append("manuscritoRevisto", manuscrito);

        const response = await apiFetch("/api/v1/admin/revisao", {
          method: "POST",
          body: formData,
          isFormData: true,
        });

        const resultado = await lerResposta(response, "Erro ao criar revisão");

        const revisao = extrairDados(resultado);

        revisaoSalva = true;
        setRevisaoAtual(revisao);

        if (novoEstado && novoEstado !== LIVRO_ESTADO.EM_REVISAO) {
          const resultadoEstado = await alterarEstadoLivro(idLivro, novoEstado);

          setRevisaoAtual(resultadoEstado?.revisao ?? revisao);

          setRevisor(false);

          return resultadoEstado;
        }

        return revisao;
      } catch (err) {
        const mensagem = revisaoSalva
          ? `A revisão foi salva, mas ocorreu um erro na etapa seguinte: ${err.message}`
          : err.message || "Erro ao criar revisão.";

        setError(mensagem);
        throw new Error(mensagem, { cause: err });
      } finally {
        setCarregando(false);
      }
    },
    [nome, apontamento, manuscrito, validarCamposTexto, alterarEstadoLivro],
  );

  const atualizarRevisao = useCallback(
    async (id, idLivro, novoEstado) => {
      if (!id) {
        throw new Error("Id da revisão não informado.");
      }

      if (!idLivro) {
        throw new Error("Id do livro não informado.");
      }

      if (!validarCamposTexto()) {
        throw new Error("Preencha os campos obrigatórios: Nome e Apontamento.");
      }

      setCarregando(true);
      setError(null);

      let revisaoSalva = false;

      try {
        const formData = new FormData();

        formData.append("nome", nome.trim());
        formData.append("apontamento", apontamento.trim());
        formData.append("idLivro", idLivro);

        if (manuscrito && typeof manuscrito !== "string") {
          formData.append("manuscritoRevisto", manuscrito);
        }

        const response = await apiFetch(
          `/api/v1/admin/revisao/${encodeURIComponent(id)}`,
          {
            method: "PUT",
            body: formData,
            isFormData: true,
          },
        );

        const resultado = await lerResposta(
          response,
          "Erro ao atualizar revisão",
        );

        const revisao = extrairDados(resultado);

        revisaoSalva = true;
        setRevisaoAtual(revisao);

        if (novoEstado && novoEstado !== LIVRO_ESTADO.EM_REVISAO) {
          const resultadoEstado = await alterarEstadoLivro(idLivro, novoEstado);

          setRevisaoAtual(resultadoEstado?.revisao ?? revisao);

          setRevisor(false);

          return resultadoEstado;
        }

        return revisao;
      } catch (err) {
        const mensagem = revisaoSalva
          ? `A revisão foi salva, mas ocorreu um erro na etapa seguinte: ${err.message}`
          : err.message || "Erro ao atualizar revisão.";

        setError(mensagem);
        throw new Error(mensagem, { cause: err });
      } finally {
        setCarregando(false);
      }
    },
    [nome, apontamento, manuscrito, validarCamposTexto, alterarEstadoLivro],
  );

  const negarPublicacaoLivro = useCallback(async (idLivro) => {
    if (!idLivro) {
      throw new Error("Id do livro não informado.");
    }

    setCarregando(true);
    setError(null);

    try {
      const response = await apiFetch("/api/v1/admin/revisao/estado-negado", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idLivro }),
      });

      return await lerResposta(response, "Erro ao negar publicação do livro");
    } catch (err) {
      setError(err.message || "Erro ao negar publicação do livro.");
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const publicarLivro = useCallback(async (idLivro) => {
    if (!idLivro) {
      throw new Error("Id do livro não informado.");
    }

    setCarregando(true);
    setError(null);

    try {
      const response = await apiFetch(
        "/api/v1/admin/revisao/estado-publicado",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idLivro }),
        },
      );

      return await lerResposta(response, "Erro ao publicar livro");
    } catch (err) {
      setError(err.message || "Erro ao publicar livro.");
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
