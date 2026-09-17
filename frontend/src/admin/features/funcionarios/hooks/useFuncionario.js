import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api.js";

export const useFuncionario = () => {
  const [funcionario, setFuncionario] = useState(null);
  const [funcionarios, setFuncionarios] = useState([]);
  const [meta, setMeta] = useState();
  const [carregando, setCarregando] = useState(false);
  const [meta, setMeta] = useState(null);
  const [isMaster, setIsMaster] = useState(false);

  const buscarFuncionarios = useCallback(
    async (page = 1, limit = 12, busca = "", filtro = "", ordem = "") => {
      setCarregando(true);

      console.log(limit);

      const url = `/api/v1/admin/funcionarios/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&ordem=${ordem}&filtro=${filtro}`;

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

<<<<<<< HEAD
        setFuncionarios(result.data.data || []);
        setMeta(result.data.meta);
=======
        setFuncionarios(result.data || []);
        setMeta(result.meta || []);
>>>>>>> 0f4e28e6ed5fea4f341e4bf88a810accd0361802
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
    console.log(usuarioId);
    console.log(funcao);

    try {
      const res = await apiFetch(`/api/v1/admin/funcionarios/funcao`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      const res = await apiFetch(`/api/v1/admin/funcionarios/isadmin/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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

  const verificarMaster = useCallback(async () => {
    setCarregando(true);

    try {
      const res = await apiFetch(`/api/v1/auth/session-adm-master`, {
        method: "GET",
      });

      const result = await res.json();

      console.log(result);

      if (!res.ok) {
        if (res.status === 403) {
          setCarregando(false);
          return;
        } else {
          throw new Error(result.error || `Erro ${res.status}`);
        }
      }

      setIsMaster(true);
    } catch (err) {
      console.error("Erro ao alterar o isAdmin do funcionário", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    funcionario,
    funcionarios,
    meta,
    buscarFuncionarios,
    buscarFuncionarioById,
    alterarFuncao,
    alterarIsAdminFuncionario,
    carregando,
    meta,
    isMaster,
    verificarMaster,
  };
};
