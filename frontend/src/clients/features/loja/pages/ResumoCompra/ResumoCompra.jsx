import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";
import base from "../Compra/Compra.module.css";
import styles from "./ResumoCompra.module.css";
import confirmadoStyles from "../Confirmado/Confirmado.module.css";

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

  const { pedido, buscarPedido, carregando, erro } = useCompra();

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
    <main>
      <DescricaoTela
        titulo={
          <>
            Pedido #<span className={styles.numero}>{pedido.id}</span>
          </>
        }
        descricao={
          <>
            Feito em{" "}
            <span className={styles.numero}>{formatarData(pedido.data)}</span>
          </>
        }
      />

      <div className={base.container}>
        <div className={base.conteudo}>
          <div className={base.colunaPrincipal}>
            {pago && (
              <section className={confirmadoStyles.container}>
                <div className={confirmadoStyles.popup}>
                  <div className={confirmadoStyles.containerconf}>
                    <div className={confirmadoStyles.icone}>
                      <FaCheckCircle />
                    </div>

                    <h3>Pagamento confirmado!</h3>

                    <p>
                      Obrigado pela sua compra.
                      <br />O pagamento do pedido
                      <span className={confirmadoStyles.numero}>
                        {" "}
                        #{pedido.id}
                      </span>{" "}
                      foi aprovado com sucesso.
                    </p>

                    {temDigital && (
                      <p>Seu e-book será enviado para o e-mail da sua conta.</p>
                    )}

                    <button
                      className={confirmadoStyles.btn}
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
                  {endereco.rua}, {endereco.num}
                  {endereco.complemento ? ` - ${endereco.complemento}` : ""}
                  <br />
                  {endereco.bairro} · {endereco.cidade}/{endereco.estado} · CEP{" "}
                  {endereco.cep}
                </p>

                <p className={styles.status}>
                  Status da entrega: <strong>{pedido.status_entrega}</strong>
                </p>
              </section>
            )}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <aside className={base.resumo}>
              <h2>Resumo</h2>

              <div className={base.linha}>
                <span>Livros</span>
                <strong>{formatarPreco(totalItens)}</strong>
              </div>

              <div className={base.linha}>
                <span>Frete</span>
                <strong>{frete > 0 ? formatarPreco(frete) : "Grátis"}</strong>
              </div>

              <div className={`${base.linha} ${base.total}`}>
                <span>Total</span>
                <strong>{formatarPreco(pedido.total)}</strong>
              </div>

              <p className={styles.status}>
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
                        {item.fisico ? "Físico" : "Digital"} · {item.qtd}x{" "}
                        {formatarPreco(item.preco_unitario)}
                      </small>
                    </div>

                    <span>{formatarPreco(item.subtotal)}</span>
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
