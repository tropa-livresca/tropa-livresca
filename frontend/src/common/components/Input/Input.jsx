import styles from "./Input.module.css";

export function InputTelefone({ type = "text", text, name, placeholder, handleOnChange, value }) {
    
    const handleChangeMascara = (e) => {
        let valorAtual = e.target.value;

        valorAtual = valorAtual.replace(/\D/g, "");

        if (valorAtual.length > 11) {
            valorAtual = valorAtual.slice(0, 11);
        }

        if (valorAtual.length > 2) {
            valorAtual = `(${valorAtual.slice(0, 2)}) ${valorAtual.slice(2)}`;
        }
        if (valorAtual.length > 9) {
            valorAtual = `${valorAtual.slice(0, 10)}-${valorAtual.slice(10)}`;
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
