import {useState, createContext} from "react";
import { apiFetch } from "../../services/api";

export const AutorContext = createContext();

export const AutorProvider = ({children}) => {
    const [autores, setAutores] = useState([]);
    const [autor, setAutor] = useState(null);

    const getAutores = async() =>{
        try{
            const res = await apiFetch("/api/autores/", {method: "GET"});
            setAutores(res.data);
        }catch(err){
            console.error("Erro ao buscar autores", err);
        }
    }

    const getAutorById = async(id) =>{
        try{
            const res = await apiFetch(`/api/autores/${id}`, {method: "GET"});
            return res.data;
        }catch(err){
            console.error("Erro ao buscar autor", err);
        }
    }
    
    return(
        <AutorContext.Provider value={{ autores, setAutores, getAutores, getAutorById }}>
            {children}
        </AutorContext.Provider>
    );
}