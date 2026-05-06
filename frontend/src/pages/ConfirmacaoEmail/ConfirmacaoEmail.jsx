import { useState } from "react";
import Input from "../../components/form/Input/Input";
import SubmitButton from "../../components/form/Submit/SubmitButton";
import {AuthContext} from "../../context/auth/Auth";
import { useNavigate } from "react-router-dom";

/**
 * Página de confirmação de e-mail para ser executada após o usuário se cadastrar
 * Gerencia o estado do formulário e realiza a integração com o Auth
 *
 * @component
 * @returns {JSX.element}
 */
export default function ConfirmacaoEmail() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const { confirmsignup } = useAuth();

  /**
   * Trata o envio do token segundo o e-mail inicializado em AuthProvider
   * Realiza a validação do preenchimento e integração com o servidor
   *
   * @param {React.FormEvent<HTMLFormElement>}
   * @returns {Promise<Void>}
   */
  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setError("");//Limpa erros prévios

    const res = await confirmsignup(token);
    
    /**
     * Assume que 'res' contem a mensagem de erro de Supabase/AuthContext
     */
    if (res) {
      setError(res);
      return;
    }

    navigate("/");//Navega até a tela de início
  };

  return (
    <>
      <h1>Digite o seu código de verificação mandado no seu {text}</h1>
      <form onSubmit={handleConfirmSignUp}>
        <Input
          type="text"
          text="Código de verificação"
          name="Código"
          placeholder="Digite o código de verificação"
          handleOnChange={(e) => setToken(e.target.value)}
          value={token}
        />

        <SubmitButton text="Submeter Código" />
      </form>
    </>
  );
}
