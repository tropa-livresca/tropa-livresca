import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Carregando from "../../clients/components/Carregando/Carregando";
const RoutesAdm = lazy(() => import("../../admin/features/routes/RoutesAdm"));

const RoutesClients = lazy(
  () => import("../../clients/features/routes/RoutesClients"),
);

const RoutesAutenticacao = lazy(
  () => import("../../common/features/routes/RoutesAutenticacao"),
);

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Carregando />}>
        <Routes>
          <Route path="/admin/*" element={<RoutesAdm />} />
          <Route path="/auth/*" element={<RoutesAutenticacao />} />
          <Route path="/*" element={<RoutesClients />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default RoutesApp;
