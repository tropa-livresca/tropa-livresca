import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Carregando from "../../components/Carregando/Carregando";
import MainLayout from "../../components/MainLayout/MainLayout";
import useAdmin from "../../../common/hooks/useAdmin";

const NotFound = lazy(
  () => import("../../../common/features/paginasErro/pages/NotFound/NotFound"),
);

const NaoAutorizado = lazy(
  () =>
    import("../../../common/features/paginasErro/pages/NaoAutorizado/NaoAutorizado"),
);

const BoasVindas = lazy(
  () => import("../geral/pages/BoasVindas/BoasVindas.jsx"),
);

const AlterarSenha = lazy(
  () => import("../perfil/pages/AlterarSenha/AlterarSenha.jsx"),
);

const NovaSenha = lazy(() => import("../perfil/pages/NovaSenha/NovaSenha"));

const Revisoes = lazy(() => import("../revisoes/pages/Revisoes/Revisoes"));

const NovaRevisao = lazy(
  () => import("../revisoes/pages/NovaRevisao/NovaRevisao"),
);

const RevisaoById = lazy(
  () => import("../revisoes/pages/RevisaoById/RevisaoById"),
);

const GerenciaLivros = lazy(
  () => import("../livros/pages/GerenciaLivros/GerenciaLivros"),
);

const VisualizarLivro = lazy(
  () => import("../livros/pages/VisualizarLivro/VisualizarLivro"),
);

const GerenciaUsuarios = lazy(
  () => import("../usuarios/pages/GerenciarUsuarios/GerenciarUsuarios.jsx"),
);

const Vendas = lazy(() => import("../vendas/pages/Vendas/Vendas.jsx"));

const Graficos = lazy(
  () => import("../financeiro/pages/Graficos/Graficos.jsx"),
);

const Financeiro = lazy(
  () => import("../financeiro/pages/Financeiro/Financeiro.jsx"),
);

const VisualizarUsuario = lazy(
  () => import("../usuarios/pages/VisualizarUsuario/VisualizarUsuario.jsx"),
);

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
    <Suspense fallback={<Carregando />}>
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
              <PrivateRoute>
                <Financeiro />
              </PrivateRoute>
            }
          />

          <Route
            path="analises/graficos"
            element={
              <PrivateRoute>
                <Graficos />
              </PrivateRoute>
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
    </Suspense>
  );
};

export default RoutesAdm;
