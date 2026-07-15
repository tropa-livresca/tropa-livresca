import styles from "./SubmitButton.module.css";

/**
 * Componente de Botão de Submeter formulário
 * 
 * @component
 * @param {object} props 
 * @param {string} props.text - Atributo que indica o texto que aparecerá sobre o botão 
 * @returns {JSX.Element}
 */
export default function SubmitButton({text}) {
    return(
    <div>
        <button className = {styles.btn}>{text}</button>
    </div>
);
}