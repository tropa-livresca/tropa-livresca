import { useCategoria } from "../../hooks/useCategoria.js";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Carregando from "../../../../../clients/components/Carregando/Carregando";

export default function Categoria() {
    const { id } = useParams();
    const { categoria, BuscarCategoriaById, carregando, InativarCategoria } = useCategoria();

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            BuscarCategoriaById(id);
        }
    }, [id, BuscarCategoriaById]);

    const Inativar = async(e) =>{
        e.preventDefault();
        
        await InativarCategoria(id);

        navigate(`/admin/categorias`);
    }

    if (carregando) return <Carregando mensagem="Carregando categoria..."/>

    if (!categoria) return <p>Nenhuma categoria encontrada para este id.</p>

    return (
        <main>
            <section>
                <h1>Categoria</h1>
                {categoria.nome ? (<p>Nome Categoria: {categoria.nome}</p>) : (<p>
                    Nenhum nome encontrado.
                </p>)}

                {categoria.descricao ? (<p>Descrição Categoria: {categoria.descricao}</p>) : (
                    <p>Nenhuma descrição encontrada.</p>
                )}

                {categoria.tipo ? (<p>Tipo Categoria: {categoria.tipo}</p>
                ) : (<p>Tipo indefinido.</p>)}
            </section>

            {categoria.autor ? (<p>Categoria criada por: {categoria.autor}</p>) : (
                <p>Autor não encontrado.</p>
            )}

            <button><Link to={`/admin/categoria/editar/${id}`}>Editar categoria</Link></button>

            <button onClick = {Inativar}>Inativar Categoria</button>

            <button><Link to ={`/admin/categorias`}>Voltar para o painel</Link></button>
        </main>
    );
}