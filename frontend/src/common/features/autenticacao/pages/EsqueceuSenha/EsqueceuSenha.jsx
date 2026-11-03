import styles from "./EsqueceuSenha.module.css";
import { useNavigate, Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { useEsqueceuSenha } from "../../hooks/useEsqueceuSenha";

export default function EsqueceuSenha() {
  const navigate = useNavigate();
  const { email, setEmail, error, sucesso, carregando, enviarRecuperarSenha } =
    useEsqueceuSenha();

  return (
    <main className={styles.container}>
      <div className={styles.corFundo}></div>

      <div className={styles.card}>
        

        {sucesso ? (
          <div className={styles.sucessoContainer}>
            <h2>E-mail Enviado!</h2>
            <p>{sucesso}</p>
            <p>Verifique sua caixa de entrada e a pasta de spam.</p>
            <Link to="/auth/login" className={styles.botao}>
              Ir para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={enviarRecuperarSenha}>
            <h1>Recuperação de Senha</h1>
            <p>Insira seu e-mail para receber o link de redefinição</p>

            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Digite o e-mail cadastrado"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={carregando}
                required
              />
            </div>

            {error && <span className={styles.erroMensagem}>{error}</span>}

            <button
              type="submit"
              disabled={carregando}
              className={styles.botaoEnviar}
            >
              {carregando ? "Enviando..." : "Enviar link"}
            </button>

            <p className={styles.textoLembrou}>
              Lembrou a senha?{" "}
              <Link to="/auth/login">Voltar para a tela de Login</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
