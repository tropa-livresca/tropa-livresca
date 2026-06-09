import { useAutor } from "../../../hooks/useAutor";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AutorById() {
    const { id } = useParams();
    const { autor, instagram, linkedin, facebook, email, redes, livros, carregando, meta, buscarAutorById } = useAutor();
    
    const [paginaAtual, setPaginaAtual] = useState(1);

    useEffect(() => {
        if (id) buscarAutorById(id, paginaAtual, 3);
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
                        <li>Facebook: <a href={facebook} target="_blank" rel="noopener noreferrer"></a></li>
                    )}

                    {instagram && (
                        <li>Instagram: <a href={instagram} target="_blank" rel="noopener noreferrer"></a></li>
                    )}

                    {linkedin && (
                        <li>Linkedin:<a href={linkedin} target="_blank" rel="noopener noreferrer"></a></li>
                    )}

                    {email && (
                        <li>E-mail:<a href={{email}} target="_blank" rel="noopener noreferrer"></a></li>
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

            {meta && meta.totalPage > 1 && (
                        <div>
                          <button
                            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                            disabled={paginaAtual === 1}
                          >
                            Anterior
                          </button>
            
                          <span>Página {paginaAtual} de {meta.totalPages} (Total: {meta.totalItems})</span>
            
                          <button
                            onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, meta.totalPages))}
                            disabled={paginaAtual === meta.totalPages}
                          >
                            Próximo
                          </button>
            
                        </div>
                      )}
        </>);
}