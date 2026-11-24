import { useState, useCallback } from "react";
import { apiFetch } from "../../../../common/services/api";

const extrairDadosBancarios = (resposta) =>
  resposta?.dadosBancarios ??
  resposta?.dados ??
  resposta?.conta ??
  resposta?.contaAlterada ??
  resposta ??
  null;

const lerResposta = async (resposta, mensagemErro) => {
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados?.error || dados?.message || mensagemErro);
  }
  return dados;
};

export const useDadosBancarios = () => {
  const [dadosBancarios, setDadosBancarios] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const buscarDadosBancarios = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const res = await apiFetch(
        "/api/v1/clients/movimentacoes/dados-bancarios",
        {
          method: "GET",
        },
      );

      const json = await lerResposta(
        res,
        "Erro ao buscar os dados bancários",
      );
      setDadosBancarios(extrairDadosBancarios(json));
    } catch (err) {
      console.error("Problema ao buscar os dados bancários:", err);
      setErro(err?.message || "Erro ao buscar os dados bancários");
    } finally {
      setCarregando(false);
    }
  }, []);

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
      setErro("");
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

        const json = await lerResposta(res, "Erro ao criar a conta");

        setDadosBancarios(extrairDadosBancarios(json));
      } catch (err) {
        console.error("Problema ao criar a conta:", err);
        setErro(err?.message || "Erro ao criar a conta");
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [],
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
      setErro("");
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
        const json = await lerResposta(
          res,
          "Erro ao alterar os dados da conta",
        );

        setDadosBancarios(extrairDadosBancarios(json));
      } catch (err) {
        console.error("Problema ao alterar os dados da conta:", err);
        setErro(err?.message || "Erro ao alterar os dados da conta");
        throw err;
      } finally {
        setCarregando(false);
      }
    },
    [],
  );

  const solicitarSaque = useCallback(async (valorSaque) => {
    setCarregando(true);
    setErro("");
    try {
      const res = await apiFetch("/api/v1/clients/movimentacoes", {
        method: "PATCH",
        body: JSON.stringify({ valorSaque }),
      });
      return await lerResposta(res, "Erro ao solicitar saque");
    } catch (err) {
      console.error("Problema ao solicitar saque:", err);
      setErro(err?.message || "Erro ao solicitar saque");
      throw err;
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    criarConta,
    alterarDadosConta,
    buscarDadosBancarios,
    solicitarSaque,
    carregando,
    dadosBancarios,
    erro,
  };
};
