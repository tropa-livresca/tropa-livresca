import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCreditCard, FiChevronDown } from "react-icons/fi";

import styles from "./PagamentoCartao.module.css";
import BotaoComprar from "../../components/BotaoComprar/BotaoComprar";
import { useCompra } from "../../hooks/useCompra";
import { useCarrinho } from "../../hooks/useCarrinho";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

export default function PagamentoCartao() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const pedido = state?.pedido;
  const frete = Number(state?.frete || 0);

  const { pagarPedido, carregando, erro } = useCompra();
  const { limparCarrinho } = useCarrinho();

  const [parcelamentoAberto, setParcelamentoAberto] = useState(false);
  const [parcelamento, setParcelamento] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [erroLocal, setErroLocal] = useState("");

  const total = Number(pedido?.total || 0);

  const opcoesParcelamento = [
    { valor: "1", texto: "1x sem juros" },
    { valor: "2", texto: "2x sem juros" },
    { valor: "3", texto: "3x sem juros" },
  ];

  const handlePagar = async () => {
    setErroLocal("");

    if (!pedido?.id) {
      setErroLocal(
        "Pedido não encontrado. Volte ao checkout e tente novamente.",
      );
      return;
    }

    if (
      !numeroCartao.trim() ||
      !nomeCartao.trim() ||
      !validade.trim() ||
      !cvv.trim() ||
      !parcelamento
    ) {
      setErroLocal("Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      const pago = await pagarPedido(pedido.id);

      if (!pago) {
        setErroLocal("Não foi possível concluir o pagamento.");
        return;
      }

      limparCarrinho();

      navigate(`/pedido/${pedido.id}`, {
        replace: true,
        state: {
          pedido,
          pagamentoDemonstrativo: true,
          formaPagamento: "cartao",
          parcelas: Number(parcelamento),
        },
      });
    } catch (error) {
      setErroLocal(
        error?.message || "Ocorreu um erro ao processar o pagamento.",
      );
    }
  };

  if (!pedido?.id) {
    return (
      <main className={styles.container}>
        <p>Não foi possível localizar seu pedido.</p>

        <Link to="/pagamento" className={styles.voltar}>
          <FiArrowLeft />
          Voltar para o pagamento
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <Link to="/pagamento" className={styles.voltar}>
          <FiArrowLeft />
          Voltar para o pagamento
        </Link>
      </div>

      <section className={styles.formPagamento}>
        <div className={styles.formTitulo}>
          <div className={styles.icone}>
            <FiCreditCard />
          </div>

          <div>
            <strong>Pagamento com cartão</strong>
            <span>Preencha os dados abaixo para continuar.</span>
          </div>
        </div>

        <div className={styles.resumoPedido}>
          <span>Pedido #{pedido.id}</span>
          <strong>{formatarPreco(total)}</strong>

          {frete > 0 && <span>Frete incluído no total do pedido.</span>}
        </div>

        <form
          className={styles.formulario}
          onSubmit={(e) => {
            e.preventDefault();
            handlePagar();
          }}
        >
          <label>
            Número do cartão
            <input
              type="text"
              className={styles.numero2}
              placeholder="0000 0000 0000 0000"
              autoComplete="cc-number"
              inputMode="numeric"
              value={numeroCartao}
              onChange={(e) => setNumeroCartao(e.target.value)}
              disabled={carregando}
            />
          </label>

          <label>
            Nome no cartão
            <input
              type="text"
              placeholder="Nome completo"
              autoComplete="cc-name"
              value={nomeCartao}
              onChange={(e) => setNomeCartao(e.target.value)}
              disabled={carregando}
            />
          </label>

          <div className={styles.linhaCampos}>
            <label>
              Validade
              <input
                type="text"
                placeholder="MM/AA"
                autoComplete="cc-exp"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                disabled={carregando}
              />
            </label>

            <label>
              CVV
              <input
                type="password"
                className={styles.numero2}
                placeholder="123"
                autoComplete="cc-csc"
                inputMode="numeric"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                disabled={carregando}
              />
            </label>
          </div>

          <div className={styles.parcelamento}>
            <span>Parcelamento</span>

            <div className={styles.opcoesParcelamento}>
              <button
                type="button"
                className={styles.opcaoSelecionada}
                aria-expanded={parcelamentoAberto}
                onClick={() => setParcelamentoAberto((aberto) => !aberto)}
                disabled={carregando}
              >
                <span>
                  {parcelamento
                    ? opcoesParcelamento.find(
                        (opcao) => opcao.valor === parcelamento,
                      )?.texto
                    : "Selecione o parcelamento"}
                </span>

                <FiChevronDown
                  className={
                    parcelamentoAberto ? styles.setaAberta : styles.seta
                  }
                />
              </button>

              {parcelamentoAberto && (
                <div className={styles.listaParcelamento}>
                  {opcoesParcelamento.map((opcao) => (
                    <button
                      key={opcao.valor}
                      type="button"
                      onClick={() => {
                        setParcelamento(opcao.valor);
                        setParcelamentoAberto(false);
                      }}
                    >
                      {opcao.texto}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {parcelamento && (
            <p>
              {parcelamento}x de {formatarPreco(total / Number(parcelamento))}
            </p>
          )}

          {(erroLocal || erro) && (
            <p className={styles.erro} role="alert">
              {erroLocal || erro}
            </p>
          )}

          <BotaoComprar
            pedido={pedido}
            handleConfirmar={() => {}}
            handlePagar={handlePagar}
            carregando={carregando}
            formaPagamento="cartao"
            className={styles.botao}
          />

          <span className={styles.seguro}>
            Pagamento demonstrativo. Nenhuma cobrança real será feita. Não
            utilize dados reais de cartão nesta simulação.
          </span>
        </form>
      </section>
    </main>
  );
}
