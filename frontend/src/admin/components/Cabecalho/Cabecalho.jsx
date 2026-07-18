import { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Cabecalho({ aoAbrirMenu }) {

    return (
        <AppBar position="fixed" sx={
            { 
                bgcolor: "custom.primaria", 
                color: "custom.superficie", minWidth: "100%",
                left: 0,
                top: 0,
                zIndex: (theme) => theme.zIndex.drawer + 1,
                padding: "2em" 
            }
            }>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={aoAbrirMenu}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon sx = {{fontSize: "2.5rem"}}/>
                </IconButton>

                <Typography
                    variant="h5"
                    component="div"
                    sx={{ flexGrow: 1, fontFamily: "Jacques rancois" }}>
                    Painel do Administrador
                </Typography>

                <Button color="inherit">Sair</Button>
            </Toolbar>
        </AppBar>
    );
}