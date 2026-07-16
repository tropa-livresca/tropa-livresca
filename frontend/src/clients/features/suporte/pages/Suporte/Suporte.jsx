import useSuporte from "../../hooks/useSuporte";

import Input from "../../../../../common/components/Input/Input";
import Select from "../../../../../common/components/Select/Select";

export default function Suporte() {
    const {
        error,
        email,
        setEmail,
        telefone,
        setTelefone,
        nome,
        setNome,
        mensagem,
        setMensagem,
        enviarEmail,
        carregando
    } = useSuporte();

    const handleSubmit = async (e) => {
        e.preventDefault();
        enviarEmail();
    };

    const motivos = ["Problemas de Autopublicação", "Problemas ao receber", "Dúvidas"];

    return (
        <form onSubmit={handleSubmit} method="POST">

            {error?.text && (
                <p style={{ color: error.success ? 'green' : 'red' }}>
                    {error.text}
                </p>
            )}

            <label htmlFor="email">E-mail</label>
            <Input
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="E-mail de destino"
                handleOnChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="telefone">Celular</label>
            <Input
                type="tel"
                id="telefone"
                name="telefone"
                value={telefone}
                placeholder="Telefone de contato"
                handleOnChange={(e) => setTelefone(e.target.value)}
            />

            <label htmlFor="nome">Nome</label>
            <Input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                placeholder="Seu nome"
                handleOnChange={(e) => setNome(e.target.value)}
            />

            <Select 
            text= "Motivo de contato" 
            name = "motivo" 
            value = {motivo} 
            options = {motivos}
            handleOnChange = {(e) => {setMotivo(e.target.value)}}
            />

            <label htmlFor="mensagem">Mensagem</label>
            <Input
                type="text"
                id="mensagem"
                name="mensagem"
                value={mensagem}
                placeholder="Sua mensagem"
                handleOnChange={(e) => setMensagem(e.target.value)}
            />

            <button type="submit" disabled={carregando}>
                {carregando ? "Enviando..." : "Enviar"}
            </button>
        </form>
    );
}
