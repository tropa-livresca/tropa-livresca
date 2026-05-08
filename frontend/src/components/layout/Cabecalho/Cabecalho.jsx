/**
 * Componente que corresponde ao cabeçalho da página (que indica o nome de tal)
 * 
 * @param {object} props
 * @param {nome} props.nome
 *  
 * @returns {JSX.Element} 
 */

export default function Cabecalho({nome}){
    return (<span>
        {nome}
    </span>);
}