import styles from "./Carrinho.module.css";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Carrinho() {
  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Carrinho</h1>
        <p>Confira seus livros e finalize seu pedido.</p>
      </div>

      <div className={styles.container}>
        {/*
        <div className={styles.carrinhoVazio}>
          <FiShoppingBag className={styles.iconeVazio} />

          <h2>Seu carrinho está vazio</h2>

          <p>Você ainda não adicionou nenhum livro ao seu carrinho.</p>

          <Link to="/loja" className={styles.botaoLivros}>
            Ver livros na loja
          </Link>
        </div>
        */}

        <div className={styles.conteudo}>
          <section className={styles.listaProdutos}>
            <div className={styles.cabecalhoProdutos}>
              <span>Produto</span>
              <span>Preço</span>
              <span>Quantidade</span>
              <span>Total</span>
              <span></span>
            </div>

            <div className={styles.produto}>
              <div className={styles.produtoInfo}>
                <Link to="/" className={styles.capa}>
                  <img
                    src="https://covers.openlibrary.org/b/isbn/9788506055106-L.jpg"
                    alt="O Menino Maluquinho"
                  />
                </Link>

                {/* <div className={styles.semfoto}>sem foto</div>*/}

                <div className={styles.desc}>
                  <Link to="/" className={styles.nome}>
                    O Menino Maluquinho
                  </Link>

                  <p className={styles.autor}>Ziraldo</p>
                </div>
              </div>

              <strong className={styles.preco}>R$ 29,90</strong>

              <div className={styles.quantidade}>
                <div className={styles.redondo}>
                  <button type="button">
                    <FiMinus />
                  </button>

                  <span>1</span>

                  <button type="button">
                    <FiPlus />
                  </button>
                </div>
              </div>

              <strong className={styles.totalProduto}>R$ 29,90</strong>

              <button type="button" className={styles.excluir}>
                <FiTrash2 />
              </button>
            </div>
          </section>

          <aside className={styles.resumo}>
            <h2>Resumo</h2>

            <div className={styles.subtotal}>
              <span className={styles.sub}>Subtotal</span>
              <strong>R$ 119,70</strong>
            </div>

            <div className={styles.cep}>
              <span className={styles.sub}>CEP</span>
              <input type="text" placeholder="CEP" />
            </div>

            <div className={styles.Total}>
              <span className={styles.sub}>Total</span>
              <strong>R$ 119,70</strong>
            </div>

            <button type="button" className={styles.finalizar}>
              Concluir minha compra
            </button>

            <div className={styles.cupom}>
              <span className={styles.sub}>Cupom</span>
              <input type="text" placeholder="Código do cupom" />

              <button type="button">Aplicar cupom</button>
            </div>

            <Link to="/livros" className={styles.continuar}>
              <FiArrowLeft />
              Continuar comprando
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
