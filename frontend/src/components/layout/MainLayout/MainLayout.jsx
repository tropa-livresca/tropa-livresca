import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import Container from "../Container/Container";
/**
 * Layout Principal da Aplicação.
 * Define a estrutura global contendo a barra de navegação,
 * o rodapé e um container centralizado para o conteúdo das rotas.
 *
 * @component
 * @returns {JSX.Element} O componente de layout com NavBar, Container/Outlet e Footer.
 */
export default function MainLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}
