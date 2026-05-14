import { Outlet } from "react-router-dom";

export default function NovoLivro() {
  return (
    <main>
      Novo livro! 
      Queria publicar, mas é melhor vomitar.
      <Outlet />
    </main>
  );
}
