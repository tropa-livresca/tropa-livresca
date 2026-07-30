import { useNavigate, Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { useEsqueceuSenha } from "../../hooks/useEsqueceuSenha";

export default function EsqueceuSenha() {
  const navigate = useNavigate();

  const { email, setEmail, error, sucesso, carregando, enviarRecuperarSenha } =
    useEsqueceuSenha();

  return (
    <div>
      <button type="button" onClick={() => navigate("/auth/login")}>
        <IoChevronBack /> Voltar
      </button>

      <form onSubmit={enviarRecuperarSenha} method="POST">
        <h1>RECUPERAR SENHA</h1>
        <p>Insira seu e-mail para receber o link de redefinição</p>

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Digite o e-mail cadastrado"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <div>
          {error && <span>{error}</span>}
          {sucesso && <span>{sucesso}</span>}
        </div>

        <p>
          Lembrou a senha? <Link to="/auth/login">Clique aqui.</Link>
        </p>

        <button type="submit" disabled={carregando}>
          {carregando ? "ENVIANDO..." : "ENVIAR LINK"}
        </button>
      </form>
    </div>
  );
}
