import { useState } from "react"; 
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Box,
  Collapse
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function NavBarLateral({ aberto, aoFechar }) {
  const [funcionariosAberta, setFuncionariosAberta] = useState(false);

  const handleToggleFuncionarios = () => {
    setFuncionariosAberta(!funcionariosAberta);
  };

  return (
    <Box>
      <Drawer 
        anchor="left" 
        open={aberto} 
        onClose={aoFechar}
        sx={{
          [`& .MuiDrawer-paper`]: {
            pt: "120px",
            width: 250,
            bgcolor: "custom.superficie",
            height: "100%"
          },
        }} 
      >
        <Box
          sx={{ width: 250, bgcolor: "custom.superficie", height: "100%" }}
          role="presentation"
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText 
                  primary="Geral" 
                  sx={{ color: "custom.texto", paddingTop: "0.5em", paddingBottom: "0.5em" }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleToggleFuncionarios}>
                <ListItemText 
                  primary="Usuários" 
                  sx={{ color: "custom.texto", paddingTop: "0.5em", paddingBottom: "0.5em" }}
                />
                {funcionariosAberta ? (
                  <ExpandLess sx={{ color: "custom.textoMuted" }} />
                ) : (
                  <ExpandMore sx={{ color: "custom.textoMuted" }} />
                )}
              </ListItemButton>
            </ListItem>

            <Collapse in={funcionariosAberta} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Nova Postagem" sx={{ color: "custom.textoMuted" }} />
                </ListItemButton>
                
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Gerenciar Posts" sx={{ color: "custom.textoMuted" }} />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItem disablePadding>
              <ListItemButton onClick={handleToggleFuncionarios}>
                <ListItemText 
                  primary="Funcionarios" 
                  sx={{ color: "custom.texto", paddingTop: "0.5em", paddingBottom: "0.5em" }}
                />
                {funcionariosAberta ? (
                  <ExpandLess sx={{ color: "custom.textoMuted" }} />
                ) : (
                  <ExpandMore sx={{ color: "custom.textoMuted" }} />
                )}
              </ListItemButton>
            </ListItem>

            <Collapse in={funcionariosAberta} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Nova Postagem" sx={{ color: "custom.textoMuted" }} />
                </ListItemButton>
                
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Gerenciar Posts" sx={{ color: "custom.textoMuted" }} />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
