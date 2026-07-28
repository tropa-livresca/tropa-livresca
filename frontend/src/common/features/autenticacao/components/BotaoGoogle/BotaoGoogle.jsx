import { GoogleLogin } from "@react-oauth/google";
import { useGoogle } from "../hooks/useGoogle.js";
import styles from "./BotaoGoogle.module.css";

export default function BotaoGoogle() {
    const { LoginGoogle, error, carregando } = useGoogle();

    if (carregando) return <p>Autenticando sua conta...</p>;

    return (
        <div className={styles.googleContainer}>
            <GoogleLogin
                onSuccess={LoginGoogle}
                onError={() => console.log("Erro no login padrão")}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
