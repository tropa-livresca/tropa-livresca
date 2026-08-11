import { useTrocarSenha } from "../../hooks/useTrocarSenha.js";
import styles from "./TrocarSenha.module.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  // Estados individuais para controlar a visibilidade de cada campo
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Trocar Senha</h1>
      </div>

      <div className={styles.containerbloco}>
        <form onSubmit={AlterarSenha} className={styles.formulario}>
          
          {/* Campo: Senha Atual */}
          <div className={styles.campo_grupo}>
            <label htmlFor="senha">Senha atual</label>
            <div className={styles.inputSenha}>
              <input
                type={mostrarSenhaAtual ? "text" : "password"}
                id="senha"
                name="senha"
                value={senha}
                placeholder="Digite sua senha atual"
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
              />
              <button
                type="button"
                className={styles.olho}
                onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                disabled={carregando}
              >
                {mostrarSenhaAtual ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Campo: Nova Senha */}
          <div className={styles.campo_grupo}>
            <label htmlFor="novaSenha">Nova senha</label>
            <div className={styles.inputSenha}>
              <input
                type={mostrarNovaSenha ? "text" : "password"}
                id="novaSenha"
                name="novaSenha"
                value={novaSenha}
                placeholder="Digite a nova senha"
                onChange={(e) => setNovaSenha(e.target.value)}
                disabled={carregando}
              />
              <button
                type="button"
                className={styles.olho}
                onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                disabled={carregando}
              >
                {mostrarNovaSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Campo: Confirmar Nova Senha */}
          <div className={styles.campo_grupo}>
            <label htmlFor="confirmarSenha">Confirmar nova senha</label>
            <div className={styles.inputSenha}>
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                id="confirmarSenha"
                name="confirmarSenha"
                value={confirmarSenha}
                placeholder="Confirme a nova senha"
                onChange={(e) => setConfirmarSenha(e.target.value)}
                disabled={carregando}
              />
              <button
                type="button"
                className={styles.olho}
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                disabled={carregando}
              >
                {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.btn_submit} disabled={carregando}>
            {carregando ? "Atualizando..." : "Atualizar Senha"}
          </button>

          {mensagem && (
            <p className={`${styles.mensagem} ${mensagem.includes("sucesso") ? styles.sucesso : styles.erro}`}>
              {mensagem}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
