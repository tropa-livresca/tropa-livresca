import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Breadcrumbs from "../../../common/components/Breadcrumbs/Breadcrumbs";
import Footer from "../Footer/Footer";
import Container from "../Container/Container";

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <Breadcrumbs/>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}
