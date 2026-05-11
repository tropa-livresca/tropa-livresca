import React from "react";
import RoutesApp from "./routes/Routes";
import { AuthProvider } from "./context/auth/Auth";

/**
 * Componente Raiz da Aplicação
 * Centraliza os provedores de contexto globais e a renderização das rotas
 * 
 * 
 * @component
 * @returns  {JSX.Element} A árvore de componentes principal envolvida pelo AuthProvider
 */
function App() {
  return (
    <AuthProvider>
      <RoutesApp />
    </AuthProvider>
  );
}

export default App;
