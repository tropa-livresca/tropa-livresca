import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Carregando from "../../../clients/components/Carregando/Carregando";
const NotFound = lazy(() => import("../paginasErro/pages/NotFound/NotFound"));

const Login = lazy(() => import("../autenticacao/pages/Login/Login"));

const Cadastro = lazy(() => import("../autenticacao/pages/Cadastro/Cadastro"));

const RedefinirSenha = lazy(
  () => import("../autenticacao/pages/RedefinirSenha/RedefinirSenha"),
);

const EsqueceuSenha = lazy(
  () => import("../autenticacao/pages/EsqueceuSenha/EsqueceuSenha"),
);

const LoginAdmin = lazy(
  () => import("../autenticacao/pages/LoginAdmin/LoginAdmin"),
);

const Callback = lazy(() => import("../autenticacao/pages/Callback/Callback"));

export default function RoutesAutenticacao() {
  return (
    <Suspense fallback={<Carregando/>}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="admin" element={<LoginAdmin />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="callback" element={<Callback />} />
        <Route path="esqueceu-senha" element={<EsqueceuSenha />} />
        <Route path="redefinir-senha" element={<RedefinirSenha />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
