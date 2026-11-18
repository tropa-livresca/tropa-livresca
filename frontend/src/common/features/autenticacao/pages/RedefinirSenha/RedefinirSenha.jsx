import styles from "./RedefinirSenha.module.css";
import { useRedefinirSenha } from "../../hooks/useRedefinirSenha";

export default function RedefinirSenha() {
  const {
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    carregando,
    error,
    sucesso,
    enviarRedefinirSenha,
  } = useRedefinirSenha();

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <form onSubmit={enviarRedefinirSenha}>
          <h1>Redefinir Senha</h1>

          <p>
            Digite e confirme sua nova senha abaixo para atualizar sua conta.
          </p>

          <div className={styles.inputGroup}>
            <label htmlFor="novaSenha">Nova Senha</label>
            <input
              type="password"
              name="novaSenha"
              id="novaSenha"
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              disabled={carregando}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
            <input
              type="password"
              name="confirmarSenha"
              id="confirmarSenha"
              placeholder="Repita a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              disabled={carregando}
              required
            />
          </div>

          {error && <div className={styles.erroMensagem}>{error}</div>}

          {sucesso && <div className={styles.sucessoMensagem}>{sucesso}</div>}

          <button
            type="submit"
            className={styles.botaoEnviar}
            disabled={carregando}
          >
            {carregando ? "Atualizando..." : "Redefinir Senha"}
          </button>
        </form>
      </section>
    </main>
  );
}
