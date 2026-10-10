import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import base from "../../../loja/pages/Compra/Compra.module.css";
import styles from "./MeusGanhos.module.css";
import { useGanhos } from "../../hooks/useGanhos";
import Carregando from "../../../../components/Carregando/Carregando";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";
import { useDadosBancarios } from "../../../perfil/hooks/useDadosBancarios.js";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "";

export default function MeusGanhos() {
  const { dadosBancarios, buscarDadosBancarios, solicitarSaque } =
    useDadosBancarios();

  const { ganhos, carregando, erro, buscarGanhos } = useGanhos();

  const [valorSaque, setValorSaque] = useState("");
  const [solicitandoSaque, setSolicitandoSaque] = useState(false);
  const [mensagemSaque, setMensagemSaque] = useState("");
  const [erroSaque, setErroSaque] = useState("");

  useEffect(() => {
    buscarDadosBancarios();
  }, [buscarDadosBancarios]);

  useEffect(() => {
    buscarGanhos();
  }, [buscarGanhos]);

  const extrato = ganhos?.extrato || [];
  const saldoDisponivel = Number(ganhos?.saldo ?? 0);

  const totalRecebido = extrato
    .filter((mov) => mov.tipo === "entrada")
    .reduce((acc, mov) => acc + Number(mov.valor || 0), 0);

  const existeConta = dadosBancarios && Object.keys(dadosBancarios).length > 0;

  const handleSolicitarSaque = async (e) => {
    e.preventDefault();

    setMensagemSaque("");
    setErroSaque("");

    const valor = Number(valorSaque);

    if (!existeConta) {
      setErroSaque(
        "Cadastre seus dados bancários antes de solicitar um saque.",
      );
      return;
    }

    if (!Number.isFinite(valor) || valor <= 0) {
      setErroSaque("Informe um valor de saque válido.");
      return;
    }

    if (valor > saldoDisponivel) {
      setErroSaque(
        "O valor solicitado não pode ser maior que seu saldo disponível.",
      );
      return;
    }

    try {
      setSolicitandoSaque(true);

      await solicitarSaque(valor);

      setMensagemSaque("Solicitação de saque enviada com sucesso.");
      setValorSaque("");

      await buscarGanhos();
    } catch (error) {
      console.error("Erro ao solicitar saque:", error);
      setErroSaque(
        error?.message ||
          "Não foi possível solicitar o saque. Tente novamente.",
      );
    } finally {
      setSolicitandoSaque(false);
    }
  };

  return (
    <main>
      <DescricaoTela
        titulo="Meus ganhos"
        descricao="A cada livro seu vendido na loja, você recebe 30% do valor como direitos autorais."
      />

      <div className={base.container}>
        {carregando && !ganhos ? (
          <Carregando mensagem="Carregando seus ganhos..." />
        ) : erro ? (
          <p className={base.erro}>{erro}</p>
        ) : (
          <div className={styles.conteudo}>
            <div className={styles.cartoes}>
              <div className={`${styles.cartaoResumo} ${styles.destaque}`}>
                <span>Saldo disponível</span>
                <strong>{formatarPreco(saldoDisponivel)}</strong>
              </div>

              <div className={styles.cartaoResumo}>
                <span>Total recebido</span>
                <strong>{formatarPreco(totalRecebido)}</strong>
              </div>
            </div>

            <section className={base.cartao}>
              <h2>Solicitar saque</h2>

              {existeConta ? (
                <p>
                  O valor solicitado será encaminhado para a conta bancária
                  cadastrada.
                </p>
              ) : (
                <p className={base.aviso}>
                  Você precisa cadastrar seus dados bancários antes de solicitar
                  um saque.{" "}
                  <Link to="/perfil/dadosbancarios">
                    Cadastrar dados bancários
                  </Link>
                </p>
              )}

              <form onSubmit={handleSolicitarSaque}>
                <label htmlFor="valorSaque">Valor do saque (R$)</label>

                <input
                  id="valorSaque"
                  name="valorSaque"
                  type="number"
                  min="0.01"
                  max={saldoDisponivel}
                  step="0.01"
                  value={valorSaque}
                  onChange={(e) => {
                    setValorSaque(e.target.value);
                    setErroSaque("");
                    setMensagemSaque("");
                  }}
                  placeholder="Ex.: 50,00"
                  required
                  disabled={
                    solicitandoSaque || !existeConta || saldoDisponivel <= 0
                  }
                />

                <p>Saldo disponível: {formatarPreco(saldoDisponivel)}</p>

                {erroSaque && (
                  <p role="alert" className={base.erro}>
                    {erroSaque}
                  </p>
                )}

                {mensagemSaque && <p role="status">{mensagemSaque}</p>}

                <button
                  type="submit"
                  disabled={
                    solicitandoSaque || !existeConta || saldoDisponivel <= 0
                  }
                >
                  {solicitandoSaque ? "Solicitando..." : "Solicitar saque"}
                </button>
              </form>
            </section>

            <section className={base.cartao}>
              <strong className={styles.ex}>Extrato</strong>

              {extrato.length === 0 ? (
                <p className={base.aviso}>
                  Você ainda não recebeu repasses. Quando um livro seu for
                  vendido e o repasse for autorizado, ele aparece aqui.{" "}
                  <Link to="/meuslivros">Ver meus livros</Link>
                </p>
              ) : (
                <ul className={styles.extrato}>
                  {extrato.map((mov) => {
                    const entrada = mov.tipo === "entrada";

                    return (
                      <li key={mov.id} className={styles.movimentacao}>
                        <span
                          className={`${styles.icone} ${
                            entrada ? styles.iconeEntrada : styles.iconeSaida
                          }`}
                        >
                          {entrada ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                        </span>

                        <div className={styles.descricao}>
                          <strong className={styles.numero}>
                            {entrada
                              ? `Direitos autorais${
                                  mov.fk_vendas_id
                                    ? ` · Pedido #${mov.fk_vendas_id}`
                                    : ""
                                }`
                              : "Saque"}
                          </strong>

                          <small>{formatarData(mov.data)}</small>
                        </div>

                        <strong
                          className={
                            entrada ? styles.valorEntrada : styles.valorSaida
                          }
                        >
                          {entrada ? "+" : "−"} {formatarPreco(mov.valor)}
                        </strong>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
