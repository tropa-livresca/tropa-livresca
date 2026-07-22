import React from "react";
import RoutesApp from "./common/routes/RoutesApp";
import { AuthProvider } from "./common/context/Auth";

function App() {
  return (
    <AuthProvider>
      <RoutesApp />
    </AuthProvider>
  );
}

export default App;
