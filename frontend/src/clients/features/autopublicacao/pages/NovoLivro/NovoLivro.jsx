import { AutopublicacaoProvider } from "../../context/Autopublicacao";
import Formulario from "../../components/formulario/Formulario";

export default function NovoLivro({ id }) {
  return (
    <AutopublicacaoProvider>
      <Formulario idLivroEdicao={id} />
    </AutopublicacaoProvider>
  );
}
