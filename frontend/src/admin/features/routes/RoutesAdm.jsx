import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainLayout from "../../components/MainLayout/MainLayout";
import useAuth from "../../../common/hooks/useAuth";

const tema = createTheme({
    palette: {
        background: {
            default: "#fff8c9",
            paper: "#fffcf4",
        },
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
        fontFamily: ["Inter", "sans-serif"].join(","),
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
    },
});

const Private = ({ Item, redirectTo = "/auth/login" }) => {
  const { signed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return signed ? (
    <Item />
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} replace />
  );
};

const RoutesAdm = () => {
    return (
        <ThemeProvider theme={tema}>
            <CssBaseline />
            <MainLayout>             
                <Routes>
                    <Route/>
                </Routes>
            </MainLayout>
        </ThemeProvider>
    );
};

export default RoutesAdm;
