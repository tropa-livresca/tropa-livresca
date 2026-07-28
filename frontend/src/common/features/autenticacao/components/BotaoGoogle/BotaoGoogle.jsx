import { GoogleLogin } from "@react-oauth/google";
import { useGoogle } from "../../../../hooks/useGoogle";
import { FaGoogle } from "react-icons/fa";
import styles from "./BotaoGoogle.module.css";

export default function BotaoGoogle() {
    const { LoginGoogle, error, carregando } = useGoogle();

    if (carregando) return <p>Autenticando sua conta...</p>;

    return (
        <div className={styles.google}>
            <GoogleLogin
                onSuccess={LoginGoogle}
                onError={() => console.log({ error })}
            />
                <FaGoogle />
                Entrar com Google
        </div>
    );
}
