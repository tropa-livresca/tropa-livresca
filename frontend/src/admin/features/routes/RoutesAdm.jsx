import { Routes, Route, useLocation, Navigate } from "react-router-dom";

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

  return signed ? children : <Navigate to={redirectTo} state={{ from: location }} replace />;
};

const RoutesAdm = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path = "livros/painel" element = {
          <PrivateRoute>
            <GerenciaLivros/>
          </PrivateRoute>
        }/>

        <Route path = "livros/detalhes/:id" element = {
          <PrivateRoute>
            <VisualizarLivro/>
          </PrivateRoute>
        }/>

        <Route
          path="categorias"
          element={
            <PrivateRoute>
              <PainelCategoria />
            </PrivateRoute>
          }
        />

        <Route
          path="categoria/:id"
          element={
            <PrivateRoute>
              <Categoria />
            </PrivateRoute>
          }
        />

        <Route
          path="categoria/nova"
          element={
            <PrivateRoute>
              <NovaCategoria />
            </PrivateRoute>
          }
        />

        <Route
          path="categoria/alterar/:id"
          element={
            <PrivateRoute>
              <AlterarCategoria />
            </PrivateRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
};

export default RoutesAdm;
