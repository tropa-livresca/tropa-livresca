import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom"; // Importado o Outlet
import { LivroProvider } from "../context/livro/Livros";
import useAuth from "../hooks/useAuth";
import Suporte from "../pages/Public/Suporte/Suporte";
import Container from "../components/layout/Container/Container";
import MainLayout from "../components/layout/MainLayout/MainLayout";

import Inicio from "../pages/Public/Inicio/Inicio";
import Cadastro from "../pages/Auth/Cadastro/Cadastro";
import Login from "../pages/Auth/Login/Login";
import ConfirmacaoEmail from "../pages/Auth/ConfirmacaoEmail/ConfirmacaoEmail";

import Perfil from "../pages/Private/Perfil/Perfil";

import FAQ from "../pages/Public/FAQ/FAQ";

import Historia from "../pages/Public/Historia/Historia";
import Autores from "../pages/Public/Autores/Autores";
import AutorById from "../pages/Public/AutorById/AutorById";
import MeusLivros from "../pages/Private/MeusLivros/MeusLivros";

import Livros from "../pages/Public/Livros/Livros";
//Se Autopublique
import Confirmacao from "../pages/Private/NovoLivro/Confirmacao/Confirmacao";
import Conteudo from "../pages/Private/NovoLivro/Conteudo/Conteudo";
import Detalhes from "../pages/Private/NovoLivro/Detalhes/Detalhes";
import Formato from "../pages/Private/NovoLivro/Formato/Formato";
import Orcamento from "../pages/Private/NovoLivro/Orcamento/Orcamento";
import SeAutopublique from "../pages/Public/SeAutopublique/SeAutopublique";
import LivroById from "../pages/Public/LivroById/LivroById";

const Private = ({ Item }) => {
  const { signed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return signed ? <Item /> : <Navigate to="/login" state={{ from: location }} replace />;
};

const RoutesApp = () => {
  return (
    <LivroProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Rota Raiz Correta */}
          <Route path="/" element={<Inicio />} />
          <Route path="historia" element={<Historia />} />
          <Route path="autores" element={<Autores />} />
          <Route path="autores/:id" element={<AutorById />} />
          
          <Route path="FAQ" element = {<FAQ/>}/>
          <Route path= "suporte" element = {<Suporte/>}/>

          <Route path="meuslivros" element={<Private Item={MeusLivros} />} />

          <Route path="seautopublique" element={<Outlet />}>
            <Route index element={<SeAutopublique />} />
            <Route path="confirmacao" element={<Private Item={Confirmacao} />} />
            <Route path="detalhes" element={<Private Item={Detalhes} />} />
            <Route path="formato" element={<Private Item={Formato} />} />
            <Route path="orcamento" element={<Private Item={Orcamento} />} />
            <Route path="conteudo" element={<Private Item={Conteudo} />} />
          </Route>

          <Route path="livros" element={<Livros />} />
          <Route path= "livros/:id" element = {<LivroById/>}/>
          <Route path="perfil" element={<Private Item={Perfil} />} />
        </Route>

        <Route path="cadastro" element={<Cadastro />} />
        <Route path="login" element={<Login />} />
        <Route path="confirmacao-email" element={<ConfirmacaoEmail />} />
      </Routes>
    </BrowserRouter>
    </LivroProvider>
  );
};

export default RoutesApp;
