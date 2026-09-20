import { apiFetch } from "../../common/services/api";
import { useState, useCallback } from "react";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [meta, setMeta] = useState(null);
  const [isMaster, setIsMaster] = useState(false);

  const buscarUsuarios = useCallback(
    async (page = 1, limit = 12, busca = "", filtro = "", ordem = "") => {
      setCarregando(true);
      setMeta(null);

      try {
        const res = await apiFetch(
          `/api/v1/admin/usuarios/?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&ordem=${ordem}&filtro=${filtro}`,
          { method: "GET", skipAuthRedirect: true },
        );

        const result = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            setUsuarios([]);
            setMeta(null);
            setCarregando(false);
            return;
          }
          throw new Error(result.error || `Erro ${res.status}`);
        }

        setUsuarios(result.data || []);
        setMeta(result.meta);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setUsuarios([]);
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  const buscarUsuarioById = useCallback(async (id) => {
    setCarregando(true);

    try {
      const res = await apiFetch(`/api/v1/admin/usuarios/${id}`, {
        method: "GET",
        skipAuthRedirect: true,
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setUsuario(null);
          setCarregando(false);
          return;
        }
        throw new Error(result.error || `Erro ${res.status}`);
      }

      setUsuario(result);
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  const promoverUsuario = useCallback(async (id) => {
    try {
      const res = await apiFetch(`/api/v1/admin/usuarios/${id}/promover`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        skipAuthRedirect: true,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erro ao promover usuário.");
      }

      return result;
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      throw error;
    }
  }, []);

  const alterarIsMasterFuncionario = useCallback(async (id, isMaster) => {
    try {
      const res = await apiFetch(`/api/v1/admin/usuarios/${id}/master`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isMaster }),
        skipAuthRedirect: true,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erro ao alterar nível Master.");
      }

      return result;
    } catch (error) {
      console.error("Erro ao alterar nível Master do funcionário:", error);
      throw error;
    }
  }, []);

  const inativarFuncionario = useCallback(async (id) => {
    try {
      const res = await apiFetch(`/api/v1/admin/usuarios/${id}/inativar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        skipAuthRedirect: true,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erro ao inativar funcionário.");
      }

      return result;
    } catch (error) {
      console.error("Erro ao inativar funcionário:", error);
      throw error;
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
      console.error("Erro ao alterar o isMaster do funcionário", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    meta,
    carregando,
    usuarios,
    usuario,
    isMaster,
    setUsuarios,
    setUsuario,
    promoverUsuario,
    alterarIsMasterFuncionario,
    inativarFuncionario,
    setMeta,
    verificarMaster,
    setCarregando,
    buscarUsuarios,
    buscarUsuarioById,
  };
};
