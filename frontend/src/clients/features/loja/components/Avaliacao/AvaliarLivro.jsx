import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Avaliacao.module.css";
import useAuth from "../../../../../common/hooks/useAuth";

const ROTULOS = ["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"];

export default function AvaliarLivro({
  livroId,
  minhaAvaliacao,
  podeAvaliar,
  salvando,
  erro,
  buscarMinhaAvaliacao,
  avaliar,
  onAvaliado,
}) {
  const { signed } = useAuth();
  const [destaque, setDestaque] = useState(0);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (signed) buscarMinhaAvaliacao(livroId);
  }, [signed, livroId, buscarMinhaAvaliacao]);

  const notaAtual = minhaAvaliacao?.qtd_estrelas || 0;
  const notaExibida = destaque || notaAtual;

  const handleAvaliar = async (estrelas) => {
    setSalvo(false);
    const ok = await avaliar(livroId, estrelas);
    if (ok) {
      setSalvo(true);
      onAvaliado?.();
    }
  };

  if (!signed) {
    return (
      <p className={styles.aviso}>
        <Link to="/auth/login">Entre na sua conta</Link> para avaliar este
        livro.
      </p>
    );
  }

  if (!podeAvaliar) {
    return (
      <p className={styles.aviso}>
        Compre este livro para poder avaliá-lo.
      </p>
    );
  }

  return (
    <div className={styles.avaliar}>
      <p className={styles.pergunta}>
        {notaAtual ? "Sua avaliação" : "O que você achou deste livro?"}
      </p>

      <div
        className={styles.seletor}
        onMouseLeave={() => setDestaque(0)}
        role="radiogroup"
        aria-label="Nota de 1 a 5 estrelas"
      >
        {[1, 2, 3, 4, 5].map((estrela) => (
          <button
            key={estrela}
            type="button"
            role="radio"
            aria-checked={notaAtual === estrela}
            aria-label={`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`}
            className={`${styles.estrela} ${estrela <= notaExibida ? styles.estrelaAtiva : ""}`}
            onMouseEnter={() => setDestaque(estrela)}
            onClick={() => handleAvaliar(estrela)}
            disabled={salvando}
          >
            ★
          </button>
        ))}
        <span className={styles.rotulo}>{ROTULOS[notaExibida]}</span>
      </div>

      {salvo && !erro && (
        <p className={styles.sucesso}>Obrigado pela sua avaliação!</p>
      )}
      {erro && <p className={styles.erro}>{erro}</p>}
    </div>
  );
}
