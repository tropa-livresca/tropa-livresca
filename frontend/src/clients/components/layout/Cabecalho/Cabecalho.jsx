import styles from "./Cabecalho.module.css";
/**
 * Componente que corresponde ao cabeçalho da página (que indica o nome de tal)
 * 
 * @param {object} props
 * @param {nome} props.nome
 *  
 * @returns {JSX.Element} 
 */

export default function Cabecalho({nome, descricao}){
    return (<span>
        {nome}
        <p>{descricao}</p>
    </span>);
}