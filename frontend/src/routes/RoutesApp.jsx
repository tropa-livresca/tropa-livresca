import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoutesAdm from "../admin/features/routes/RoutesAdm";
import RoutesClients from "../clients/features/routes/RoutesClients";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<RoutesAdm />} />
        <Route path="/*" element={<RoutesClients />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
