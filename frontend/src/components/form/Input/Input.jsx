import React from "react";
import styles from "./Input.module.css";
import { useMask } from '@react-input/mask';

const formataçãoTelefone =
{
    mask: '(__) _____-____',
    replacement: { _: /\d/ },
}

export function InputTelefone({ type, text, name, placeholder, handleOnChange, value }) {
    const inputRef = useMask(formataçãoTelefone)

    return (
        <div className={styles.form_control}>
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

export function InputImagem({ type, name, placeholder, handleOnChange, value }) {
    return (
        <div className={styles.form_control}>
            <input
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

export default function Input({ type, text, name, placeholder, handleOnChange, value }) {
    return (
        <div className={styles.form_control}>
            <input
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
