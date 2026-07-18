import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Box 
} from "@mui/material";


export default function NavBarLateral ({ aberto, aoFechar }) {
  return (
    <Box>
      <Drawer 
        anchor="left" 
        open={aberto} 
        onClose={aoFechar}
        sx = {
          {
            [`& .MuiDrawer-paper`]:{
              pt: "64px",
              width: 250,
              bgcolor: "custom.superficie",
              height: "100%"
            },
          }
        } 
      >
        <Box
          sx={{ width: 250, bgcolor: "custom.superficie", height: "100%" }}
          role="presentation"
          onClick={aoFechar}
        >
          <List>
            {["Geral", "Postagens", "Configurações", "Sair"].map((texto) => (
              <ListItem key={texto} disablePadding>
                <ListItemButton>
                  <ListItemText 
                    primary={texto} 
                    sx={{ color: "custom.texto" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};
