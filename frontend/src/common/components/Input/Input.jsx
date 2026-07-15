import React from "react";
import styles from "./Input.module.css";
import { useMask } from '@react-input/mask';

const formataçãoTelefone = {
    mask: '(__) _____-____',
    replacement: { _: /\d/ },
};

export function InputTelefone({ type = "text", text, name, placeholder, handleOnChange, value }) {
    const inputRef = useMask(formataçãoTelefone);

    return (
        <div className={styles.form_control}>
            {text && <label htmlFor={name}>{text}</label>}
            <input
                ref={inputRef}
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value || ''}
            />
        </div>
    );
}

export function InputImagem({ name, handleOnChange, text }) {
    return (
        <div className={styles.form_control}>
            {text && <label htmlFor={name}>{text}</label>}
            <input
                type="file"
                id={name}
                name={name}
                accept="image/*"
                onChange={handleOnChange}
                /* Correção: propriedade value foi removida por restrição do navegador */
            />
        </div>
    );
}

export default function Input({ type = "text", text, name, placeholder, handleOnChange, value, ...props }) {
    return (
        <div className={styles.form_control}>
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
