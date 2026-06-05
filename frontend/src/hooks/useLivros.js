import { useContext } from "react";
import { LivroContext } from "../context/livro/Livros";

const useLivros = () => {
  const context = useContext(LivroContext);
  return context;
};

export default useLivros;
