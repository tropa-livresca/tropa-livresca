import { useContext } from "react";
import { CarrinhoContext } from "../context/CarrinhoContext";

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);

  if (!context) {
    throw new Error(
      "Erro de Escopo: useCarrinho() foi chamado em um componente fora do <CarrinhoProvider> ou há uma divergência nos caminhos de importação no projeto.",
    );
  }

  return context;
};
