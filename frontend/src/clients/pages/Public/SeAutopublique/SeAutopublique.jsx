import { Link, Outlet } from "react-router-dom";

export default function SeAutopublique() {
  return (
    <>
      Tela de se autopublicar
      <nav>
        <Link to = "/novolivro">Novo livro</Link>
        <Outlet/>
      </nav>
    </>
  );
}
