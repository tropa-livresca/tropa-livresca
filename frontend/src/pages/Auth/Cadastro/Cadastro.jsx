import { useState, useEffect } from "react";
import Input, { InputTelefone } from "../../../components/form/Input/Input";
import SubmitButton from "../../../components/form/Submit/SubmitButton";
import logo from "../../../components/images/cad.png";
import logo2 from "../../../components/images/logo.png";
<<<<<<< HEAD
import styles from "./Cadastro.module.css";
=======
 import styles from "./Cadastro.module.css";
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
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
<<<<<<< HEAD
      novosErros.push("A senha precisa ter, no mínimo, 8 caracteres.");
=======
      novosErros.push("A senha precisa ter, no mínimo, 8 caracteres");
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (senha && !regexSenha.test(senha)) {
      novosErros.push(
<<<<<<< HEAD
        "A senha deve contar letras maiúsculas, minúsculas, números e caracteres especiais.",
=======
        "A senha deve contar letras maiúsculas, minúsculas, números e caracteres especiais ",
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
      );
    }

    if (senha !== confSenha) {
      novosErros.push("As senhas não são iguais.");
    }

    if (telefone.length != 15) {
<<<<<<< HEAD
      novosErros.push("Numero de telefone incorreto.");
=======
      novosErros.push("Numero de telefone incorreto");
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
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

<<<<<<< HEAD
            <label>Nome de Usuário</label>
=======
            <label>Nome de Usuário*</label>
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
            <Input
              type="text"
              name="nome"
              placeholder="Digite o usuário"
              handleOnChange={(e) => setNome(e.target.value)}
              value={nome}
            />

<<<<<<< HEAD
            <label>E-mail</label>
=======
            <label>E-mail*</label>
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
            <Input
              type="email"
              name="email"
              placeholder="Digite o e-mail"
              handleOnChange={(e) => setEmail(e.target.value)}
              value={email}
            />

<<<<<<< HEAD
            <label>Senha</label>
=======
            <label>Senha*</label>
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
            <Input
              type="password"
              name="senha"
              placeholder="Digite a senha"
              handleOnChange={(e) => setSenha(e.target.value)}
              value={senha}
            />

<<<<<<< HEAD
            <label>Confirmar Senha</label>
=======
            <label>Confirmar Senha*</label>
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
            <Input
              type="password"
              name="confSenha"
              placeholder="Confirme a senha"
              handleOnChange={(e) => setConfSenha(e.target.value)}
              value={confSenha}
            />

<<<<<<< HEAD
            <label>Telefone</label>
=======
            <label>Telefone*</label>
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0
            <InputTelefone
              type="text"
              name="telefone"
              placeholder="Digite o telefone"
              handleOnChange={(e) => setTelefone(e.target.value)}
              value={telefone}
            />

<<<<<<< HEAD
            <div className={styles.erro}>
              <span>{Array.isArray(error) ? error.join("\n") : error}</span>
            </div>
=======
            <span>{error}</span>
>>>>>>> 13be55e422a83260af3d0e1674b15d601ae89ef0

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
