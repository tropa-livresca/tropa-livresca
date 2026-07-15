import { BrowserRouter } from "react-router-dom";
import RoutesClients from "../clients/features/routes/RoutesClients";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <RoutesClients />
    </BrowserRouter>
  );
};

export default RoutesApp;

