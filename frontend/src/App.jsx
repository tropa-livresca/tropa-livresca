import { supabase } from "./lib/supabaseClient"; // ajuste o caminho
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio/Inicio";
import Container from "./components/layout/Container/Container";
import Cadastro from "./pages/Cadastro/Cadastro";
import MainLayout from "./components/layout/MainLayout/MainLayout";
//gffgdgwdrhgw
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
        </Route>

        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
