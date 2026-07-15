import { useState } from "react";
import Input, { InputTelefone } from "../../../../../common/components/Input/Input";
import SubmitButton from "../../../../../common/components/Submit/SubmitButton";

import logo from "../../images/cadastro.png";
import logo2 from "../../../../../common/images/logo.png";

import styles from "./Cadastro.module.css";
import useAuth from "../../../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !senha || !confSenha || !telefone || !nome) {
      setError("Preencha todos os campos.");
      return;
    }

    let novosErros = [];

    if (senha.length < 8) {
      novosErros.push("A senha precisa ter, no mÃ­nimo, 8 caracteres.");
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!regexSenha.test(senha)) {
      novosErros.push(
        "A senha deve conter letras maiÃºsculas, minÃºsculas, nÃºmeros e caracteres especiais.",
      );
    }

    if (senha !== confSenha) {
      novosErros.push("As senhas nÃ£o sÃ£o iguais.");
    }

    if (telefone.length !== 15) {
      novosErros.push("NÃºmero de telefone incorreto.");
    }

    if (novosErros.length > 0) {
      setError(novosErros);
      return;
    }

    const resError = await signup(email, senha, telefone, nome);

    if (resError) {
      setError(resError);
      return;
    }

    alert(
      "Cadastro realizado! Verifique sua caixa de entrada para confirmar o e-mail.",
    );

    navigate("/login");
  };

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfSenha, setMostrarConfSenha] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
        <img src={logo} alt="Tropa Livresca" width="100" />
      </div>

      <div className={styles.ldireito}>
        <div className={styles.formulario}>
          <button
            type="button"
            className={styles.voltar}
            onClick={() => navigate("/")}
          >
            <IoChevronBack size={28} />
          </button>

          <img src={logo2} alt="Tropa Livresca" width="100" />
          <form onSubmit={handleSignup} method="POST">
            <h1>CADASTRO</h1>
            <h3>Insira seus dados para criar sua conta</h3>

            <label>Nome de UsuÃ¡rio</label>
            <Input
              type="text"
              name="nome"
              placeholder="Digite o usuÃ¡rio"
              handleOnChange={(e) => setNome(e.target.value)}
              value={nome}
            />

            <label>E-mail</label>
            <Input
              type="email"
              name="email"
              placeholder="Digite o e-mail"
              handleOnChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <label>Senha</label>
            <div className={styles.inputSenha}>
              <Input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                placeholder="Digite a senha"
                handleOnChange={(e) => setSenha(e.target.value)}
                value={senha}
              />

              <button
                type="button"
                className={styles.olho}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label>Confirmar Senha</label>
            <div className={styles.inputSenha}>
              <Input
                type={mostrarConfSenha ? "text" : "password"}
                name="confSenha"
                placeholder="Confirme a senha"
                handleOnChange={(e) => setConfSenha(e.target.value)}
                value={confSenha}
              />

              <button
                type="button"
                className={styles.olho}
                onClick={() => setMostrarConfSenha(!mostrarConfSenha)}
              >
                {mostrarConfSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label>Telefone</label>
            <InputTelefone
              type="text"
              name="telefone"
              placeholder="Digite o telefone"
              handleOnChange={(e) => setTelefone(e.target.value)}
              value={telefone}
            />

            <div className={styles.erro}>
              {Array.isArray(error) ? (
                <ul className={styles.listaErros}>
                  {error.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              ) : (
                <span className={styles.span}>{error}</span>
              )}
            </div>

            <span className={styles.span}>
              JÃ¡ tem cadastro? <Link to="/login">Clique aqui.</Link>
            </span>

            <SubmitButton text="CADASTRAR" />
          </form>
        </div>
      </div>
    </div>
  );
}





