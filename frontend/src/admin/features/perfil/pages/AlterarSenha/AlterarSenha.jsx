import { useState } from "react";
import { useNovaSenha } from "../../hooks/useNovaSenha";
import Popup from "../../../../components/PopUp/Popup";
import { usePopup } from "../../../../components/PopUp/usePopup.js";
import styles from "./AlterarSenha.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DescricaoTela from "../../../../../clients/components/DescricaoTela/DescricaoTela.jsx";

export default function AlterarSenha() {
  const {
    alterarSenhaAntiga,
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    senhaAntiga,
    setSenhaAntiga,
    email,
    setEmail,
    carregando,
  } = useNovaSenha();

  const { popup, fecharPopup } = usePopup();

  const [mostrarSenhaAntiga, setMostrarSenhaAntiga] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  return (
    <main>
      <DescricaoTela
        titulo="Alterar Senha"
        descricao="Use esse painel para alterar sua senha antiga."
      />

      <div className={styles.container}>
        <form onSubmit={alterarSenhaAntiga} className={styles.formulario}>
          <div className={styles.campo}>
            <label htmlFor="email" className={styles.rotulo}>
              E-mail
            </label>

            <div className={styles.inputGrupo}>
              <input
                id="senhaAntiga"
                type="email"
                name="email"
                placeholder="Digite o seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                disabled={carregando}
              />
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="senhaAntiga" className={styles.rotulo}>
              Senha antiga
            </label>

            <div className={styles.inputGrupo}>
              <input
                id="senhaAntiga"
                type={mostrarSenhaAntiga ? "text" : "password"}
                name="senhaAntiga"
                placeholder="Digite a senha antiga"
                value={senhaAntiga}
                onChange={(e) => setSenhaAntiga(e.target.value)}
                className={styles.input}
                autoComplete="current-password"
                required
                disabled={carregando}
              />

              <button
                type="button"
                className={styles.botaoOlho}
                aria-label={
                  mostrarSenhaAntiga
                    ? "Ocultar senha antiga"
                    : "Mostrar senha antiga"
                }
                aria-pressed={mostrarSenhaAntiga}
                onClick={() => setMostrarSenhaAntiga((anterior) => !anterior)}
                disabled={carregando}
              >
                {mostrarSenhaAntiga ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

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
                autoComplete="new-password"
                required
                disabled={carregando}
              />

              <button
                type="button"
                className={styles.botaoOlho}
                aria-label={
                  mostrarSenha ? "Ocultar nova senha" : "Mostrar nova senha"
                }
                aria-pressed={mostrarSenha}
                onClick={() => setMostrarSenha((anterior) => !anterior)}
                disabled={carregando}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="confirmarSenha" className={styles.rotulo}>
              Confirmar nova senha
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
                autoComplete="new-password"
                required
                disabled={carregando}
              />

              <button
                type="button"
                className={styles.botaoOlho}
                aria-label={
                  mostrarConfirmarSenha
                    ? "Ocultar confirmação da senha"
                    : "Mostrar confirmação da senha"
                }
                aria-pressed={mostrarConfirmarSenha}
                onClick={() =>
                  setMostrarConfirmarSenha((anterior) => !anterior)
                }
                disabled={carregando}
              >
                {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.botaoSalvar}
            disabled={carregando}
          >
            {carregando ? "Alterando senha..." : "Alterar senha"}
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
