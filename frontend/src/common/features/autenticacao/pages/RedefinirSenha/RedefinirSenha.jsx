import { useEffect } from "react";
import { useRedefinirSenha } from "../../hooks/useRedefinirSenha";

export default function RedefinirSenha() {
  const {
    enviarRedefinirSenha,
    mensagem,
    novaSenha,
    setNovaSenha,
    encontrarHash,
  } = useRedefinirSenha();

  useEffect(() => {
    encontrarHash();
  }, [encontrarHash]);

  return (
    <div>
      <form onSubmit={enviarRedefinirSenha} method="POST">
        <h1>REDEFINIR SENHA</h1>
        <p>Digite sua nova senha abaixo para atualizar sua conta</p>

        <label htmlFor="novaSenha">Nova Senha</label>
        <input
          type="password"
          name="novaSenha"
          id="novaSenha"
          placeholder="Digite a nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
        />

        <div>
          {mensagem && <span>{mensagem}</span>}
        </div>

        <button type="submit">
          Redefinir Senha
        </button>
      </form>
    </div>
  );
}
