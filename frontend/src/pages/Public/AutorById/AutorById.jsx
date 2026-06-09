import { useAutor } from "../../../hooks/useAutor";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";

export default function AutorById() {
    const { id } = useParams();
    const { autor, instagram, linkedin, facebook, email, redes, livros, carregando, buscarAutorById } = useAutor();

    useEffect(() => {
        if (id) buscarAutorById(id);
    }, [id]);

    if (carregando) return <p>Carregando...</p>

    return (
        <>
            <h1>{autor?.nome}</h1>
            {autor?.imagem ? (<img src={autor.imagem} alt={autor.nome} />) : (<div>Sem foto</div>)}
            <p>{autor?.descricao || "Sem descrição."}</p>

            <h2>Redes Sociais</h2>
            {redes && redes.length > 0 ? (
                <ul id="redesSociais">
                    {facebook && (
                        <li>{facebook}</li>
                    )}

                    {instagram && (
                        <li>{instagram}</li>
                    )}

                    {linkedin && (
                        <li>{linkedin}</li>
                    )}

                    {email && (
                        <li>{email}</li>
                    )}
                </ul>
            ) : (
                <p>Sem redes sociais disponíveis.</p>
            )}

            <h2>Livros</h2>
            {!livros || livros.length === 0 ? (<p>Nenhum livro encontrado</p>) : (
                livros.map((livro) => {
                    return (
                        <div key={livro.id}>
                            {livro.capa ? (<img src={livro.capa} alt={livro.titulo} width="100" />) : (<div>Sem foto da capa</div>)}
                            <h3>{livro.titulo}</h3>
                            <p>{livro.subtitulo}</p>
                            
                            <Link to={`/livros`} >Ver Livros</Link>
                        </div>
                    );
                })
            )}

        </>);
}