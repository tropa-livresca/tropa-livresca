import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoutesAdm from "../../admin/features/routes/RoutesAdm";
import RoutesClients from "../../clients/features/routes/RoutesClients";
import RoutesAutenticacao from "../../common/features/routes/RoutesAutenticacao";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<RoutesAdm />} />
        <Route path="/*" element={<RoutesClients />} />
        <Route path = "/auth/*" element = {<RoutesAutenticacao/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
