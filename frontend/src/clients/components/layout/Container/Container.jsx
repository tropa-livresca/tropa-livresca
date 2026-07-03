import styles from './Container.module.css';

/**
 * Componente de Container
 * 
 * @component
 * @param {object} props 
 * @param {React.ReactNode} props.children - Elementos que podem estar encerrados pelo componente
 * @param {string} [props.customClass] - Nome de uma classe css para estilização do container
 * @returns {JSX.Element}
 */
export default function Container({children, customClass}) {
    return (
        <div className={`${styles.container} ${styles[customClass] || ""} `}>
            {children}
        </div>
    );
}