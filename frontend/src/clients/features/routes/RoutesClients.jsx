import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "../../context/Auth"; 
import useAuth from "../../hooks/useAuth";
import MainLayout from "../../components/MainLayout/MainLayout";

import Inicio from "../institucional/pages/Inicio/Inicio";
import Cadastro from "../autenticacao/pages/Cadastro/Cadastro";
import Login from "../autenticacao/pages/Login/Login";
import ConfirmacaoEmail from "../autenticacao/components/ConfirmacaoForm";

import Perfil from "../perfil/pages/Perfil/Perfil";

import FAQ from "../suporte/pages/FAQ/FAQ";
import Historia from "../institucional/pages/Historia/Historia";
import Autores from "../autores/pages/Autores/Autores";
import AutorById from "../autores/pages/AutorById/AutorById";
import MeusLivros from "../autopublicacao/pages/MeusLivros/MeusLivros";

import Livros from "../livros/pages/Livros/Livros";
import NovoLivro from "../autopublicacao/pages/NovoLivro/NovoLivro";
import LivroById from "../livros/pages/LivroById/LivroById";
import Suporte from "../suporte/pages/Suporte/Suporte";

const Private = ({ Item }) => {
  const { signed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return signed ? (
    <Item />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const RoutesClients = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="historia" element={<Historia />} />
          <Route path="autores" element={<Autores />} />
          <Route path="autores/:id" element={<AutorById />} />

          <Route path="FAQ" element={<FAQ />} />
          <Route path="suporte" element={<Suporte />} />

          <Route path="meuslivros" element={<Private Item={MeusLivros} />} />

          <Route path="livros" element={<Livros />} />
          <Route path="livros/:id" element={<LivroById />} />
          
          <Route path="perfil" element={<Private Item={Perfil} />} />

          <Route path="novo-livro" element={<Private Item={NovoLivro} />} />

        </Route>

        <Route path="cadastro" element={<Cadastro />} />
        <Route path="login" element={<Login />} />
        <Route path="confirmacao-email" element={<ConfirmacaoEmail />} />
      </Routes>
    </AuthProvider>
  );
};

export default RoutesClients;


















