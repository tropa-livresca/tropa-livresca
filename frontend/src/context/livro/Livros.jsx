import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../../services/api";

const LivroContext = createContext(); 

export const LivroProvider = ({ children }) => {
  const [livros, setLivros] = useState([]);
  export const GetLivros = async () =>{
   try{
     const res = await apiFetch("/api/livros/", {Method: "Get"});

     const data = await res.json();
     console.log(data);

     if(!res.ok){
      return data.error;
     }

     return data;

   }catch{
     return "error";
   }
}

 return (
    <LivroContext.Provider
      value={{
        livros,
        setLivros,
        GetLivros,
      }}
    >
      {children}
    </LivroContext.Provider>
  );
      
}
