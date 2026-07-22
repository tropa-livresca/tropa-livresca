import {useState} from "react";
import { Container } from "@mui/material";
import Cabecalho from "../Cabecalho/Cabecalho";
import NavBarLateral from "../NavBarLateral/NavBarLateral";

export default function MainLayout({children}) {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <>
            <Cabecalho aoAbrirMenu = {()=> setMenuAberto(!menuAberto)}/>

            <NavBarLateral aberto = {menuAberto} aoFechar = {() => setMenuAberto(false)}/>

            <Container
                sx={
                    {
                        display: "grid",
                        alignItems: "start",
                        justifyContent: "left",
                        py: 2,
                        px: 4,
                        minHeight: "100vh",
                        pt: 20,
                        minHeight: "100vh",
                    }
                }
            >
                {children}
            </Container>
        </>
    );
}