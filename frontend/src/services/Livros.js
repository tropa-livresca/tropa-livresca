
import { createContext, useState, useEffect } from "react";
import { apiFetch } from "./api";

    

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

export const GetLivrosDeAutor = async (userId) =>{
   try{
    console.log("a");
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

