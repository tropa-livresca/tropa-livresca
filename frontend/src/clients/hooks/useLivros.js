import {useContext} from "react";
import {LivroContext} from "../context/livro/Livros";

const useLivros = () =>{
  const context = useContext(LivroContext);

  if (!context) {
    throw new Error(
      "Erro de Escopo: useLivros() foi chamado em um componente fora do <LivroProvider> ou há uma divergência nos caminhos de importação no projeto."
    );
  }

  return context;
}

export default useLivros;