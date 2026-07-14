import React from "react";
import RoutesApp from "./clients/routes/Routes";
import { AuthProvider } from "./clients/context/auth/Auth";
import { PerfilProvider } from "./clients/context/perfil/Perfil";
import {LivroProvider} from "./clients/context/livro/Livros";
/**
 * Componente Raiz da Aplicação
 * Centraliza os provedores de contexto globais e a renderização das rotas
 *
 *
 * @component
 * @returns  {JSX.Element} A árvore de componentes principal envolvida pelo AuthProvider e PerfilProvider
 */
function App() {
  return (
    <AuthProvider>
      <LivroProvider>
      <PerfilProvider>
        <RoutesApp />
      </PerfilProvider>
      </LivroProvider>
    </AuthProvider>
  );
}

export default App;
