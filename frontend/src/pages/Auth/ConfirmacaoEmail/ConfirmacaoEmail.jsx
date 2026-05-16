import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { apiFetch } from "../../../services/api";
/**
 * Página de confirmação de email
 * 
 * @returns {JSX.Element}
 */
export default function ConfirmacaoEmail (){
    const [status, setStatus] = useState("Aguardando confirmação de e-mail...");
    const navigate = useNavigate();

    useEffect(() =>{
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const acessToken = params.get("acess_token");
        const refreshToken = params.get("refresh_token");

        if(acessToken && refreshToken){
         apiFetch("/api/auth/confirmacao-email", {
            method: "POST",
            body: JSON.stringify({ acessToken, refreshToken }),
        })
        .then(async (res) =>{
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.error || "Erro desconhecido");
            }

            setStatus("E-mail confirmado com sucesso! Redirecionando para página inicial...");
            setTimeout(()=> navigate("/"), 2000);
        } )
    }}, [navigate])
    return (<div>{status}</div>);
}