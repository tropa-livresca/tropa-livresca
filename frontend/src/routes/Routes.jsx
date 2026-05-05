import { supabase } from "../lib/supabaseClient";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio/Inicio";
import Container from "../components/layout/Container/Container";
import Cadastro from "../pages/Cadastro/Cadastro";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import Login from "../pages/Login/Login";
import useAuth from "../hooks/useAuth";

const Private = ({ Item }) => {
  const { signed } = useAuth();

  return signed ? <Item /> : <Login />;
};

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
        </Route>

        <Route path="/cadastro" element={<Cadastro />} />

        <Route path = "/login" element = {<Login/>}/>  
        
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
