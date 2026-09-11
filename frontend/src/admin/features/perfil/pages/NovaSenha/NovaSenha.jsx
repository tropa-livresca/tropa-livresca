import {useNovaSenha} from "../../hooks/useNovaSenha.js";
import {useState} from "react";

import Popup from "../../../../components/PopUp/Popup";
import {usePopup} from "../../../../components/PopUp/usePopup.js";

import {FaEye, FaEyeSlash} from "react-icons/fa";

export default function NovaSenha(){
    const {
        novaSenha,
        confirmarSenha,
        setNovaSenha,
        setConfirmarSenha,
        criarNovaSenha,
        erro
    } = useNovaSenha();

    const {popup, fecharPopup} = usePopup();

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    return (
    <main>
        <p>Antes de seguir, precisamos que se faça a criação de uma nova senha.</p>

        <form onSubmit = {criarNovaSenha}>
            <label>Nova Senha:
                <input
                type = {mostrarSenha ? "text" : "password"}
                name = "novaSenha"
                placeholder = "Digite a nova senha"
                value = {novaSenha}
                onChange = {(e)=>{setNovaSenha(e.target.value)}}
                />
            </label>
            
            <button 
            type = "button"
            onClick = {()=>{ setMostrarSenha(!mostrarSenha);}}>
                {mostrarSenha ? <FaEyeSlash/> : <FaEye/>}
            </button>

            <label>
                Confirmar Senha:
                <input
                type = {mostrarConfirmarSenha ? "text" : "password"}
                name = "confirmarSenha"
                placeholder = "Confirme a nova senha"
                value = {confirmarSenha}
                onChange = {(e)=>{ setConfirmarSenha(e.target.value)}}/>
            </label>

            <button
            type = "button"
            onClick = {()=>{setMostrarConfirmarSenha(!mostrarConfirmarSenha)}}>
                {mostrarConfirmarSenha ? <FaEyeSlash/> : <FaEye/>}
            </button>

            {erro && (
                <p>{erro}</p>
            )}

            <button type = "submit">Alterar Senha</button>
        </form>

        {popup && (
            <Popup 
            tipo = {popup.tipo}
            mensagem = {popup.mensagem}
            fechar = {fecharPopup}
            />
)}
    </main>
    
)

}