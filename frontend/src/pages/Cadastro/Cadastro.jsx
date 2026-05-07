import { useState, useEffect } from "react";
import Input from "../../components/form/Input/Input";
import SubmitButton from "../../components/form/Submit/SubmitButton";
import logo from "../../components/images/cad.png";
import styles from "./Cadastro.module.css";
import useAuth from "../../hooks/useAuth";
import { supabase } from "../../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

/**
 * Página de Cadastro de Usuários
 * Gerencia o estado do formulário, validações básicas de senha e integração com o hook de autenticação
 *
 * @component
 * @returns {JSX.element}
 */
export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState([]); //Trata os erros como vetor
  const navigate = useNavigate();

  const { signup } = useAuth();

  /**
   * Trata o envio de formulário de cadastro
   * Realiza validações de campos vazios e igualdade de senhas antes de chamar o servidor
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   * @returns {Promise<void>}
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError([]);

    let novosErros = []; //Cria array de erros

    if (!email || !senha || !confSenha || !telefone || !nome) {
      novosErros.push("Preencha todos os campos.");
    }

    if (senha.length < 8 && senha.length != "") {
      novosErros.push("A senha precisa ter, no mínimo, 8 caracteres");
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (senha && !regexSenha.test(senha)) {
      novosErros.push(
        "A senha deve contar letras maiúsculas, minúsculas, números e caracteres especiais ",
      );
    }

    if (senha !== confSenha) {
      novosErros.push("As senhas não são iguais.");
    }

    if (novosErros.length > 0) {
      setError(novosErros);
      return;
    }

    //Validação do Banco se há usuários a partir da função criada check_user_exists
    try {
      const { data: exists, error: rpcError } = await supabase.rpc(
        "check_user_exists",
        {
          email_to_check: email,
        },
      );

      if (rpcError) throw rpcError;

      if (exists) {
        setError(["Este e-mail já está cadastrado."]);
        return; //Interrompe o cadastro
      }
    } catch (err) {
      console.error("Erro RPC:", err);
    }

    //Tentativa de cadastro do usuário
    const res = await signup(email, senha, telefone, nome);

    if (res) {
      //Assume que 'res' contém a mensagem de erro vinda do Supabase/AuthContext

      setError(res);
      return;
    }

    alert("Usuário cadastrado com sucesso!");

    navigate("/confirmacaoemail"); //Envia o usuário à tela de login caso funcione até que a tela de confirmação de e-mail ser criada
  };

  return (
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
        <img src={logo} alt="Tropa Livresca" width="100" />
      </div>

      <div className={styles.ldireito}>
        <div className={styles.formulario}>
          <form onSubmit={handleSignup} method="POST">
            <h1>CADASTRO</h1>

            <label>Usuário</label>
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
            <Input
              type="phone"
              name="tel"
              placeholder="Digite o telefone"
              handleOnChange={(e) => setTelefone(e.target.value)}
              value={telefone}
            />

            <SubmitButton text="Realizar Cadastro" />

            {error.length > 0 && (
              <ul>
                {error.map((erro, i) => (
                  <li key={i}>{erro}</li>
                ))}
              </ul>
            )}

            <span>
              Já tem cadastro? <Link to="/login">Clique aqui.</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
