import React from "react";
import RoutesApp from "./routes/Routes";
import { AuthProvider } from "./context/auth/Auth";

function App() {
  return (
    <AuthProvider>
      <RoutesApp />
    </AuthProvider>
  );
}

export default App;
