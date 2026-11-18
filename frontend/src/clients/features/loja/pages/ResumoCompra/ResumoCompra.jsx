import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";
import base from "../Compra/Compra.module.css";
import styles from "./ResumoCompra.module.css";

import { useCompra } from "../../hooks/useCompra";
import Carregando from "../../../../components/Carregando/Carregando";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "";

export default function ResumoCompra() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    pedido,
    buscarPedido,
    carregando,
    erro,
    reenviarEmailLivrosDigitais,
  } = useCompra();

  useEffect(() => {
    buscarPedido(id);
  }, [id, buscarPedido]);

  if (carregando && !pedido) {
    return <Carregando mensagem="Carregando pedido..." />;
  }

  if (!pedido) {
    return (
      <main className={base.container}>
        <section className={base.vazio}>
          <p>{erro || "Pedido não encontrado."}</p>

          <Link to="/loja" className={base.voltar}>
            <FiArrowLeft /> Voltar para a Loja
          </Link>
        </section>
      </main>
    );
  }

  const itens = pedido.itensVenda || [];

  const totalItens = itens.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0,
  );

  const frete = Number(pedido.total || 0) - totalItens;
  const temDigital = itens.some((item) => !item.fisico);
  const pago = pedido.status_pagamento === "pago";
  const endereco = pedido.endereco_entrega;

  return (
    <main className={styles.main}>
      <DescricaoTela
        titulo={
          <>
            Resumo do pedido #<span className={styles.numero}>{pedido.id}</span>
          </>
        }
        descricao={
          <>
            Feito em{" "}
            <span className={styles.numero}>{formatarData(pedido.data)}</span> ·
            acompanhe o pagamento e a entrega por aqui.
          </>
        }
      />

      <div className={base.container}>
        <div className={base.conteudo}>
          <div className={base.colunaPrincipal}>
            {pago && (
              <section className={styles.confirmacao}>
                <div className={styles.confirmacaoIcone}>
                  <FaCheckCircle />
                </div>

                <div className={styles.confirmacaoTexto}>
                  <h3>Pagamento confirmado!</h3>

                  <p>
                    O pagamento do pedido
                    <span className={styles.numero}> #{pedido.id}</span> foi
                    aprovado com sucesso.
                  </p>

                  {temDigital && (
                    <p>
                      Seu e-book será enviado para o e-mail da sua conta. Caso o
                      e-mail não tenha chegado, clique no botão abaixo:
                    </p>
                  )}

                  <div className={styles.acoes}>
                    {temDigital && (
                      <button
                        className={styles.botaoSecundario}
                        type="button"
                        onClick={() => reenviarEmailLivrosDigitais(pedido.id)}
                      >
                        Reenviar Email
                      </button>
                    )}

                    <button
                      className={styles.botaoPrimario}
                      type="button"
                      onClick={() => navigate("/")}
                    >
                      Voltar à página inicial
                    </button>
                  </div>
                </div>
              </section>
            )}

            {endereco && (
              <section className={base.cartao}>
                <h2>Entrega</h2>

                <p className={base.aviso}>
                  {endereco.rua}, <span className={styles.numero}>{endereco.num}</span>
                  {endereco.complemento ? ` - ${endereco.complemento}` : ""}
                  <br />
                  {endereco.bairro} · {endereco.cidade}/{endereco.estado} · <span className={styles.numero}>CEP{" "}
                  {endereco.cep}</span>
                </p>

                <p className={styles.status}>
                  Status da entrega: <strong>{pedido.status_entrega}</strong>
                </p>
              </section>
            )}
          </div>

          <div className={styles.colunaLateral}>
            <aside className={base.resumo}>
              <h2>Resumo</h2>

              <div className={base.linha}>
                <span>Livros</span>
                <strong className={styles.numero}>{formatarPreco(totalItens)}</strong>
              </div>

              <div className={base.linha}>
                <span>Frete</span>
                <strong className={styles.numero}>{frete > 0 ? formatarPreco(frete) : "Grátis"}</strong>
              </div>

              <div className={`${base.linha} ${base.total}`}>
                <span>Total</span>
                <strong className={styles.numero}>{formatarPreco(pedido.total)}</strong>
              </div>

              <p
                className={`${styles.status2} ${pago ? styles.pago : styles.pendente}`}
              >
                Pagamento: <strong>{pago ? "Pago" : "Pendente"}</strong>
              </p>

              <Link to="/pedidos" className={base.voltar}>
                <FiArrowLeft /> Ver meus pedidos
              </Link>
            </aside>

            <section className={base.cartao}>
              <h2>Itens</h2>

              <ul className={base.itens}>
                {itens.map((item) => (
                  <li key={item.id} className={base.item}>
                    <div>
                      <strong>{item.livros?.titulo || "Livro"}</strong>

                      <small>
                        {item.fisico ? "Físico" : "Digital"} · <span className={styles.numero}>{item.qtd}x{" "}
                        {formatarPreco(item.preco_unitario)}</span>
                      </small>
                    </div>

                    <span className={styles.numero}>{formatarPreco(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}