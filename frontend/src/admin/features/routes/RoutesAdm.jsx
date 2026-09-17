import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import NotFound from "../../../common/features/paginasErro/pages/NotFound/NotFound";

import BoasVindas from "../geral/pages/BoasVindas/BoasVindas.jsx";
import NovaSenha from "../perfil/pages/NovaSenha/NovaSenha";
import Revisoes from "../revisoes/pages/Revisoes/Revisoes";
import NovaRevisao from "../revisoes/pages/NovaRevisao/NovaRevisao";
import RevisaoById from "../revisoes/pages/RevisaoById/RevisaoById";
import GerenciaLivros from "../livros/pages/GerenciaLivros/GerenciaLivros";
import VisualizarLivro from "../livros/pages/VisualizarLivro/VisualizarLivro";
import Categoria from "../categorias/pages/Categoria/Categoria";
import AlterarCategoria from "../categorias/pages/AlterarCategoria/AlterarCategoria";
import NovaCategoria from "../categorias/pages/NovaCategoria/NovaCategoria";
import PainelCategoria from "../categorias/pages/PainelCategoria/PainelCategoria";
import GerenciaUsuarios from "../usuarios/pages/GerenciarUsuarios/GerenciarUsuarios.jsx";
import GerenciaFuncionarios from "../funcionarios/pages/GerenciarFuncionarios/GerenciarFuncionarios.jsx";
import PromoverUsuario from "../funcionarios/pages/PromoverUsuario/PromoverUsuario.jsx";
import InativarFuncionario from "../funcionarios/pages/InativarFuncionario/InativarFuncionario.jsx";
import VisualizarUsuario from "../usuarios/pages/VisualizarUsuario/VisualizarUsuario.jsx";

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

        <Route
          path="funcionarios"
          element={
            <PrivateRoute>
              <GerenciaFuncionarios />
            </PrivateRoute>
          }
        />

        <Route
          path="funcionarios/promover"
          element={
            <PrivateRoute>
              <PromoverUsuario />
            </PrivateRoute>
          }
        />

        <Route
          path="funcionarios/inativar"
          element={
            <PrivateRoute>
              <InativarFuncionario />
            </PrivateRoute>
          }
        />

        <Route
          path="usuarios"
          element={
            <PrivateRoute>
              <GerenciaUsuarios />
            </PrivateRoute>
          }
        />

        <Route
          path="usuarios/:id"
          element={
            <PrivateRoute>
              <VisualizarUsuario />
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
