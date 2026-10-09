import styles from "./Carrinho.module.css";
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useCarrinho } from "../../hooks/useCarrinho";

import { useEffect, useState } from "react";

export default function Carrinho() {
  const navigate = useNavigate();

  const {
    limparCarrinho,
    valorSubtotal,
    valorTotal,
    calcularFrete,
    frete,
    itens,
    excluirItem,
    removerQuantidade,
    adicionarItem,
  } = useCarrinho();

  const [modDeEntrega, setModDeEntrega] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (itens.length != 0) {
      calcularFrete(itens);
    }
  }, [itens]);

  const handleConcluirCompra = () => {
    if (modDeEntrega == "" && frete != null) {
      setErro("selecione uma modalide de entrega");
    } else {
      if (modDeEntrega == "sedex") {
        navigate("/checkout/" + frete.precoSedex + "/sedex");
      } else if (modDeEntrega == "pac") {
        navigate("/checkout/" + frete.precoPac + "/pac");
      } else {
        navigate("/checkout/0/digital");
      }
    }
  };

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
              className={styles.listaProdutos2}
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <p>Seu carrinho está vazio no momento.</p>
              <Link
                to="/loja"
                className={styles.continuar2}
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
                            Formato:{" "}
                            <strong>
                              {item.tipo === "fisico" ? "Físico" : "E-book"}
                            </strong>
                          </small>
                        )}
                      </div>
                    </div>

                    <strong className={styles.preco}>
                      R$ {Number(item.preco).toFixed(2).replace(".", ",")}
                    </strong>

                    {item.tipo == "fisico" ? (
                      <div className={styles.quantidade}>
                        <div className={styles.redondo}>
                          <button
                            type="button"
                            onClick={() =>
                              removerQuantidade(item.id, item.tipo)
                            }
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
                    ) : (
                      <></>
                    )}

                    <strong className={styles.totalProduto}>
                      R$ {totalItem.toFixed(2).replace(".", ",")}
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

              <div className={styles.lim}>
                <button
                  type="button"
                  onClick={limparCarrinho}
                  className={styles.limpar}
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
                R$ {Number(valorSubtotal).toFixed(2).replace(".", ",")}
              </strong>
            </div>

            <div className={styles.cep}>
              <span className={styles.sub}>Frete</span>
              {frete != null ? (
                <>
                  <div>
                    <input
                      type="radio"
                      value="sedex"
                      name="madalidade"
                      checked={modDeEntrega == "sedex"}
                      onChange={(e) =>
                        setModDeEntrega(e.target.checked ? "sedex" : "")
                      }
                    ></input>
                    <h5>Sedex</h5>
                    <strong>
                      Preço base Pac R${" "}
                      {Number(frete.precoSedex).toFixed(2).replace(".", ",")}
                    </strong>
                  </div>

                  <div>
                    <input
                      type="radio"
                      value="pac"
                      name="madalidade"
                      checked={modDeEntrega == "pac"}
                      onChange={(e) =>
                        setModDeEntrega(e.target.checked ? "pac" : "")
                      }
                    ></input>
                    <h5>Pac</h5>
                    <strong>
                      Preço base Sedex R${" "}
                      {Number(frete.precoPac).toFixed(2).replace(".", ",")}
                    </strong>
                  </div>
                </>
              ) : (
                <div>livro digital</div>
              )}
            </div>

            <div className={styles.Total}>
              <span className={styles.sub}>Total</span>
              <strong>
                R${" "}
                {modDeEntrega == "sedex"
                  ? Number(valorTotal + frete.precoSedex)
                      .toFixed(2)
                      .replace(".", ",")
                  : modDeEntrega == "pac"
                    ? Number(valorTotal + frete.precoPac)
                        .toFixed(2)
                        .replace(".", ",")
                    : Number(valorTotal).toFixed(2).replace(".", ",")}
              </strong>
            </div>

            <button
              type="button"
              className={styles.finalizar}
              disabled={itens.length === 0}
              onClick={handleConcluirCompra}
            >
              Concluir minha compra
            </button>

            <h5>{erro}</h5>

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
