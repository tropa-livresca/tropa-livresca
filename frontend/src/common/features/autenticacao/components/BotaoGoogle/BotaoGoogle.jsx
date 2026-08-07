import { useGoogle } from "../../hooks/useGoogle.js";
import styles from "./BotaoGoogle.module.css";

export default function BotaoGoogle() {
    const { iniciarLoginNativo, error, carregando } = useGoogle();

    return (
        <div className={styles.googleContainer}>
            <button 
                onClick={iniciarLoginNativo} 
                disabled={carregando}
                className={styles.botaoGoogleNativo}
            >
                {carregando ? "Carregando..." : "Entrar com o Google"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
