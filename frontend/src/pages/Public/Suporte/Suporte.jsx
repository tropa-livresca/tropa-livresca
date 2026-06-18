import useSuporte from "../../../hooks/useSuporte";
import Input from "../../../components/form/Input/Inputr";
import { useState, useEffect } from "react";

export default function Suporte() {
    const { enviarEmail, isLoading, campos, setCampos, message } = useSuporte();

    const onInputChange = (e) => {
        setCampos((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(async () => {
        enviarEmail();
    }, []);

    return (
        <>
            <form onSubmit={onFormSubmit}>
                <label htmlFor="email">E-mail</label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="E-mail de destino"
                    onChange={onInputChange}
                />

                <label htmlFor="nome">Nome</label>
                <Input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Seu nome"
                    onChange={onInputChange}
                />

                <label htmlFor="mensagem">Mensagem</label>
                <Input
                    type="text"
                    id="mensagem"
                    name="mensagem"
                    placeholder="Sua mensagem"
                    onChange={onInputChange}
                />

                <Input
                    type="submit"
                    value={isLoading ? "Enviando..." : "Enviar"}
                    disabled={isLoading}
                />
            </form>        </>
    );
}