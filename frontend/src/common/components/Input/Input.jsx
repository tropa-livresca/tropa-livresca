import styles from "./Input.module.css";

export function InputTelefone({ type = "text", text, name, placeholder, handleOnChange, value }) {
    
    const handleChangeMascara = (e) => {
        const digitos = e.target.value.replace(/\D/g, "").slice(0, 11);
        const ddd = digitos.slice(0, 2);
        const numero = digitos.slice(2);

        // Celular começa com 9: (11) 91234-5678. Fixo: (11) 1234-5678.
        const tamanhoPrefixo = numero.startsWith("9") ? 5 : 4;

        // O hífen só entra quando já existe dígito depois dele,
        // senão o backspace nunca consegue apagá-lo.
        let valorAtual;
        if (digitos.length <= 2) {
            valorAtual = digitos;
        } else if (numero.length <= tamanhoPrefixo) {
            valorAtual = `(${ddd}) ${numero}`;
        } else {
            valorAtual = `(${ddd}) ${numero.slice(0, tamanhoPrefixo)}-${numero.slice(tamanhoPrefixo, tamanhoPrefixo + 4)}`;
        }

        e.target.value = valorAtual;

        if (handleOnChange) {
            handleOnChange(e);
        }
    };

    return (
        <div className={styles.form_control}>
            {text && <label htmlFor={name}>{text}</label>}
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={handleChangeMascara}
                value={value || ''}
            />
        </div>
    );
}


export default function Input({ type = "text", text, name, placeholder, handleOnChange, value, className = "", ...props }) {
    return (
        <div className={`${styles.form_control} ${className}`}>
            {text && <label htmlFor={name}>{text}</label>}
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value || ''}
                {...props}
            />
        </div>
    );
}
