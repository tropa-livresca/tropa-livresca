import { useTrocarSenha } from "../../hooks/useTrocarSenha.js";

export default function TrocarSenha() {
  const {
    senha,
    setSenha,
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    carregando,
    AlterarSenha,
    mensagem,
  } = useTrocarSenha();

  if (carregando) {
    return <>Carregando...</>;
  }

  return (
    <>
      <h1>Trocar Senha</h1>
      <form onSubmit={AlterarSenha}>
        <input
          type="password"
          name="senha"
          value={senha}
          placeholder="Senha atual"
          onChange={(e) => setSenha(e.target.value)}
        />
        <input
          type="password"
          name="novaSenha"
          value={novaSenha}
          placeholder="Nova Senha"
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <input
          type="password"
          name="confirmarSenha"
          value={confirmarSenha}
          placeholder="Confirmar Senha"
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        <button type="submit">Atualizar Senha</button>

        {mensagem && <p>{mensagem}</p>}
      </form>
    </>
  );
}
