import { Routes, Route } from "react-router-dom";
import Login from "../autenticacao/pages/Login/Login";
import Cadastro from "../autenticacao/pages/Cadastro/Cadastro";
import RedefinirSenha from "../autenticacao/pages/RedefinirSenha/RedefinirSenha";
import EsqueceuSenha from "../autenticacao/pages/EsqueceuSenha/EsqueceuSenha";

export default function RoutesAutenticacao() {
    return (
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="cadastro" element={<Cadastro />} />
                <Route path = "esqueceu-senha" element = {<EsqueceuSenha/>}/>
                <Route path = "redefinir-senha" element = {<RedefinirSenha/>}/>
            </Routes>
    );
}
