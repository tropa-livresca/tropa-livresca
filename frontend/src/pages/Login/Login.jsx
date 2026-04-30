import Input from "../../components/form/Input";
import SubmitButton from "../../components/form/SubmitButton";
import useUsuario from "../../hooks/useUsuarios";

export default function Login() {
  return (

    <form onChange={handleSubmit}>
      <Input/>
      <Input />
    </form>
  );
}
