import { useState } from "react";
import styles from "./Pagamento.module.css";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";
import { Link } from "react-router-dom";

export default function Pagamento() {
  const [formaPagamento, setFormaPagamento] = useState("");

  return (
    <main>
      <DescricaoTela
        titulo="Finalizar compra"
        descricao="Confira seus produtos, escolha o endereço, o frete e a forma de pagamento."
      />

      <div className={styles.container}>
        <section className={styles.produtos}>
          <div className={styles.tituloSecao}>
            <span>Produtos da compra</span>
          </div>

          <div className={styles.cabecalhoProdutos}>
            <span>Produto</span>
            <span>Preço</span>
            <span>Quantidade</span>
            <span>Total</span>
          </div>

          <div className={styles.itemProduto}>
            <div className={styles.produto}>
              <div className={styles.capa}>
                <span>Livro</span>
              </div>

              <div className={styles.infoProduto}>
                <strong>Nome do Produto</strong>
                <span>Nome do Autor</span>
              </div>
            </div>

            <span className={styles.numero}>R$ 10,00</span>
            <span className={styles.quantidade}>1</span>
            <span className={styles.numero}>R$ 10,00</span>
          </div>

          <div className={styles.itemProduto}>
            <div className={styles.produto}>
              <div className={styles.capa}>
                <span>Livro</span>
              </div>

              <div className={styles.infoProduto}>
                <strong>Nome do Produto</strong>
                <span>Nome do Autor</span>
              </div>
            </div>

            <span className={styles.numero}>R$ 10,00</span>
            <span className={styles.quantidade}>1</span>
            <span className={styles.numero}>R$ 10,00</span>
          </div>
        </section>

        <div className={styles.checkout}>
          <div className={styles.colunaEsquerda}>
            <section className={styles.card}>
              <div className={styles.tituloCard}>
                <div>
                  <strong>Endereço de entrega</strong>
                  <span>
                    Escolha o endereço onde deseja receber seu pedido.
                  </span>
                </div>

                <Link to="/" className={styles.button}>+ Novo endereço</Link>
              </div>

              <div className={styles.listaEnderecos}>
                <label className={styles.endereco}>
                  <input type="radio" name="endereco" />

                  <div className={styles.dadosEndereco}>
                    <strong>Endereço Principal</strong>
                    <span>Avenida Governador Mario Covas, <span className={styles.numero}>188</span></span>
                    <span>Loteamento Jardim dos Ipês</span>
                    <span>São Paulo - SP</span>
                    <span>CEP: <span className={styles.numero}>01234-567</span></span>
                  </div>
                </label>

                <label className={styles.endereco}>
                  <input type="radio" name="endereco" />

                  <div className={styles.dadosEndereco}>
                    <strong>Endereço Secundário</strong>
                    <span>Rua das Flores, <span className={styles.numero}>500</span></span>
                    <span>DVD BALLS</span>
                    <span>São Paulo - SP</span>
                    <span>CEP: <span className={styles.numero}>01235-678</span></span>
                  </div>
                </label>

                <label className={styles.endereco}>
                  <input type="radio" name="endereco" />

                  <div className={styles.dadosEndereco}>
                    <strong>Endereço de Trabalho</strong>
                    <span>DAVID BALLS, <span className={styles.numero}>500</span></span>
                    <span>Centro</span>
                    <span>São Paulo - SP</span>
                    <span>CEP: <span className={styles.numero}>18741-000</span></span>
                  </div>
                </label>

              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.tituloCard}>
                <div>
                  <strong>Forma de envio</strong>
                  <span>Escolha como deseja receber seu pedido.</span>
                </div>
              </div>

              <div className={styles.opcoesFrete}>
                <label className={styles.frete}>
                  <input type="radio" name="frete" />

                  <div>
                    <strong>Normal</strong>
                    <span><span className={styles.numero}>5</span> a <span className={styles.numero}>12</span> dias úteis</span>
                  </div>

                  <strong className={styles.numero}>R$ 10,00</strong>
                </label>

                <label className={styles.frete}>
                  <input type="radio" name="frete" />

                  <div>
                    <strong>PAC</strong>
                    <span><span className={styles.numero}>3</span> a <span className={styles.numero}>7</span> dias úteis</span>
                  </div>

                  <strong className={styles.numero}>R$ 15,00</strong>
                </label>

                <label className={styles.frete}>
                  <input type="radio" name="frete" />

                  <div>
                    <strong>SEDEX</strong>
                    <span><span className={styles.numero}>1</span> a <span className={styles.numero}>3</span> dias úteis</span>
                  </div>

                  <strong className={styles.numero}>R$ 22,00</strong>
                </label>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.tituloCard}>
                <div>
                  <strong>Observação para o vendedor</strong>
                  <span>Alguma informação especial sobre seu pedido?</span>
                </div>
              </div>

              <textarea
                className={styles.textarea}
                placeholder="Escreva uma mensagem para o vendedor..."
                maxLength={500}
              />
            </section>
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
                <label
                  className={`${styles.formaPagamento} ${
                    formaPagamento === "cartao" ? styles.selecionado : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value="cartao"
                    checked={formaPagamento === "cartao"}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  />

                  <div>
                    <strong>Cartão</strong>
                    <span>Crédito ou débito</span>
                  </div>
                </label>

                <label
                  className={`${styles.formaPagamento} ${
                    formaPagamento === "pix" ? styles.selecionado : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value="pix"
                    checked={formaPagamento === "pix"}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  />

                  <div>
                    <strong>Pix</strong>
                    <span>Aprovação imediata</span>
                  </div>
                </label>

                <label
                  className={`${styles.formaPagamento} ${
                    formaPagamento === "boleto" ? styles.selecionado : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value="boleto"
                    checked={formaPagamento === "boleto"}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  />

                  <div>
                    <strong>Boleto</strong>
                    <span>Até <span className={styles.numero}>3</span> dias úteis</span>
                  </div>
                </label>
              </div>

              {formaPagamento === "cartao" && (
                <div className={styles.formPagamento}>
                  <div className={styles.formTitulo}>
                    <strong>Dados do cartão</strong>
                    <span>Informe os dados do cartão para pagamento.</span>
                  </div>

                  <label>
                    Número do cartão
                    <input type="text" className={styles.numero} placeholder="0000 0000 0000 0000" />
                  </label>

                  <label>
                    Nome no cartão
                    <input type="text" placeholder="Nome completo" />
                  </label>

                  <div className={styles.linhaCampos}>
                    <label>
                      Validade
                      <input type="text" placeholder="MM/AA" />
                    </label>

                    <label>
                      CVV
                      <input type="text" className={styles.numero} placeholder="123" />
                    </label>
                  </div>

                  <label>
                    Parcelamento
                    <select defaultValue="">
                      <option value="" disabled>
                        Selecione o parcelamento
                      </option>
                      <option value="1">1x de R$ 20,00 sem juros</option>
                      <option value="2">2x de R$ 10,00 sem juros</option>
                      <option value="3">3x de R$ 6,67 sem juros</option>
                    </select>
                  </label>
                </div>
              )}

              {formaPagamento === "pix" && (
                <div className={styles.pagamentoInfo}>
                  <strong>Pagamento via Pix</strong>

                  <span>
                    Após finalizar a compra, será gerado o código Pix para
                    realizar o pagamento.
                  </span>
                </div>
              )}

              {formaPagamento === "boleto" && (
                <div className={styles.pagamentoInfo}>
                  <strong>Pagamento via boleto</strong>

                  <span>
                    Após finalizar a compra, o boleto será gerado para
                    pagamento. A compensação pode levar até <span className={styles.numero}>3</span> dias úteis.
                  </span>
                </div>
              )}
            </section>

            <section className={styles.resumo}>
              <div className={styles.tituloResumo}>
                <strong>Resumo da compra</strong>
              </div>

              <div className={styles.valores}>
                <div>
                  <span>Subtotal</span>
                  <strong className={styles.numero}>R$ 20,00</strong>
                </div>

                <div>
                  <span>Frete</span>
                  <strong className={styles.numero}>R$ 10,00</strong>
                </div>

                <div className={styles.total}>
                  <span>Total</span>
                  <strong className={styles.numero}>R$ 30,00</strong>
                </div>
              </div>

              <button className={styles.botaoFinalizar} type="button">
                Finalizar compra
              </button>

              <span className={styles.seguro}>Compra segura e protegida</span>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
