import { Link, Outlet } from "react-router-dom";

export default function SeAutopublique() {
  return (
    <>
      Tela de se autopublicar
      <nav>
        <Link to = "/novolivro">Novo livro by David Balls</Link>
        <Outlet/>
      </nav>
    </>
  );
}
