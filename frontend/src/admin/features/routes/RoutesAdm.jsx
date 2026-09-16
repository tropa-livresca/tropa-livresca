import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import NotFound from "../../../common/features/paginasErro/pages/NotFound/NotFound";

import BoasVindas from "../geral/pages/BoasVindas/BoasVindas.jsx";
import NovaSenha from "../perfil/pages/NovaSenha/NovaSenha";
import Revisoes from "../revisoes/pages/Revisoes/Revisoes";
import NovaRevisao from "../revisoes/pages/NovaRevisao/NovaRevisao";
import RevisaoById from "../revisoes/pages/RevisaoById/RevisaoById";
import GerenciaLivros from "../livros/pages/GerenciaLivros/GerenciaLivros";
import VisualizarLivro from "../livros/pages/VisualizarLivro/VisualizarLivro";
import GerenciaUsuarios from "../usuarios/pages/GerenciarUsuarios/GerenciarUsuarios";
import MainLayout from "../../components/MainLayout/MainLayout";
import useAdmin from "../../../common/hooks/useAdmin";

const PrivateRoute = ({ children, redirectTo = "/auth/admin" }) => {
  const { signed, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!signed) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

const RoutesAdm = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <BoasVindas />
            </PrivateRoute>
          }
        />

        <Route
          path="livros/painel"
          element={
            <PrivateRoute>
              <GerenciaLivros />
            </PrivateRoute>
          }
        />

        <Route
          path="livros/detalhes/:id"
          element={
            <PrivateRoute>
              <VisualizarLivro />
            </PrivateRoute>
          }
        />

        <Route
          path="livros/revisoes"
          element={
            <PrivateRoute>
              <Revisoes />
            </PrivateRoute>
          }
        />

        <Route
          path="livros/revisoes/nova-revisao/:id"
          element={
            <PrivateRoute>
              <NovaRevisao />
            </PrivateRoute>
          }
        />

        <Route
          path="livros/revisoes/visualizar/:id"
          element={
            <PrivateRoute>
              <RevisaoById />
            </PrivateRoute>
          }
        />

        <Route
          path="funcionarios"
          element={
            <PrivateRoute>
              <GerenciaUsuarios />
            </PrivateRoute>
          }
        />

        <Route
          path="configuracoes/novasenha"
          element={
            <PrivateRoute>
              <NovaSenha />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesAdm;
