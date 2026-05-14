import React from "react";
import styles from "./Input.module.css";
import { useMask } from '@react-input/mask';

/**
 * Componente de Input reutilizável com Label integrado
 * 
 * @component
 * @param {object} props 
 * @param {string} props.type - O tipo do input
 * @param {string} props.text - O texto do label
 * @param {string} props.name - O atributo name e id do input
 * @param {string} props.placeholder - O texto que indica o que deve ser preenchido
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.handleOnChange - O atributo que evoca a função de atualizar o estado do value
 * @param {string|number} props.value - O valor atual do campo (controlado)
 * @returns {JSX.Element}
 */


const formataçãoTelefone = 
{
    mask: '(__) _____-____',
    replacement: { _: /\d/ },
}

export function InputTelefone({type, text, name, placeholder, handleOnChange, value}){
    const inputRef = useMask(formataçãoTelefone)

    return(
        <div className = {styles.form_control}>
            <label htmlFor = {name}> {text} </label>
            <input
                ref = {inputRef}
                type = {type}
                id = {name}
                name = {name}
                placeholder = {placeholder}
                onChange = {handleOnChange}
                value = {value||''}
            />
        </div>
    );
}

export default function Input({type, text, name, placeholder, handleOnChange, value}){
    return(
        <div className = {styles.form_control}>
            <label htmlFor = {name}> {text} </label>
            <input
                type = {type}
                id = {name}
                name = {name}
                placeholder = {placeholder}
                onChange = {handleOnChange}
                value = {value||''}
            />
        </div>
    );
}

//llkjlk