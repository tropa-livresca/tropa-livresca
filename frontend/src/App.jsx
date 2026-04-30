import { supabase } from "./lib/supabaseClient"; // ajuste o caminho
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio/Inicio";
import Container from "./components/layout/Container/Container";
import NavBar from "./components/layout/NavBar/NavBar";
import Footer from "./components/layout/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <main>
        <Container>
          <Routes>
            <Route path="/" element={<Inicio />} />
          </Routes>
        </Container>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
