import { useNovaSenha } from "../../hooks/useNovaSenha.js";
import { useState } from "react";

import Popup from "../../../../components/PopUp/Popup";
import { usePopup } from "../../../../components/PopUp/usePopup.js";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import styles from "./NovaSenha.module.css";

export default function NovaSenha() {
  const {
    novaSenha,
    confirmarSenha,
    setNovaSenha,
    setConfirmarSenha,
    criarNovaSenha,
    erro,
  } = useNovaSenha();

  const { popup, fecharPopup } = usePopup();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Criar nova senha</h1>

        <p>
          Antes de seguir, precisamos que se faça a criação de uma nova senha.
        </p>
      </div>

      <div className={styles.container}>
        <form onSubmit={criarNovaSenha} className={styles.formulario}>
          <div className={styles.campo}>
            <label htmlFor="novaSenha" className={styles.rotulo}>
              Nova senha
            </label>

            <div className={styles.inputGrupo}>
              <input
                id="novaSenha"
                type={mostrarSenha ? "text" : "password"}
                name="novaSenha"
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className={styles.input}
              />

              <button
                type="button"
                className={styles.botaoOlho}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="confirmarSenha" className={styles.rotulo}>
              Confirmar senha
            </label>

            <div className={styles.inputGrupo}>
              <input
                id="confirmarSenha"
                type={mostrarConfirmarSenha ? "text" : "password"}
                name="confirmarSenha"
                placeholder="Confirme a nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={styles.input}
              />

              <button
                type="button"
                className={styles.botaoOlho}
                aria-label={
                  mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"
                }
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.botaoSalvar}>
            Alterar senha
          </button>
        </form>
      </div>

      {popup && (
        <Popup
          tipo={popup.tipo}
          mensagem={popup.mensagem}
          fechar={fecharPopup}
        />
      )}
    </main>
  );
}
