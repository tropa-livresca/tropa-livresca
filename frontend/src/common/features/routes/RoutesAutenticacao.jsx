import { Routes, Route } from "react-router-dom";
import Login from "../autenticacao/pages/Login/Login";
import Cadastro from "../autenticacao/pages/Cadastro/Cadastro";
import EsqueceuSenha from "../autenticacao/pages/EsqueceuSenha/EsqueceuSenha";

export default function RoutesAutenticacao() {
    return (
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="cadastro" element={<Cadastro />} />
                <Route path="esqueceusenha" element={<EsqueceuSenha />} />
            </Routes>
    );
}
