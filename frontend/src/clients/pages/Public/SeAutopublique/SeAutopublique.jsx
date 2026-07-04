import { Link, Outlet } from "react-router-dom";

export default function SeAutopublique() {
  return (
    <>
      Tela de se autopublicar
      <nav>
        <Link to = "/novo-livro">Novo livro</Link>
        <Outlet/>
      </nav>
    </>
  );
}
