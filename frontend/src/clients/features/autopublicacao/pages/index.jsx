import { AutopublicacaoProvider } from "../context/Autopublicacao";
import MeusLivros from "./MeusLivros/MeusLivros";
import NovoLivro from "./NovoLivro/NovoLivro";

export default function NovoLivro() {
  return (
    <AutopublicacaoProvider>
      <NovoLivro/>
      <MeusLivros/>
    </AutopublicacaoProvider>
  );
}
