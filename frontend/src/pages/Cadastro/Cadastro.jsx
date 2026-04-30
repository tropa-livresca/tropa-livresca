import { useState, useEffect } from "react";
import { createUsuarios } from "../../services/usuarios/createUsuarios";
import Input from "../../components/form/Input/Input";
import SubmitButton from "../../components/form/Submit/SubmitButton";
import { useUsuarios } from "../../hooks/useUsuarios";

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
    <form onSubmit={handleSubmit} method = "POST">

      <h1>Realize o seu Cadastro</h1>
      
      <Input
        type="text"
        name="nome"
        placeholder="Digite o usuário"
        handleOnChange={(e) => setNome(e.target.value)}
        value = {nome}
      />

      <Input
        type="password"
        name="senha"
        placeholder="Digite a senha"
        handleOnChange={(e) => setSenha(e.target.value)}
        value = {senha}
      />

      <Input
        type="email"
        name="email"
        placeholder="Digite o e-mail"
        handleOnChange={(e) => setEmail(e.target.value)}
        value = {email}
      />

      <Input
        type="phone"
        name="tel"
        placeholder="Digite o telefone"
        handleOnChange={(e) => setTelefone(e.target.value)}
        value = {telefone}
      />

      <SubmitButton text="Realizar Cadastro" />
    </form>
  );
}
