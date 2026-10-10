import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api";

export const useDadosBancarios = () => {
  const [dadosBancarios, setDadosBancarios] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarDadosBancarios = useCallback(async () => {
    setCarregando(true);

    try {
      const res = await apiFetch(
        "/api/v1/clients/movimentacoes/dados-bancarios",
        {
          method: "GET",
        },
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error("Erro ao buscar os dados bancários");
      }
      setDadosBancarios(json);
    } catch (err) {
      console.error("Problema ao buscar os dados bancários:", err);
      setDadosBancarios(null);
    } finally {
      setCarregando(false);
    }
  });

  const criarConta = useCallback(
    async (
      CPF = "",
      nomeCompleto = "",
      numeroBanco = "",
      numeroAgencia = "",
      numeroConta = "",
      tipoConta = "",
    ) => {
      setCarregando(true);
      try {
        const res = await apiFetch("/api/v1/clients/movimentacoes", {
          method: "POST",
          body: JSON.stringify({
            CPF,
            nomeCompleto,
            numeroBanco,
            numeroAgencia,
            numeroConta,
            tipoConta,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error("Erro ao criar a conta");
        }

        setDadosBancarios(json);
      } catch (err) {
        console.error("Problema ao criar a conta:", err);
        setDadosBancarios(null);
      } finally {
        setCarregando(false);
      }
    },
  );

  const alterarDadosConta = useCallback(
    async (
      CPF = "",
      nomeCompleto = "",
      numeroBanco = "",
      numeroAgencia = "",
      numeroConta = "",
      tipoConta = "",
    ) => {
      setCarregando(true);
      try {
        const res = await apiFetch("/api/v1/clients/movimentacoes", {
          method: "PUT",
          body: JSON.stringify({
            CPF,
            nomeCompleto,
            numeroBanco,
            numeroAgencia,
            numeroConta,
            tipoConta,
          }),
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error("Erro ao alterar os dados da conta");
        }

        setDadosBancarios(json);
      } catch (err) {
        console.error("Problema ao alterar os dados da conta:", err);
        setDadosBancarios(null);
      } finally {
        setCarregando(false);
      }
    },
  );

  const solicitarSaque = useCallback(async (valorSaque) => {
    setCarregando(true);
    try {
      const res = await apiFetch("/api/v1/clients/movimentacoes", {
        method: "PATCH",
        body: JSON.stringify({ valorSaque }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error("Erro ao solicitar saque");
      }

      setDadosBancarios(json);
    } catch (err) {
      console.error("Problema ao solicitar saque:", err);
      setDadosBancarios(null);
    } finally {
      setCarregando(false);
    }
  });

  return {
    criarConta,
    alterarDadosConta,
    buscarDadosBancarios,
    solicitarSaque,
    carregando,
    dadosBancarios,
  };
};
