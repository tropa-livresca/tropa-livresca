import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "../../components/MainLayout/MainLayout";
import useAuth from "../../../common/hooks/useAuth";

import Inicio from "../institucional/pages/Inicio/Inicio";

import Perfil from "../perfil/pages/Perfil/Perfil";

import FAQ from "../suporte/pages/FAQ/FAQ";
import Historia from "../institucional/pages/Historia/Historia";
import Autores from "../autores/pages/Autores/Autores";
import AutorById from "../autores/pages/AutorById/AutorById";
import MeusLivros from "../autopublicacao/pages/MeusLivros/MeusLivros";
import EditarLivro from "../autopublicacao/pages/EditarLivro/EditarLivro";
import Livros from "../livros/pages/Livros/Livros";
import NovoLivro from "../autopublicacao/pages/NovoLivro/NovoLivro";
import LivroById from "../livros/pages/LivroById/LivroById";
import Suporte from "../suporte/pages/Suporte/Suporte";

const Private = ({ Item, redirectTo = "/auth/login" }) => {
  const { signed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return signed ? (
    <Item />
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} replace />
  );
};

const RoutesClients = () => {
  return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/autores/:id" element={<AutorById />} />

          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/suporte" element={<Suporte />} />

          <Route path="/meuslivros" element={<Private Item={MeusLivros} />} />

          <Route path="/livros" element={<Livros />} />
          <Route path="/livros/:id" element={<LivroById />} />
          
          <Route path="/perfil" element={<Private Item={Perfil} />} />

          <Route path="/novo-livro" element={<Private Item={NovoLivro} />} />

          <Route path = "/editar-livro/:id" element = {<Private Item = {EditarLivro}/>}/>
        </Route>
      </Routes>
  );
};

export default RoutesClients;