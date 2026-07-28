import styles from "./EsqueceuSenha.module.css";
import logo from "../../images/recuperacaodesenha.jpg";
import { Link } from "react-router-dom";

export default function EsqueceuSenha() {
  return (
    <main className={styles.container}>
      <img src={logo} alt="Tropa Livresca" className={styles.imagemFundo} />

      <div className={styles.corFundo}></div>

      <div className={styles.card}>
        <h1>Recuperação de Senha</h1>

        <p>
          Enviamos um link de recuperação de senha para o e-mail cadastrado.
        </p>

        <p>Verifique sua caixa de e-mail.</p>

        <button className={styles.botao}>Reenviar link</button>

        <Link to="/auth/Login" className={styles.voltar}>
          Voltar para a tela de Login
        </Link>
      </div>
    </main>
  );
}
