import { useState, useEffect } from "react";
import { useDadosBancarios } from "../../hooks/useDadosBancarios.js";
import Carregando from "../../../../components/Carregando/Carregando.jsx";
import styles from "./DadosBancarios.module.css";

const formularioInicial = {
  CPF: "",
  nome_completo: "",
  numero_banco: "",
  numero_agencia: "",
  numero_conta: "",
  tipo_conta: "",
};

export default function DadosBancarios() {
  const {
    criarConta,
    alterarDadosConta,
    carregando,
    buscarDadosBancarios,
    dadosBancarios,
  } = useDadosBancarios();

  const [dadosFormulario, setDadosFormulario] = useState(formularioInicial);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarDadosBancarios();
  }, []);

  useEffect(() => {
    const dados =
      dadosBancarios?.dadosBancarios ?? dadosBancarios?.dados ?? dadosBancarios;

    if (dados && Object.keys(dados).length > 0) {
      setDadosFormulario({
        ...formularioInicial,
        CPF: dados.CPF ?? "",
        nome_completo: dados.nome_completo ?? "",
        numero_banco: dados.numero_banco ?? "",
        numero_agencia: dados.numero_agencia ?? "",
        numero_conta: dados.numero_conta ?? "",
        tipo_conta: ["corrente", "poupanca"].includes(dados.tipo_conta)
          ? dados.tipo_conta
          : "",
      });
    } else {
      setDadosFormulario(formularioInicial);
    }
  }, [dadosBancarios]);

  const dadosConta =
    dadosBancarios?.dadosBancarios ?? dadosBancarios?.dados ?? dadosBancarios;

  const existeConta =
    dadosConta &&
    typeof dadosConta === "object" &&
    !Array.isArray(dadosConta) &&
    Object.keys(dadosConta).length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDadosFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setErro("");
    setMensagem("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErro("");
    setMensagem("");

    const {
      CPF,
      nome_completo,
      numero_banco,
      numero_agencia,
      numero_conta,
      tipo_conta,
    } = dadosFormulario;

    try {
      setSalvando(true);

      if (existeConta) {
        await alterarDadosConta(
          CPF,
          nome_completo,
          numero_banco,
          numero_agencia,
          numero_conta,
          tipo_conta,
        );

        setMensagem("Dados bancários atualizados com sucesso.");
      } else {
        await criarConta(
          CPF,
          nome_completo,
          numero_banco,
          numero_agencia,
          numero_conta,
          tipo_conta,
        );

        setMensagem("Dados bancários cadastrados com sucesso.");
      }

      await buscarDadosBancarios();
    } catch (error) {
      console.error("Erro ao salvar dados bancários:", error);
      setErro(error?.message || "Não foi possível salvar os dados bancários.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <Carregando />;
  }

  return (
    <main>
      <div className={styles.topo}>
      <h1 className={styles.titulo}>Dados bancários</h1>

      {existeConta ? (
        <p>Confira os dados cadastrados e altere-os, se necessário.</p>
      ) : (
        <p>
          Não há dados bancários cadastrados. Informe os dados da sua conta.
        </p>
      )}
      </div>
      <div className={styles.container}>

      <form onSubmit={handleSubmit} className={styles.form}>
        <legend className={styles.legend}>Preencha os campos abaixo</legend>
        <label htmlFor="CPF" className={styles.label}>CPF</label>
        <input
          id="CPF"
          name="CPF"
          value={dadosFormulario.CPF}
          onChange={handleChange}
           className={styles.input1}
           placeholder="Insira seu CPF"
          required
        />

        <label htmlFor="nome_completo" className={styles.label}>Nome completo</label>
        <input
          id="nome_completo"
          name="nome_completo"
          className={styles.input}
          value={dadosFormulario.nome_completo}
          onChange={handleChange}
          placeholder="Insira seu nome completo"
          required
        />

        <label htmlFor="numero_banco" className={styles.label}>Número do banco</label>
        <input
          id="numero_banco"
          name="numero_banco"
          value={dadosFormulario.numero_banco}
          onChange={handleChange}
           className={styles.input1}
           placeholder="Insira o número do seu banco"
          required
        />

        <label htmlFor="numero_agencia" className={styles.label}>Número da agência</label>
        <input
          id="numero_agencia"
          name="numero_agencia"
          value={dadosFormulario.numero_agencia}
          onChange={handleChange}
           className={styles.input1}
           placeholder="Insira o número da sua agência"
          required
        />

        <label htmlFor="numero_conta" className={styles.label}>Número da conta</label>
        <input
          id="numero_conta"
          name="numero_conta"
          value={dadosFormulario.numero_conta}
          onChange={handleChange}
           className={styles.input1}
           placeholder="Insira o número da sua conta"
          required
        />

        <label htmlFor="tipo_conta" className={styles.label}>Tipo de conta</label>
        <select
          id="tipo_conta"
          name="tipo_conta"
          value={dadosFormulario.tipo_conta}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          <option value="corrente">Conta corrente</option>
          <option value="poupanca">Conta poupança</option>
        </select>

        {erro && <p role="alert">{erro}</p>}
        {mensagem && <p role="status">{mensagem}</p>}

        <button type="submit" disabled={salvando}>
          {salvando
            ? "Salvando..."
            : existeConta
              ? "Salvar alterações"
              : "Cadastrar conta"}
        </button>
      </form>
      </div>
    </main>
  );
}
