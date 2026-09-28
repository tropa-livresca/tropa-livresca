import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import styles from "./CardProduto.module.css";

export default function CardProduto({ livro, aoAdicionar }) {
  const livroId = livro.id || livro.ISBN;
  const nomeAutor =
    livro.autor ||
    (livro.autor_nome
      ? `${livro.autor_nome} ${livro.autor_sobrenome || ""}`.trim()
      : "Autor Desconhecido");
  const precoFisico = livro.precoFisico ?? livro.preco_fisico;
  const precoDigital = livro.precoDigital ?? livro.preco_digital;
  const urlCapa =
    livro.capa?.frente || (typeof livro.capa === "string" ? livro.capa : null);

  const handleAdicionarCarrinho = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (aoAdicionar) {
      aoAdicionar({
        id: livroId,
        titulo: livro.titulo,
        autor: nomeAutor,
        capa: urlCapa,
        preco: precoDigital ?? precoFisico ?? 0,
      });
    }
  };

  return (
    <div className={styles.card}>
      <Link to={`/loja/livro/${livroId}`} className={styles.linkCapa}>
        {urlCapa ? (
          <div className={styles.capaContainer}>
            <img
              src={urlCapa}
              alt={`Capa de ${livro.titulo}`}
              className={styles.capa}
            />
            <span className={styles.tipolivroCapa}>Digital</span>
            <button
              type="button"
              className={styles.btnCarrinhoCapa}
              onClick={handleAdicionarCarrinho}
              title="Adicionar ao carrinho"
            >
              <FiShoppingCart />
            </button>
          </div>
        ) : (
          <div className={styles.semImagem}>
            <span>Sem imagem</span>
            <span className={styles.tipolivroCapa}>Digital</span>
            <button
              type="button"
              className={styles.btnCarrinhoCapa}
              onClick={handleAdicionarCarrinho}
              title="Adicionar ao carrinho"
            >
              <FiShoppingCart />
            </button>
          </div>
        )}
      </Link>

      <div className={styles.infoLivro}>
        <Link to={`/loja/livro/${livroId}`} className={styles.linkLivro}>
          <h3>{livro.titulo}</h3>
          <p className={styles.autor}>{nomeAutor}</p>
          <div className={styles.precos}>
            {precoDigital != null && (
              <span className={styles.numero2}>
                R$ {Number(precoDigital).toFixed(2)}
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}