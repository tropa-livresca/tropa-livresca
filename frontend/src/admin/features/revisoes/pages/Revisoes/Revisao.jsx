import { useEffect, useState } from "react";
import { useRevisao } from "../../hooks/useRevisao.js";

export default function Revisao() {
    const { revisoes, count, carregando, BuscarRevisoes } = useRevisao();

    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("");
    const [ordem, setOrdem] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    useEffect(() => {
        const carregarDados = async () => {
            await BuscarRevisoes(paginaAtual, 12, busca, filtro, ordem);
        }
        carregarDados();
    }, [paginaAtual, filtro, ordem, BuscarRevisoes]);

    const handleBuscar = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        BuscarRevisoes(1, 12, busca, filtro, ordem);
    }

    return <p></p>;

}