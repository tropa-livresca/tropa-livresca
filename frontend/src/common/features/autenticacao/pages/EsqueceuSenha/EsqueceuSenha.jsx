import styles from "./EsqueceuSenha.module.css";
import logo from "../../../../images/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { useEsqueceuSenha } from "../../hooks/useEsqueceuSenha";

export default function EsqueceuSenha() {
  const navigate = useNavigate();

  const { email, setEmail, error, sucesso, carregando, enviarRecuperarSenha } =
    useEsqueceuSenha();

  return (
    <main className={styles.container}>
      <img src={logo} alt="Tropa Livresca" className={styles.imagemFundo} />
      <div className={styles.corFundo}></div>
      <div className={styles.card}>
        <p>
          Enviamos um link de recuperação de senha para o e-mail cadastrado.
        </p>

        <p>Verifique sua caixa de e-mail.</p>

        <div>
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className={styles.botao}
          >
            <IoChevronBack /> Voltar
          </button>

          <form onSubmit={enviarRecuperarSenha} method="POST">
            <h1>Recuperação de Senha</h1>
            <p>Insira seu e-mail para receber o link de redefinição</p>

            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Digite o e-mail cadastrado"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            <div>
              {error && <span>{error}</span>}
              {sucesso && <span>{sucesso}</span>}
            </div>

            <p>
              Lembrou a senha?{" "}
              <Link to="/auth/login">Voltar para a tela de Login</Link>
            </p>

            <button
              type="submit"
              disabled={carregando}
              className={styles.voltar}
            >
              {carregando ? "ENVIANDO..." : "ENVIAR LINK"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
