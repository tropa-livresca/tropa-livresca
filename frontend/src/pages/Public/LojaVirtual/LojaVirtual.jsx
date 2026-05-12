import { supabase } from "../../../lib/supabaseClient";
import { useState, useEffect } from "react";

/**
 * Página da Loja Virtual
 * 
 * @returns {JSX.Element}
 */
export default function LojaVirtual() {
  const [livro, setLivros] = useState([]);

  useEffect(() => {
    /**
     * Método responsável por pegar os dados do Supabase  
     */
    const getLivros = async () => {
      const { data } = await supabase.select("*").from("livros");
      setLivros(data ?? null);
    };
  }, []);

  return <div></div>;
}
