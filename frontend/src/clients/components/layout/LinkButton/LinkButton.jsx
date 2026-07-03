import {Link} from 'react-router-dom';
import styles from './LinkButton.module.css';

/**
 * Componente de botão com Link
 * 
 * @component
 * @param {object} props 
 * @param {string} props.to - Recebe o caminho para o qual o link leva
 * @param {string} props.text - Texto que indica o nome do botão 
 * @returns 
 */

export default function LinkButton({to, text}){
    return(
        <Link className = {styles.btnLink} to = {to}>{text}</Link>
    );
}