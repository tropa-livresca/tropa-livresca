import { useContext } from "react";
import { AutopublicacaoContext } from "../context/Autopublicacao";

export const useAutopublicacao = () => {
  const context = useContext(AutopublicacaoContext);

  if (!context) {
    throw new Error(
      "Erro de Escopo: useAutopublicacao() foi chamado em um componente fora do <AutopublicacaoProvider> ou há uma divergência nos caminhos de importação no projeto."
    );
  }

  return context;
};
