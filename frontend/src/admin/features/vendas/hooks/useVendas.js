import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api";

const lerErro = async (response, padrao) => {
  try {
    const json = await response.json();
    return json.error || json.message || padrao;
  } catch {
    return padrao;
  }
};

export const useVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [meta, setMeta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarVendas = useCallback(async (page = 1, limit = 10) => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await apiFetch(
        `/api/v1/admin/loja?page=${page}&limit=${limit}&ordem=descendente`,
        { skipAuthRedirect: true },
      );

      if (!response.ok) {
        throw new Error(
          await lerErro(response, "Não foi possível carregar as vendas."),
        );
      }

      const json = await response.json();
      setVendas(json.data || []);
      setMeta(json.meta || null);
    } catch (err) {
      setErro(err.message);
      setVendas([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Executa uma ação e devolve a mensagem de erro, ou null se deu certo.
  const executar = async (endpoint, method, padrao) => {
    const response = await apiFetch(endpoint, {
      method,
      skipAuthRedirect: true,
    });
    return response.ok ? null : lerErro(response, padrao);
  };

  const autorizarRepasse = (vendaId) =>
    executar(
      `/api/v1/admin/movimentacoes/${vendaId}`,
      "PATCH",
      "Não foi possível autorizar o repasse.",
    );

  const enviarPedido = (vendaId) =>
    executar(
      `/api/v1/admin/loja/autorizacao/${vendaId}`,
      "PATCH",
      "Não foi possível marcar como enviado.",
    );

  const marcarEntregue = (vendaId) =>
    executar(
      `/api/v1/admin/loja/entregue/${vendaId}`,
      "POST",
      "Não foi possível marcar como entregue.",
    );

  return {
    vendas,
    meta,
    carregando,
    erro,
    buscarVendas,
    autorizarRepasse,
    enviarPedido,
    marcarEntregue,
  };
};
