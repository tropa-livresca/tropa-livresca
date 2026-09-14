import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api.js";

export const useFuncionario = () => {
  const [funcionario, setFuncionario] = useState(null);
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const buscarFuncionarios = useCallback(
    async (page = 1, limit = 12, busca = "", ordem = "") => {
      setCarregando(true);

      const url = `/api/v1/admin/funcionarios/?page =${page} && limit = ${limit} && busca = ${busca} && ordem = ${ordem}`;

      try {
        const res = await apiFetch(url, {
          method: "GET",
        });

        const result = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setCarregando(false);
            return;
          }

          throw new Error(result.error || `Erro ${res.status}`);
        }

        setFuncionarios(result.data || []);
      } catch (err) {
        console.error("Erro ao buscar funcionários", err);
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  const buscarFuncionarioById = useCallback(async (id) => {
    setCarregando(true);

    try {
      const res = await apiFetch(`/api/v1/admin/funcionarios/${id}`, {
        method: "GET",
      });

      const result = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          setCarregando(false);
          return;
        }

        throw new Error(result.error || `Erro ${res.status}`);
      }

      setFuncionario(result.data || null);
    } catch (err) {
      console.error("Erro ao buscar funcionário por id", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const alterarFuncao = useCallback(async (usuarioId, funcao) => {
    setCarregando(true);

    try {
      const res = await apiFetch(`/api/v1/admin/funcionarios/funcao`, {
        method: "PATCH",
        body: JSON.stringify({
          usuarioId: usuarioId,
          funcao: funcao,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setCarregando(false);
          return;
        }
        throw new Error(result.error || `Erro ${res.status}`);
      }
    } catch (err) {
      console.error("Erro ao alterar a função", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const alterarIsAdminFuncionario = useCallback(async (userId) => {
    setCarregando(true);

    try {
      const res = await apiFetch(`/api/v1/admin/funcionarios/funcao/`, {
        method: "PATCH",
        body: JSON.stringfy({
          funcionarioId: userId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setCarregando(false);
          return;
        }
        throw new Error(result.error || `Erro ${res.status}`);
      }
    } catch (err) {
      console.error("Erro ao alterar o isAdmin do funcionário", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    funcionario,
    funcionarios,
    buscarFuncionarios,
    buscarFuncionarioById,
    alterarFuncao,
    alterarIsAdminFuncionario,
    carregando,
  };
};
