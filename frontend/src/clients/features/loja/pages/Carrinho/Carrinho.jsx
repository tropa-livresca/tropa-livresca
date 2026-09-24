import styles from "./Carrinho.module.css";
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCarrinho } from "../../hooks/useCarrinho";

export default function Carrinho() {
  const {
    itens = [],
    adicionarItem,
    removerQuantidade,
    excluirItem,
    limparCarrinho,
    valorSubtotal,
    valorTotal,
  } = useCarrinho();

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Carrinho</h1>
        <p>Confira seus livros e finalize seu pedido.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.conteudo}>
          {itens.length === 0 ? (
            <section
              className={styles.listaProdutos}
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <p>Seu carrinho está vazio no momento.</p>
              <Link
                to="/loja"
                className={styles.continuar}
                style={{ justifyContent: "center", marginTop: "20px" }}
              >
                <FiArrowLeft /> Voltar para a Loja
              </Link>
            </section>
          ) : (
            <section className={styles.listaProdutos}>
              <div className={styles.cabecalhoProdutos}>
                <span>Produto</span>
                <span>Preço</span>
                <span>Quantidade</span>
                <span>Total</span>
                <span></span>
              </div>

              {itens.map((item) => {
                const itemChave = `${item.id}-${item.tipo || "unico"}`;
                const totalItem = item.preco * item.quantidade;

                return (
                  <div key={itemChave} className={styles.produto}>
                    <div className={styles.produtoInfo}>
                      <Link
                        to={`/loja/livro/${item.id}`}
                        className={styles.capa}
                      >
                        {item.capa ? (
                          <img src={item.capa} alt={`Capa de ${item.titulo}`} />
                        ) : (
                          <div className={styles.semImagem}>Sem imagem</div>
                        )}
                      </Link>

                      <div className={styles.desc}>
                        <Link
                          to={`/loja/livro/${item.id}`}
                          className={styles.nome}
                        >
                          {item.titulo}
                        </Link>
                        <p className={styles.autor}>
                          {item.autor || "Autor Desconhecido"}
                        </p>
                        {item.tipo && (
                          <small
                            style={{
                              color: "#666",
                              display: "block",
                              marginTop: "4px",
                            }}
                          >
                            Formato: <strong>{item.tipo}</strong>
                          </small>
                        )}
                      </div>
                    </div>

                    <strong className={styles.preco}>
                      R\$ {Number(item.preco).toFixed(2).replace(".", ",")}
                    </strong>

                    <div className={styles.quantidade}>
                      <div className={styles.redondo}>
                        <button
                          type="button"
                          onClick={() => removerQuantidade(item.id, item.tipo)}
                        >
                          <FiMinus />
                        </button>

                        <span>{item.quantidade}</span>

                        <button
                          type="button"
                          onClick={() =>
                            adicionarItem({ ...item, quantidade: 1 })
                          }
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    <strong className={styles.totalProduto}>
                      R\$ {totalItem.toFixed(2).replace(".", ",")}
                    </strong>

                    <button
                      type="button"
                      className={styles.excluir}
                      onClick={() => excluirItem(item.id, item.tipo)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}

              <div style={{ textAlign: "right", marginTop: "15px" }}>
                <button
                  type="button"
                  onClick={limparCarrinho}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4d4d",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Limpar todo o carrinho
                </button>
              </div>
            </section>
          )}

          <aside className={styles.resumo}>
            <h2>Resumo</h2>

            <div className={styles.subtotal}>
              <span className={styles.sub}>Subtotal</span>
              <strong>
                R\$ {Number(valorSubtotal).toFixed(2).replace(".", ",")}
              </strong>
            </div>

            <div className={styles.cep}>
              <span className={styles.sub}>CEP</span>
              <input type="text" placeholder="CEP" />
            </div>

            <div className={styles.Total}>
              <span className={styles.sub}>Total</span>
              <strong>
                R\$ {Number(valorTotal).toFixed(2).replace(".", ",")}
              </strong>
            </div>

            <button
              type="button"
              className={styles.finalizar}
              disabled={itens.length === 0}
            >
              Concluir minha compra
            </button>

            <div className={styles.cupom}>
              <span className={styles.sub}>Cupom</span>
              <input type="text" placeholder="Código do cupom" />
              <button type="button">Aplicar cupom</button>
            </div>

            <Link to="/loja" className={styles.continuar}>
              <FiArrowLeft />
              Continuar comprando
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
