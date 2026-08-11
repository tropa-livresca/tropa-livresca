import Input from "../../../../components/Input/Input";
import SubmitButton from "../../../../components/Submit/SubmitButton";
import styles from "./LoginAdmin.module.css";

import logo from "../../images/login.jpg";
import logo2 from "../../../../images/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

import { useLoginAdmin } from "../../hooks/useLoginAdmin";

export default function LoginAdmin() {
  const {
    email,
    setEmail,
    senha,
    setSenha,
    error,
    setError,
    loading,
    handleLoginAdmin,
    navigate,
  } = useLoginAdmin();
  
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSenhaChange = (e) => {
    setSenha(e.target.value);
    if (error) setError("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
        <div className={styles.formulario}>
          <button
            type="button"
            className={styles.voltar}
            onClick={() => navigate("/")}
            disabled={loading}
          >
            <IoChevronBack size={28} />
          </button>

          <img src={logo2} alt="Tropa Livresca" width="100" />
          <form onSubmit={handleLoginAdmin}>
            <h1>LOGIN ADMINISTRADOR</h1>
            <h2>Bem-vindo de volta</h2>
            <h3>Insira seus dados para acessar sua conta</h3>
            
            <label htmlFor="email">E-mail de funcionário</label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              handleOnChange={handleEmailChange}
              value={email}
              disabled={loading}
            />
            
            <label htmlFor="password">Senha</label>
            <div className={styles.inputSenha}>
              <Input
                id="password"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                handleOnChange={handleSenhaChange}
                value={senha}
                disabled={loading}
              />

              <button
                type="button"
                className={styles.olho}
                onClick={() => setMostrarSenha(!mostrarSenha)}
                disabled={loading}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
              
            <SubmitButton 
              text={loading ? "CARREGANDO..." : "ENTRAR"} 
              id={styles.btn} 
              disabled={loading} 
            />

            <div className={styles.errinho}>
              {error && <p className={styles.errorText}>{error}</p>}
            </div>

            <div className={styles.informacoes}>
              <div className={styles.para}>
                <p>
                  Não é funcionário? <Link to="/auth/login"> Clique aqui.</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.ldireito}>
        <img src={logo} alt="Tropa Livresca" width="100" />
      </div>
    </div>
  );
}
