import { useState, useEffect } from "react";
import { createUsuarios } from "../../services/usuarios/createUsuarios";
import Input from "../../components/form/Input/Input";
import SubmitButton from "../../components/form/Submit/SubmitButton";
import { useUsuarios } from "../../hooks/useUsuarios";
import logo from "../../components/images/cad.png";
import styles from "./Cadastro.module.css";

export default function Cadastro() {
  const usuarios = useUsuarios;
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const novoUsuario = await createUsuarios({ nome, senha, email, telefone });

    if (novoUsuario) {
      setUsuarios((prev) => [...prev, novoUsuario]);
      setNome("");
      setSenha("");
      setTelefone("");
      setEmail("");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
        <img src={logo} alt="Tropa Livresca" width="100" />
      </div>

      <div className={styles.ldireito}>
        <div className={styles.formulario}>
          <form onSubmit={handleSubmit} method="POST">
            <h1>CADASTRO</h1>

            <label>Usuário</label>
            <Input
              type="text"
              name="nome"
              placeholder="Digite o usuário"
              handleOnChange={(e) => setNome(e.target.value)}
              value={nome}
            />

            <label>Senha</label>
            <Input
              type="password"
              name="senha"
              placeholder="Digite a senha"
              handleOnChange={(e) => setSenha(e.target.value)}
              value={senha}
            />

            <label>E-mail</label>
            <Input
              type="email"
              name="email"
              placeholder="Digite o e-mail"
              handleOnChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <label>Telefone</label>
            <Input
              type="phone"
              name="tel"
              placeholder="Digite o telefone"
              handleOnChange={(e) => setTelefone(e.target.value)}
              value={telefone}
            />

            <SubmitButton text="Realizar Cadastro" />
          </form>
        </div>
      </div>
    </div>
  );
}
