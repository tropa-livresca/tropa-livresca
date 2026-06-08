import { useAutor } from "../../../hooks/useAutor";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function AutorById() {
    const { id } = useParams();
    const { autor, buscarAutorById } = useAutor();

    useEffect(() => {
        if (id) buscarAutorById(id);
    }, [id]);

    return (
        <>
            <h1>{autor?.nome}</h1>
            {autor?.imagem ? (<img src={autor.imagem} alt={autor.nome} />) : (<div>Sem foto</div>)}
            <p>{autor?.descricao || "Sem descrição."}</p>
        </>);
}