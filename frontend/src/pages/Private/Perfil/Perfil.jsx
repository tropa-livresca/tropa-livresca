import { apiFetch } from "../../../services/api";
import Input from "../../../components/form/Input/Input";
import {useEffect, useState} from "react";

export default function Perfil(){
    const [perfil, setPerfil] = useState(null);
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [imagem, setImagem] = useState(null);

    useEffect(() =>{
        const getPerfil = async () => {
            try{
                const response = await apiFetch('/perfil');
                setPerfil(response);
            }catch(error){
                console.error("Error recolher os dados do supabase", error);
            }
        }

        const updatePerfil = async () => {
            try{
                const response = await apiFetch('/perfil', {
                    method: 'PUT',
                    body: JSON.stringify({  nome: nome, telefone: telefone, imagem: imagem }),
                    headers: { 'Content-Type': 'application/json' },
                });
                setPerfil(response);
            }catch(error){
                console.error("Error recolher os dados do supabase", error);
            }
        }
    }, []);

    const handleSubmit = (e) =>{
        e.preventDefault();
        updatePerfil();        
    }

    return(
        <>
            <h1>Bem-vindo ao seu perfil!</h1>
            {perfil && (
                <div>
                    <p>Nome: {perfil.nome}</p>
                    <p>Telefone: {perfil.telefone}</p>
                    {perfil.imagem && <img src={perfil.imagem} alt="Imagem de perfil" />}
                    <form onSubmit={handleSubmit}>
                        <Input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                        <Input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                        <Input type="file" placeholder="Imagem" value={imagem} onChange={(e) => setImagem(e.target.value)} />
                        <button type="submit">Atualizar Perfil</button>
                    </form>
                </div>
            )}
        </>
        
    );
}