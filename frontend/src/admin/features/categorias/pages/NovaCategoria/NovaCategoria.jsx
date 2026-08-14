import { useCategoria } from "../../hooks/useCategoria";

export default function NovaCategoria() {
    const {
        nome,
        setNome,
        tipo,
        setTipo,
        descricao,
        setDescricao,
        handleCriarCategoria
    } = useCategoria();

    return (
        <form onSubmit={handleCriarCategoria}>
            <label>Nome:
                <input
                    type="text"
                    value={nome}
                    placeholder="Digite o nome da categoria."
                    onChange={(e) => { setNome(e.target.value) }}></input>
            </label>

            <label>Descrição:
                <input
                    type="text"
                    value={descricao} placeholder="Digite a descrição"
                    onChange={(e) => setDescricao(e.target.value)} />
            </label>

            <select value={tipo} onChange={(e) => { setTipo(e.target.value) }}>
                <option value="">Selecione uma tipo de categoria</option>
                <option value="livro">Nova Categoria de Livro</option>
                <option value="funcao">Nova Função</option>
            </select>

            <button type = "submit">Criar Nova Categoria</button>
        </form>);
}