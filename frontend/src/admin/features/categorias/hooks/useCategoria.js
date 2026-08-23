import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api.js";

export const useCategoria = () => {

  const [popup, setPopup] = useState(null);

  const mostrarPopup = useCallback((tipo, mensagem) => {
    setPopup({
      tipo,
      mensagem,
    });
  }, []);

  const fecharPopup = useCallback(() => {
    setPopup(null);
  }, []);

  const [categorias, setCategorias] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const ValidarCampos = useCallback(() => {
    if (!nome || nome.trim() === "") {
      mostrarPopup("erro", "O campo nome é obrigatório.");
      return false;
    }
    if (!descricao || descricao.trim() === "") {
      mostrarPopup("erro", "O campo descrição é obrigatório.");
      return false;
    }
    if (!tipo || tipo.trim() === "") {
      mostrarPopup("erro", "O campo tipo é obrigatório.");
      return false;
    }
    return true;
  }, [nome, tipo, descricao, mostrarPopup]);

  const LimparFormulario = useCallback(() => {
    setNome("");
    setDescricao("");
    setTipo("");
  }, []);

  const FinalizarPayload = useCallback(() => {
    return JSON.stringify({
      nome,
      tipo,
      descricao,
    });
  }, [nome, descricao, tipo]);

  const BuscarCategorias = useCallback(
    async (
      page = 1,
      limit = 12,
      busca = "",
      filtro = "",
      ordem = "",
      tipoFiltro = "",
    ) => {
      setCarregando(true);
      setMeta(null);
      setError(null);
      try {
        const response = await apiFetch(
          `/api/v1/admin/categorias?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&filtro=${filtro}&ordem=${ordem}&tipo=${tipoFiltro}`,
        );

        if (!response.ok) {
          throw new Error(
            `Erro encontrado ao Buscar Categorias: ${response.status}`,
          );
        }

        const responseData = response.data || (await response.json());
        setCategorias(responseData.data || []);
        setMeta(responseData.meta || null);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        setError(err.message);
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  const BuscarCategoriaById = useCallback(async (id) => {
    if (!id) return;
    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/categorias/${id}`);
      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao buscar categoria por ID: ${response.status}`,
        );
      }
      const responseData = response.data || (await response.json());
      const item = responseData.data || responseData;
      setCategoria(item);
      setNome(item.nome || "");
      setTipo(item.tipo || "");
      setDescricao(item.descricao || "");
      return item;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const AtualizarCategoria = useCallback(
    async (id, e) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (!id) return;
      if (!ValidarCampos()) return;

      setCarregando(true);
      setError(null);
      try {
        const response = await apiFetch(`/api/v1/admin/categorias/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: FinalizarPayload(),
        });
        if (!response.ok) {
          throw new Error(
            `Erro encontrado ao atualizar categoria: ${response.status}`,
          );
        }
        const responseData = response.data || (await response.json());
        setCategoria(responseData.data || responseData);
        mostrarPopup("sucesso", "Categoria atualizada com sucesso.");
        await BuscarCategorias();
      } catch (err) {
        console.error("Erro ao atualizar categoria.", err);
        mostrarPopup("erro", "Ocorreu erro ao atualizar categoria.");
      } finally {
        setCarregando(false);
      }
    },
    [BuscarCategorias, FinalizarPayload, ValidarCampos,mostrarPopup],
  );

  const InativarCategoria = useCallback(
    async (id) => {
      if (!id) return;
      setCarregando(true);
      setError(null);
      try {
        const response = await apiFetch(`/api/v1/admin/categorias/${id}/ativo`, {
          method: "PATCH",
        });
        if (!response.ok) {
          throw new Error(
            `Erro encontrado ao inativar categoria: ${response.status}`,
          );
        }
        const responseData = response.data || (await response.json());
        setCategoria(responseData.data || responseData);
        await BuscarCategorias();
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [BuscarCategorias],
  );

  const handleCriarCategoria = useCallback(
    async (e) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (!ValidarCampos()) return;

      setCarregando(true);
      setError(null);
      try {
        const response = await apiFetch(`/api/v1/admin/categorias`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: FinalizarPayload(),
        });
        if (!response.ok) {
          throw new Error(
            `Erro encontrado ao criar categoria: ${response.status}`,
          );
        }
        mostrarPopup("sucesso", "Categoria criada");
        const responseData = response.data || (await response.json());
        setCategoria(responseData.data || responseData);
        LimparFormulario();
        await BuscarCategorias();
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [FinalizarPayload, BuscarCategorias, LimparFormulario, ValidarCampos, mostrarPopup],
  );

  return {
    categorias,
    setCategorias,
    categoria,
    setCategoria,
    meta,
    setMeta,
    nome,
    setNome,
    tipo,
    setTipo,
    descricao,
    setDescricao,
    error,
    setError,
    carregando,
    setCarregando,
    BuscarCategorias,
    BuscarCategoriaById,
    handleCriarCategoria,
    AtualizarCategoria,
    InativarCategoria,
    popup,
    fecharPopup,
  };
};
