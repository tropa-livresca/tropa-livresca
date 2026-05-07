import { supabase } from "../lib/supabaseClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio/Inicio";
import Container from "../components/layout/Container/Container";
import Cadastro from "../pages/Cadastro/Cadastro";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import Login from "../pages/Login/Login";
import useAuth from "../hooks/useAuth";
import ConfirmacaoEmail from "../pages/ConfirmacaoEmail/ConfirmacaoEmail";

/**
 * Componente de Rota Privada
 * Verifica se o usuário está autenticado antes de renderizar o componente solicitado
 * 
 * @param {object} props
 * @param {React.ComponentType} props.Item - O componente que deve ser renderizado se autenticado
 * @returns {JSX.Element}
 */
const Private = ({ Item }) => {
  const { signed } = useAuth();

  return signed ? <Item /> : <Login />;
};

/**
 * Gerenciador de Rotas Principal da Aplicação.
 * Define a estrutura de navegação, layouts e proteções de rota.
 * 
 * @component
 * @returns {JSX.Element}
 */
const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas com Layout Principal (Navbar, Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
        </Route>

        {/* Rotas de Autenticação */}
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />  
        <Route path="/confirmacaoemail" element={<ConfirmacaoEmail />} />
        
        {/* Exemplo de como usar a rota privada no futuro:
            <Route path="/perfil" element={<Private Item={Perfil} />} /> 
        */}
        
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
