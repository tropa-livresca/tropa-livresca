import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AbasLivro.module.css";
import ResumoAvaliacao from "../Avaliacao/ResumoAvaliacao";
import AvaliarLivro from "../Avaliacao/AvaliarLivro";

const ABAS = [
  ["sinopse", "Sinopse"],
  ["autor", "Sobre o autor"],
  ["avaliacoes", "Avaliações"],
];

// Abas da página de um livro. Recebe o objeto do useAvaliacoes da página
// para que o resumo do topo também se atualize depois de avaliar.
export default function AbasLivro({ livroId, descricao, autor, avaliacoes }) {
  const [aba, setAba] = useState("sinopse");
  const { resumo, buscarResumo } = avaliacoes;

  return (
    <>
      <div className={styles.tabs} role="tablist">
        {ABAS.map(([chave, rotulo]) => (
          <button
            key={chave}
            type="button"
            role="tab"
            aria-selected={aba === chave}
            className={aba === chave ? styles.tabAtiva : ""}
            onClick={() => setAba(chave)}
          >
            {rotulo}
            {chave === "avaliacoes" && (
              <span className={styles.numero}> ({resumo.total})</span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.conteudo}>
        {aba === "sinopse" && <p>{descricao || "Sinopse não informada."}</p>}

        {aba === "autor" && (
          <>
            <p>
              {autor?.descricao ||
                `${autor?.nome || "O autor"} ainda não escreveu uma apresentação.`}
            </p>
            {autor?.id && (
              <Link to={`/autores/${autor.id}`} className={styles.linkAutor}>
                Ver perfil completo do autor
              </Link>
            )}
          </>
        )}

        {aba === "avaliacoes" && (
          <div className={styles.abaAvaliacoes}>
            <ResumoAvaliacao media={resumo.media} total={resumo.total} />
            <AvaliarLivro
              livroId={livroId}
              {...avaliacoes}
              onAvaliado={() => buscarResumo(livroId)}
            />
          </div>
        )}
      </div>
    </>
  );
}
