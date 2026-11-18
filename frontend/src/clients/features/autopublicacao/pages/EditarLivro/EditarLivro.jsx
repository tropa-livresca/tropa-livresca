import { useParams } from "react-router-dom";
import Formulario from "../../components/formulario/Formulario";
import { AutopublicacaoProvider } from "../../context/Autopublicacao";

export default function EditarLivro() {
  const { id } = useParams();

  return (
    <AutopublicacaoProvider>
      <Formulario idLivroEdicao={id} />
    </AutopublicacaoProvider>
  );
}
