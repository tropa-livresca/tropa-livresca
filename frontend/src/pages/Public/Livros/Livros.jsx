import useLivros from "../../../hooks/useLivros";
import { useEffect, useState } from "react";

export default function Livros() {
    const { Livros, setLivros, BuscarLivros, carregando } = useLivros();

    useEffect(() => {
        const carregarDados = async () => {
            await BuscarLivros();
        }
        carregarDados();
    }, []);

    if (carregando) return <p>Carregando</p>

    return (
        <main>
            <h1>Livros publicados pela editora</h1>
            {!Livros || Livros.length === 0 ? (<p>Nenhum autor encontrado</p>) : (
                Livros.map((livro) => {
                    return (
                        <div  key={livro.id}>
                            {livro.capa ? (<img src={livro.capa} alt={livro.titulo} width="100" />) : (<div>Sem imagem</div>)}
                            <h3>{livro.titulo || "Sem título"}</h3>
                            <p>{livro.descricao || "Sem descrição"}</p>
                            <p>{livro.autor_nome || "Sem autor"}</p>
                            <p>{livro.autor_sobrenome || "Sem sobrenome"}</p>
                        </div>
                    );
                })
            )}

        </main>)
}