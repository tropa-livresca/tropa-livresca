import { BrowserRouter, Routes, Route } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import Container from "../components/layout/Container/Container";
import MainLayout from "../components/layout/MainLayout/MainLayout";

import Inicio from "../pages/Public/Inicio/Inicio";
import Cadastro from "../pages/Auth/Cadastro/Cadastro";
import Login from "../pages/Auth/Login/Login";
import ConfirmacaoEmail from "../pages/Auth/ConfirmacaoEmail/ConfirmacaoEmail";

import Historia from "../pages/Public/Historia/Historia";

import Meus_livros from "../pages/Public/Autores/MeusLivros";

//Se Autopublique
import NovoLivro from "../pages/Private/NovoLivro/NovoLivro";
import Confirmacao from "../pages/Private/NovoLivro/Confirmacao/Confirmacao";
import Conteudo from "../pages/Private/NovoLivro/Conteudo/Conteudo";
import Detalhes from "../pages/Private/NovoLivro/Detalhes/Detalhes";
import Formato from "../pages/Private/NovoLivro/Formato/Formato";
import Orcamento from "../pages/Private/NovoLivro/Orcamento/Orcamento";
import SeAutopublique from "../pages/Public/SeAutopublique/SeAutopublique";

/**
 * Componente de Rota Privada
 * Verifica se o usuário está autenticado antes de renderizar o componente solicitado
 *
 * @param {object} props
 * @param {React.ComponentType} props.Item - O componente que deve ser renderizado se autenticado
 * @returns {JSX.Element}
 */
const Private = ({  Item }) => {
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

          {/*
          <Route path = "sobre" element = {<SobreNos/>}>
            <Route index element = ""/>
          <Route/>
           */}
          <Route path="historia" element={<Historia />} />

          <Route path="meus_livros" element={<Meus_livros/>}/>

          <Route path="seautopublique" element={<SeAutopublique />}>
            <Route index element={<SeAutopublique />} />
            <Route path="confirmacao" element={<Private Item ={Confirmacao} />} />
            <Route path="detalhes" element={<Private Item ={Detalhes} />} />
            <Route path="formato" element={<Private Item = {Formato} />} />
            <Route path="orcamento" element={<Private Item = {Orcamento} />} />
            <Route path="conteudo" element={<Private Item ={Conteudo} />} />
          </Route>
        </Route>

        {/* Rotas de Autenticação */}
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="login" element={<Login />} />
        <Route path="confirmacao-email" element={<ConfirmacaoEmail />} /> 

        {/* Exemplo de como usar a rota privada no futuro:
            <Route path="/perfil" element={<Private Item={Perfil} />} /> 
        */}
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
