import { useState, useEffect } from "react";
import Input, { InputTelefone } from "../../../components/form/Input/Input";
import SubmitButton from "../../../components/form/Submit/SubmitButton";
import logo from "../../../components/images/cad.png";
import logo2 from "../../../components/images/logo.png";
import styles from "./Cadastro.module.css";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

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
    let novosErros = [];

    e.preventDefault();

    if (!email || !senha || !confSenha || !telefone || !nome) {
      setError("Preencha todos os campos.");
      return;
    }

    if (senha.length < 8 && senha.length != "") {
      novosErros.push("A senha precisa ter, no mínimo, 8 caracteres.");
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (senha && !regexSenha.test(senha)) {
      novosErros.push(
        "A senha deve contar letras maiúsculas, minúsculas, números e caracteres especiais.",
      );
    }

    if (senha !== confSenha) {
      novosErros.push("As senhas não são iguais.");
    }

    if (telefone.length != 15) {
      novosErros.push("Numero de telefone incorreto.");
    }

    if (novosErros.length > 0) {
      setError(novosErros);
      return;
    }

    if (senha !== confSenha) {
      setError("As senhas não são iguais.");
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

  return (
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
        <img src={logo} alt="Tropa Livresca" width="100" />
      </div>

      <div className={styles.ldireito}>
        <div className={styles.formulario}>
          <img src={logo2} alt="Tropa Livresca" width="100" />
          <form onSubmit={handleSignup} method="POST">
            <h1>CADASTRO</h1>
            <h3>Insira seus dados para criar sua conta</h3>

            <label>Nome de Usuário</label>
            <Input
              type="text"
              name="nome"
              placeholder="Digite o usuário"
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
            <Input
              type="password"
              name="senha"
              placeholder="Digite a senha"
              handleOnChange={(e) => setSenha(e.target.value)}
              value={senha}
            />

            <label>Confirmar Senha</label>
            <Input
              type="password"
              name="confSenha"
              placeholder="Confirme a senha"
              handleOnChange={(e) => setConfSenha(e.target.value)}
              value={confSenha}
            />

            <label>Telefone</label>
            <InputTelefone
              type="text"
              name="telefone"
              placeholder="Digite o telefone"
              handleOnChange={(e) => setTelefone(e.target.value)}
              value={telefone}
            />

            <div className={styles.erro}>
              <span>{Array.isArray(error) ? error.join("\n") : error}</span>
            </div>

            <span>
              Já tem cadastro? <Link to="/login">Clique aqui.</Link>
            </span>

            <SubmitButton text="CADASTRAR" />
          </form>
        </div>
      </div>
    </div>
  );
}
