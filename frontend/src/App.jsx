import RoutesApp from "./common/routes/RoutesApp";
import { AuthProvider } from "./common/context/auth/Auth";
import { AdminProvider } from "./common/context/admin/Admin";

function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <RoutesApp />
      </AuthProvider>
    </AdminProvider>
  );
}

export default App;
