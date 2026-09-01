import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import NotFound from "../../../common/features/paginasErro/pages/NotFound/NotFound";

import Revisoes from "../revisoes/pages/Revisoes/Revisoes";
import NovaRevisao from "../revisoes/pages/NovaRevisao/NovaRevisao";
import RevisaoById from "../revisoes/pages/RevisaoById/RevisaoById";

import GerenciaLivros from "../livros/pages/GerenciaLivros/GerenciaLivros";
import VisualizarLivro from "../livros/pages/VisualizarLivro/VisualizarLivro";

import Categoria from "../categorias/pages/Categoria/Categoria";
import AlterarCategoria from "../categorias/pages/AlterarCategoria/AlterarCategoria";
import NovaCategoria from "../categorias/pages/NovaCategoria/NovaCategoria";
import PainelCategoria from "../categorias/pages/PainelCategoria/PainelCategoria";

import MainLayout from "../../components/MainLayout/MainLayout";
import useAuth from "../../../common/hooks/useAuth";

const PrivateRoute = ({ children, redirectTo = "/auth/login" }) => {
  const { signed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!signed) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

const RoutesAdm = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="livros/painel" element={
          <PrivateRoute>
            <GerenciaLivros />
          </PrivateRoute>
        } />

        <Route path="livros/detalhes/:id" element={
          <PrivateRoute>
            <VisualizarLivro />
          </PrivateRoute>
        } />

        <Route path = "livros/revisoes" element = {<PrivateRoute><Revisoes/></PrivateRoute>}/>
        <Route path = "livros/revisoes/nova-revisao/:id" element = {<PrivateRoute><NovaRevisao/></PrivateRoute>}/>
        <Route path = "livros/revisoes/visualizar/:id" element = {<PrivateRoute><RevisaoById/></PrivateRoute>}/>

        <Route path="categorias" element={
          <PrivateRoute>
            <PainelCategoria />
          </PrivateRoute>
        } />

        <Route path="categoria/:id" element={
          <PrivateRoute>
            <Categoria />
          </PrivateRoute>
        } />

        <Route path="categoria/nova" element={
          <PrivateRoute>
            <NovaCategoria />
          </PrivateRoute>
        } />

        <Route path="categoria/alterar/:id" element={
          <PrivateRoute>
            <AlterarCategoria />
          </PrivateRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default RoutesAdm;
