const router = require("express");
const rotaUsuario = router();
const controleUsuario = require("../controles/controleUsuario");

rotaUsuario.get("/", controleUsuario.GetListarUsuario);

module.exports = rotaUsuario;