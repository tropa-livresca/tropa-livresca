import { Navigate, Routes, Route } from "react-router-dom";
import MainLayout from "../../components/MainLayout/MainLayout";
import useAdmin from "../../../common/hooks/useAdmin";

// Páginas de erro
import NotFound from "../../../common/features/paginasErro/pages/NotFound/NotFound";
import NaoAutorizado from "../../../common/features/paginasErro/pages/NaoAutorizado/NaoAutorizado";

// Geral
import BoasVindas from "../geral/pages/BoasVindas/BoasVindas.jsx";

// Perfil
import AlterarSenha from "../perfil/pages/AlterarSenha/AlterarSenha.jsx";
import NovaSenha from "../perfil/pages/NovaSenha/NovaSenha";

// Revisões
import Revisoes from "../revisoes/pages/Revisoes/Revisoes";
import NovaRevisao from "../revisoes/pages/NovaRevisao/NovaRevisao";
import RevisaoById from "../revisoes/pages/RevisaoById/RevisaoById";

// Livros
import GerenciaLivros from "../livros/pages/GerenciaLivros/GerenciaLivros";
import VisualizarLivro from "../livros/pages/VisualizarLivro/VisualizarLivro";

// Usuários
import GerenciaUsuarios from "../usuarios/pages/GerenciarUsuarios/GerenciarUsuarios.jsx";
import VisualizarUsuario from "../usuarios/pages/VisualizarUsuario/VisualizarUsuario.jsx";

// Vendas
import Vendas from "../vendas/pages/Vendas/Vendas.jsx";

// Financeiro
import Graficos from "../financeiro/pages/Graficos/Graficos.jsx";
import Financeiro from "../financeiro/pages/Financeiro/Financeiro.jsx";

const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAdmin();

  if (loading) return null;

  if (!signed) {
    return <Navigate to="/admin/nao-autorizado" replace />;
  }

  return children;
};

const MasterRoute = ({ children }) => {
  const { signed, loading, user } = useAdmin();

  if (loading) return null;

  if (!signed || !user?.is_master) {
    return <Navigate to="/admin/nao-autorizado" replace />;
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
          path="analises/financeiro"
          element={
            <MasterRoute>
              <Financeiro />
            </MasterRoute>
          }
        />

        <Route
          path="analises/graficos"
          element={
            <MasterRoute>
              <Graficos />
            </MasterRoute>
          }
        />

        <Route
          path="ecommerce/pedidos"
          element={
            <PrivateRoute>
              <Vendas />
            </PrivateRoute>
          }
        />

        <Route
          path="usuarios"
          element={
            <MasterRoute>
              <GerenciaUsuarios />
            </MasterRoute>
          }
        />

        <Route
          path="usuarios/:id"
          element={
            <MasterRoute>
              <VisualizarUsuario />
            </MasterRoute>
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

        <Route
          path="configuracoes/alterarsenha"
          element={
            <PrivateRoute>
              <AlterarSenha />
            </PrivateRoute>
          }
        />
      </Route>

      <Route
        path="nao-autorizado"
        element={
          <NaoAutorizado mensagem="Você não tem permissão para acessar esta página." />
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesAdm;
