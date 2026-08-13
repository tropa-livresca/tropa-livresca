import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout/MainLayout";
import useAuth from "../../../common/hooks/useAuth";

import BoasVindas from "../painelGeral/pages/BoasVindas/BoasVindas";

const PrivateRoute = ({ children, redirectTo = "/auth/login" }) => {
  const { signed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return signed ? children : <Navigate to = {redirectTo} state={{ from: location }} replace />;
};

const RoutesAdm = () => {
  return (
      <MainLayout>
        <Routes>
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <BoasVindas />
              </PrivateRoute>
            } 
          />
        </Routes>
      </MainLayout>
  );
};

export default RoutesAdm;
