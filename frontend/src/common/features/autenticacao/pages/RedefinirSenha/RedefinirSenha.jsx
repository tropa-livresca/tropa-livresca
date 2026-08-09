import { useRedefinirSenha } from "../../hooks/useRedefinirSenha";

export default function RedefinirSenha() {
  const {
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    carregando,
    error,
    sucesso,
    enviarRedefinirSenha,
  } = useRedefinirSenha();

  return (
    <div>
      <form onSubmit={enviarRedefinirSenha}>
        <h1>REDEFINIR SENHA</h1>
        <p>Digite e confirme sua nova senha abaixo para atualizar sua conta</p>

        <div>
          <label htmlFor="novaSenha">Nova Senha</label>
          <input
            type="password"
            name="novaSenha"
            id="novaSenha"
            placeholder="Digite a nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            disabled={carregando}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
          <input
            type="password"
            name="confirmarSenha"
            id="confirmarSenha"
            placeholder="Repita a nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={carregando}
            required
          />
        </div>

        <div>
          {error && <span style={{ color: "red" }}>{error}</span>}
          {sucesso && <span style={{ color: "green" }}>{sucesso}</span>}
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "ATUALIZANDO..." : "Redefinir Senha"}
        </button>
      </form>
    </div>
  );
}
