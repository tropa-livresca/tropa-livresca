import { Link } from "react-router-dom";
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

  return (
    <Link to={`/loja/livro/${livroId}`} className={styles.card}>
      {urlCapa ? (
        <img src={urlCapa} alt={`Capa de ${livro.titulo}`} />
      ) : (
        <div className={styles.semImagem}>Sem imagem</div>
      )}
      <div>
        <span
          className={livro.origem === "tropa" ? styles.tropa : styles.externo}
        >
          {livro.origem === "tropa" ? "Publicado na Tropa" : "Catálogo externo"}
        </span>
        <h2>{livro.titulo}</h2>
        <p>{nomeAutor}</p>

        <div className={styles.precos}>
          {precoDigital != null && (
            <span>
              Digital: <strong>R\$ {Number(precoDigital).toFixed(2)}</strong>
            </span>
          )}
          {precoFisico != null && (
            <span>
              Físico: <strong>R\$ {Number(precoFisico).toFixed(2)}</strong>
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            aoAdicionar({
              id: livroId,
              titulo: livro.titulo,
              autor: nomeAutor,
              capa: urlCapa,
              preco: precoFisico ?? precoDigital ?? 0,
            });
          }}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </Link>
  );
}
