import { useParams } from "react-router-dom";
import FormularioGerenciarLivro from "../../components/Formulario/Formulario";
import { AutopublicacaoProvider } from "../../context/Autopublicacao";

export default function EditarLivro() {
  const { id } = useParams();

  return (
    <AutopublicacaoProvider>
      <FormularioGerenciarLivro idLivroEdicao={id} />
    </AutopublicacaoProvider>
  );
}
