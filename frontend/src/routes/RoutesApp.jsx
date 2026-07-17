import { BrowserRouter } from "react-router-dom";
import RoutesAdm from "../admin/features/routes/RoutesAdm";

import RoutesClients from "../clients/features/routes/RoutesClients";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <RoutesClients />
      <RoutesAdm/>
    </BrowserRouter>
  );
};

export default RoutesApp;

