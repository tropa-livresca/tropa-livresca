import { BrowserRouter, Routes, Route } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import usePerfil from "../hooks/usePerfil";

import Container from "../components/layout/Container/Container";
import MainLayout from "../components/layout/MainLayout/MainLayout";

import Inicio from "../pages/Public/Inicio/Inicio";
import Cadastro from "../pages/Auth/Cadastro/Cadastro";
import Login from "../pages/Auth/Login/Login";
import ConfirmacaoEmail from "../pages/Auth/ConfirmacaoEmail/ConfirmacaoEmail";

import Perfil from "../pages/Private/Perfil/Perfil";

import Historia from "../pages/Public/Historia/Historia";
import Autores from "../pages/Public/Autores/Autores";

import MeusLivros from "../pages/Public/Autores/MeusLivros";

//Se Autopublique
import NovoLivro from "../pages/Private/NovoLivro/NovoLivro/NovoLivro";
import Confirmacao from "../pages/Private/NovoLivro/Confirmacao/Confirmacao";
import Conteudo from "../pages/Private/NovoLivro/Conteudo/Conteudo";
import Detalhes from "../pages/Private/NovoLivro/Detalhes/Detalhes";
import Formato from "../pages/Private/NovoLivro/Formato/Formato";
import Orcamento from "../pages/Private/NovoLivro/Orcamento/Orcamento";
import SeAutopublique from "../pages/Public/SeAutopublique/SeAutopublique";

const Private = ({  Item }) => {
  const { signed } = useAuth();

  return signed ? <Item /> : <Login />;
};

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />

          <Route path="historia" element={<Historia />} />
<<<<<<< HEAD

          <Route path="meuslivros" element={<MeusLivros/>}/>

=======
          <Route path="autores" element={<Autores />} />
          
>>>>>>> 3ec3dd498a210711102d21269fdc370ebf7b457e
          <Route path="seautopublique" element={<SeAutopublique />}>
            <Route index element={<SeAutopublique />} />
            <Route path="confirmacao" element={<Private Item ={Confirmacao} />} />
            <Route path="detalhes" element={<Private Item ={Detalhes} />} />
            <Route path="formato" element={<Private Item = {Formato} />} />
            <Route path="orcamento" element={<Private Item = {Orcamento} />} />
            <Route path="conteudo" element={<Private Item ={Conteudo} />} />
          </Route>

                  <Route path = "/perfil" element = {<Private Item = {Perfil}/>}/>
      
        </Route>

        {/* Rotas de Autenticação */}
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="login" element={<Login />} />
        <Route path="confirmacao-email" element={<ConfirmacaoEmail />} /> 

      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
