import { Routes, Route } from "react-router-dom";
import Login from "../autenticacao/pages/Login/Login";
import Cadastro from "../autenticacao/pages/Cadastro/Cadastro";

export default function RoutesAutenticacao() {
    return (
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="cadastro" element={<Cadastro />} />
            </Routes>
    );
}
