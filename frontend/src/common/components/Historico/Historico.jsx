import { useNavigate } from "react-router-dom";

export default function Historico() {
    const navigate = useNavigate();

    return (
        <>
        <button onClick = {()=>{navigate(-1)}}>Voltar</button>
        <button onClick = {()=>{navigate(+1)}}>Voltar</button>
        </>
    );
}