import {useContext} from "react";

import {AutorContext} from "../context/autor/Autor";

const useAutor = () => {
    const context = useContext(AutorContext);
    
    return context;
}