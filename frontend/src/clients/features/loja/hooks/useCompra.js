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

export const useCompra = () => {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [pedido, setPedido] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  const criarPedido = useCallback(async (itensCarrinho, enderecoId) => {
    setCarregando(true);
    setErro(null);
    try {
      const itens = itensCarrinho.map((item) => ({
        livroId: Number(item.id),
        fisico: item.tipo === "fisico",
        qtd: Number(item.quantidade) || 1,
      }));

      const response = await apiFetch("/api/v1/clients/loja/venda", {
        method: "POST",
        body: JSON.stringify({ itens, enderecoId }),
      });

      if (!response.ok) {
        throw new Error(
          await lerErro(response, "Não foi possível criar o pedido."),
        );
      }

      const venda = await response.json();
      return venda.venda;
    } catch (err) {
      setErro(err.message);
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  const pagarPedido = useCallback(async (vendaId) => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await apiFetch(
        `/api/v1/clients/loja/status/${vendaId}`,
        { method: "PATCH" },
      );

      if (!response.ok) {
        throw new Error(
          await lerErro(response, "Não foi possível confirmar o pagamento."),
        );
      }

      return true;
    } catch (err) {
      setErro(err.message);
      return false;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarPedido = useCallback(async (vendaId) => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await apiFetch(`/api/v1/clients/loja/venda/${vendaId}`);

      if (!response.ok) {
        throw new Error(await lerErro(response, "Pedido não encontrado."));
      }

      const { venda } = await response.json();
      setPedido(venda);
      return venda;
    } catch (err) {
      setErro(err.message);
      setPedido(null);
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  const reenviarEmailLivrosDigitais = useCallback(async (vendaId) => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await apiFetch(
        `/api/v1/clients/loja/${vendaId}/reenviar-email`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error(
          await lerErro(
            response,
            "Não foi possível reenviar o email dos livros digitais.",
          ),
        );
      }

      return true;
    } catch (err) {
      setErro(err.message);
      return false;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarPedidos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await apiFetch("/api/v1/clients/loja/historico-vendas");

      if (!response.ok) {
        throw new Error(
          await lerErro(response, "Não foi possível carregar seus pedidos."),
        );
      }

      const { vendaUsuario } = await response.json();
      setPedidos(vendaUsuario?.data || []);
    } catch (err) {
      setErro(err.message);
      setPedidos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    carregando,
    erro,
    pedido,
    pedidos,
    reenviarEmailLivrosDigitais,
    criarPedido,
    pagarPedido,
    buscarPedido,
    buscarPedidos,
  };
};
