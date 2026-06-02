import { useContext } from "react";
import { LivroContext } from "../context/auth/Livros";

const useLivros = () =>{
    const context = useContext(LivroContext);
    return context;
}

export default useLivros;

