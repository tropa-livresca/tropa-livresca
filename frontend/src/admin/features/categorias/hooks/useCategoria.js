import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api.js";

export const useCategoria = () => {
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
      alert("O campo nome é obrigatório.");
      return false;
    }

    if (!tipo || tipo.trim() === "") {
      alert("O campo tipo é obrigatório.");
      return false;
    }

    if (!descricao || descricao.trim() === "") {
      alert("O campo descrição é obrigatório.");
      return false;
    }
    return true;
  }, [nome, tipo, descricao]);

  const LimparFormulario = useCallback(() => {
    setNome("");
    setDescricao("");
    setTipo("");
  },[]);

  const FinalizarPayload = useCallback(() => {
    return JSON.stringify({
      nome: nome,
      tipo: tipo,
      descricao: descricao,
    });
  }, [nome, descricao, tipo]);

  const BuscarCategorias = useCallback(async (page = 1, limit = 12, busca = "", filtro = "", ordem = "", tipo ="") => {
    setCarregando(true);
    setMeta(null);
    setError(null);

    try { 
      const response = await apiFetch(`/api/v1/admin/categorias?page=${page}&limit=${limit}&busca=${encodeURIComponent(busca)}&filtro=${filtro}&ordem=${ordem}&tipo=${tipo}`);

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao Buscar Categorias: ${response.status}`,
        );
      }

      const data = response.data;
      setCategorias(data.data || []);
      setMeta(data.meta);
      setCarregando(false);
    } catch (err) {
      console.error("Erro ao buscar categorias:", error);
      setError(err.message);
      setCarregando(false);
    } finally {
      setCarregando(false);
    }
  }, [error]);

  const BuscarCategoriaById = useCallback(async (id) => {
    if(!id) return;

    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/categorias/${id}`);

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao buscar categoria por ID: ${response.status}`,
        );
      }

      const data = response.data;
  
      setCategoria(data);
      setNome(data.nome || "");
      setTipo(data.tipo || "");
      setDescricao(data.descricao || "");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  const AtualizarCategoria = useCallback(
    async (id, e) => {
      if(e && typeof e.preventDefault === "function") e.preventDefault();
      if(!id) return;
      if(!ValidarCampos()) return;

      setCarregando(true);
      setError(null);
      try {
        const response = await apiFetch(`/api/v1/admin/categorias/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: FinalizarPayload(),
        });

        if (!response.ok) {
          throw new Error(
            `Erro encontrado ao atualizar categoria: ${response.status}`,
          );
        }

        const json = await response.json();
        const data = json.data || json;
      
        setCategoria(data);
        alert("Categoria atualizada com sucesso.");
        await BuscarCategorias();
      } catch (error) {
        console.error("Erro ao atualizar categoria.", error);
        alert("Ocorreu erro ao atualizar categoria.");
      } finally {
        setCarregando(false);
      }
    },
    [BuscarCategorias, FinalizarPayload, ValidarCampos]
  );

  const InativarCategoria = useCallback(async (id) => {
    if(!id) return;

    setCarregando(true);
    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/categorias/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao inativar categoria: ${response.status}`,
        );
      }

       const json = await response.json();
      const data = json.data || json;

      setCategoria(data);

      await BuscarCategorias();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, [BuscarCategorias]);

  const handleCriarCategoria = useCallback(async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!ValidarCampos()) return;

    setCarregando(true);

    setError(null);
    try {
      const response = await apiFetch(`/api/v1/admin/categorias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: FinalizarPayload(),
      });

      if (!response.ok) {
        throw new Error(
          `Erro encontrado ao criar categoria: ${response.status}`,
        );
      }

      const json = await response.json();
      const data = json.data || json;

      setCategoria(data);
      LimparFormulario();
      await BuscarCategorias();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCarregando(false);
    }
  }, [FinalizarPayload, BuscarCategorias, LimparFormulario, ValidarCampos]);

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
  };
};
