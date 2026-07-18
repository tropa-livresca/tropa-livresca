import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles"; 
import Teste from "../painelBlog/pages/Teste/Teste";

const tema = createTheme({
  palette: {
    custom: {
      fundo: "#fff8c9",          
      superficie: "#fffcf4",
      superficieClara: "#fffdf7",
      primaria: "#4d1f18",
      primariaHover: "#6a2b22",
      primariaAlt: "#5a1e14",
      dourado: "#d4b46a",
      douradoEscuro: "#c8a45c",
      texto: "#432c28",
      textoMuted: "#7a6a5b",
    },
  },
  
  typography: {
    fontFamily: ["Inter", "serif"].join(","),
  },

  h1: {
    fontFamily: ["Jacques Francois", "serif"].join(","),
    fontSize: "3rem",
  },

  h2: {
    fontFamily: ["Jacques Francois", "serif"].join(","),
    fontSize: "2.5rem",
  },

  h3: {
    fontFamily: ["Jacques Francois", "serif"].join(","),
    fontSize: "2rem",
  },
});

const RoutesAdm = () => {
  return (
    <ThemeProvider theme={tema}>
      <Routes>
        <Route path="/painelBlog" element={<Teste />} />
      </Routes>
    </ThemeProvider>
  );
};

export default RoutesAdm;
