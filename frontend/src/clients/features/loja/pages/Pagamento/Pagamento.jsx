import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import styles from "./Pagamento.module.css";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";
import BotaoComprar from "../../components/BotaoComprar/BotaoComprar";
import { useCarrinho } from "../../hooks/useCarrinho";
import { useCompra } from "../../hooks/useCompra";
import { useEndereco } from "../../../perfil/hooks/useEndereco";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0)
    .toFixed(2)
    .replace(".", ",")}`;

export default function Pagamento() {
  const { frete } = useParams();
  const navigate = useNavigate();
  const { itens, valorSubtotal, limparCarrinho } = useCarrinho();
  const { enderecos = [], BuscarEnderecos } = useEndereco();
  const { criarPedido, pagarPedido, carregando, erro } = useCompra();

  const [enderecoEscolhido, setEnderecoId] = useState(null);
  const [pedido] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState("");

  const temFisico = itens.some((item) => item.tipo === "fisico");
  const precoTotal = Number(valorSubtotal) + Number(frete);

  console.log(precoTotal);

  useEffect(() => {
    if (temFisico) BuscarEnderecos();
  }, [temFisico, BuscarEnderecos]);

  const enderecoPadrao = enderecos.find((e) => e.principal) || enderecos[0];
  const enderecoId = enderecoEscolhido ?? enderecoPadrao?.id ?? null;

  const handleConfirmar = async () => {
    if (!formaPagamento) return;
    if (temFisico && !enderecoId) return;

    const vendaCriada = await criarPedido(
      itens,
      temFisico ? enderecoId : null,
      temFisico,
    );

    if (!vendaCriada?.id) return;

    navigate(`/pagamento/${formaPagamento}`, {
      state: {
        pedido: vendaCriada,
        formaPagamento,
        frete: Number(frete || 0),
      },
    });
  };
  const handlePagar = async () => {
    if (!pedido?.id) return;
    const pago = await pagarPedido(pedido.id);
    if (pago) {
      limparCarrinho();
      navigate(`/pedido/${pedido.id}`, { replace: true });
    }
  };

  if (itens.length === 0 && !pedido) {
    return (
      <main className={styles.container}>
        <section className={styles.vazio}>
          <p>Seu carrinho está vazio.</p>
          <Link to="/loja" className={styles.voltar}>
            <FiArrowLeft /> Voltar para a Loja
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <DescricaoTela
        titulo="Finalizar compra"
        descricao={
          pedido
            ? "Pedido criado. Confirme o pagamento para concluir."
            : "Confira seus produtos, escolha o endereço, o frete e a forma de pagamento."
        }
      />

      <div className={styles.container}>
        <section className={styles.produtos}>
          <div className={styles.tituloSecao}>
            <span>Itens da compra</span>
          </div>

          <div className={styles.cabecalhoProdutos}>
            <span>Produto</span>
            <span>Preço</span>
            <span>Quantidade</span>
            <span>Total</span>
          </div>

          {itens.map((item) => (
            <div className={styles.itemProduto} key={`${item.id}-${item.tipo}`}>
              <div className={styles.produto}>
                <div className={styles.capa}>
                  {item.capa ? (
                    <img src={item.capa} alt={`Capa de ${item.titulo}`} />
                  ) : (
                    <span>Livro</span>
                  )}
                </div>
                <div className={styles.infoProduto}>
                  <strong>{item.titulo}</strong>
                  <span>
                    {item.autor ||
                      (item.tipo === "fisico" ? "Livro físico" : "E-book")}
                  </span>
                </div>
              </div>
              <span className={styles.numero}>{formatarPreco(item.preco)}</span>
              {temFisico ? (
                <span className={styles.numero}>{formatarPreco(frete)}</span>
              ) : (
                <></>
              )}
              <span className={styles.quantidade}>{item.quantidade}</span>
              <span className={styles.numero}>
                {formatarPreco(
                  Number(item.preco || 0) * Number(item.quantidade || 0),
                )}
              </span>
            </div>
          ))}
        </section>

        <div className={styles.checkout}>
          <div className={styles.colunaEsquerda}>
            {itens.some((item) => item.tipo !== "fisico") && (
              <section className={styles.card}>
                <div className={styles.tituloCard}>
                  <div>
                    <strong>Entrega digital</strong>
                    <span>
                      Após a confirmação, o e-book ficará disponível conforme as
                      regras da sua conta.
                    </span>
                  </div>
                </div>
              </section>
            )}

            {temFisico && (
              <section className={styles.card}>
                <div className={styles.tituloCard}>
                  <div>
                    <strong>Endereço de entrega</strong>
                    <span>
                      Escolha o endereço onde deseja receber seu pedido.
                    </span>
                  </div>
                  <Link to="/perfil/endereco" className={styles.button}>
                    + Novo endereço
                  </Link>
                </div>

                {enderecos.length === 0 ? (
                  <p className={styles.aviso}>
                    Você ainda não tem endereço cadastrado.{" "}
                    <Link to="/perfil/endereco">Cadastrar endereço</Link>
                  </p>
                ) : (
                  <div className={styles.listaEnderecos}>
                    {enderecos.map((endereco) => (
                      <label className={styles.endereco} key={endereco.id}>
                        <input
                          type="radio"
                          name="endereco"
                          value={endereco.id}
                          checked={enderecoId === endereco.id}
                          onChange={() => setEnderecoId(endereco.id)}
                          disabled={!!pedido}
                        />
                        <div className={styles.dadosEndereco}>
                          <strong>
                            {endereco.principal
                              ? "Endereço principal"
                              : "Endereço"}
                          </strong>
                          <span>
                            {endereco.rua},{" "}
                            <span className={styles.numero2}>
                              {endereco.num}
                            </span>
                            {endereco.complemento
                              ? ` - ${endereco.complemento}`
                              : ""}
                          </span>
                          <span>{endereco.bairro}</span>
                          <span>
                            {endereco.cidade} - {endereco.estado}
                          </span>
                          <span>
                            CEP:
                            <span className={styles.numero2}>
                              {" "}
                              {endereco.cep}
                            </span>
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            )}

            {temFisico && (
              <section className={styles.card}>
                <div className={styles.tituloCard}>
                  <div>
                    <strong>Forma de envio</strong>
                    <span>O frete será calculado ao confirmar o pedido.</span>
                  </div>
                </div>
                <p className={styles.aviso}>
                  As opções e o valor do frete são definidos pelo pedido.
                </p>
              </section>
            )}
          </div>

          <div className={styles.colunaDireita}>
            <section className={styles.card}>
              <div className={styles.tituloCard}>
                <div>
                  <strong>Forma de pagamento</strong>
                  <span>Escolha uma opção para continuar.</span>
                </div>
              </div>

              <div className={styles.formasPagamento}>
                {[
                  {
                    value: "cartao",
                    titulo: "Cartão",
                    descricao: "Crédito ou débito",
                  },
                  {
                    value: "pix",
                    titulo: "Pix",
                    descricao: "Pagamento via Pix",
                  },
                  {
                    value: "boleto",
                    titulo: "Boleto bancário",
                    descricao: "Pagamento com código de barras",
                  },
                ].map((forma) => (
                  <label
                    key={forma.value}
                    className={`${styles.formaPagamento} ${
                      formaPagamento === forma.value ? styles.selecionado : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="pagamento"
                      value={forma.value}
                      checked={formaPagamento === forma.value}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                      disabled={!!pedido || carregando}
                    />

                    <div>
                      <strong>{forma.titulo}</strong>
                      <span>{forma.descricao}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className={styles.resumo}>
              <div className={styles.tituloResumo}>
                <strong>Resumo da compra</strong>
              </div>
              <div className={styles.valores}>
                <div>
                  <span>Subtotal</span>
                  <strong className={styles.numero}>
                    {formatarPreco(
                      pedido
                        ? pedido.total - (pedido.frete || 0)
                        : valorSubtotal,
                    )}
                  </strong>
                </div>
                <div>
                  <span>Frete</span>
                  <strong className={styles.numero}>
                    {temFisico
                      ? frete > 0
                        ? formatarPreco(frete)
                        : "Grátis"
                      : "compra apenas digital"}
                  </strong>
                </div>
                <div className={styles.total}>
                  <span>Total</span>
                  <strong className={styles.numero}>
                    {formatarPreco(precoTotal)}
                  </strong>
                </div>
              </div>

              <BotaoComprar
                pedido={pedido}
                handleConfirmar={handleConfirmar}
                handlePagar={handlePagar}
                carregando={carregando}
                temFisico={temFisico}
                enderecoId={enderecoId}
                formaPagamento={formaPagamento}
                className={styles.botaoFinalizar}
              />

              <span className={styles.seguro}>
                Compra demonstrativa: nenhuma cobrança real é feita.
              </span>
              {erro && <p className={styles.erro}>{erro}</p>}
              {!pedido && (
                <div className={styles.dvd}>
                  <Link to="/carrinho" className={styles.voltar}>
                    <FiArrowLeft /> Voltar ao carrinho
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
