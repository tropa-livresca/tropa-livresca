import {Link} from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      <Link to = "/">Voltar à Página Inicial</Link>
    </div>
  );
}
