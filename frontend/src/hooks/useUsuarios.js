import {useState, useEffect} from 'react';
import {getUsuarios} from "../services";

export function useUsuarios(){
    const [usuarios, setUsuarios] = useState([]);

    useEffect(()=>{
        async function carregar(){
            const data = await getUsuarios();
            setUsuarios(data);
        }

        carregar();
    
    }, []);

    return usuarios;
}
