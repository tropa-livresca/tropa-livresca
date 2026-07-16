import styles from "./NovoLivro.module.css";
import { AutopublicacaoProvider } from "../../context/Autopublicacao";
import { useAutopublicacao } from "../../hooks/useAutopublicacao";

import Detalhes from "../Detalhes/Detalhes";
import Conteudo from "../Conteudo/Conteudo";
import Orcamento from "../Orcamento/Orcamento";
import Confirmacao from "../Confirmacao/Confirmacao";

export function FormularioNovoLivro() {
  const { 
    dadosLivro, 
    etapa, 
    atualizarEtapa, 
    irParaProximaEtapa, 
    voltarEtapa, 
    irParaEtapaEspecifica, 
    publicarLivro 
  } = useAutopublicacao();

  const navegar = { irParaProximaEtapa, voltarEtapa };

  return (
    <main className={styles.container}>
      <h1>Novo Livro</h1>
      <span>Etapa {etapa} de 4</span>

      {etapa === 1 && (
        <Detalhes
          dados={dadosLivro.detalhes}
          onChange={atualizarEtapa("detalhes")}
          {...navegar}
        />
      )}

      {etapa === 2 && (
        <Conteudo
          dados={dadosLivro.conteudo}
          onChange={atualizarEtapa("conteudo")}
          {...navegar}
        />
      )}

      {etapa === 3 && (
        <Orcamento
          dados={dadosLivro.orcamento}
          onChange={atualizarEtapa("orcamento")}
          {...navegar}
        />
      )}

      {etapa === 4 && (
        <Confirmacao
          dados={dadosLivro}
          irParaEtapaEspecifica={irParaEtapaEspecifica}
          publicarLivro={publicarLivro}
        />
      )}
    </main>
  );
}

export default function NovoLivro() {
  return (
    <AutopublicacaoProvider>
      <FormularioNovoLivro />
    </AutopublicacaoProvider>
  );
}


