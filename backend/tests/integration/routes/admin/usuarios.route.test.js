import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

jest.mock("../../../../src/api/admin/usuarios/usuarios.controller.js", () => {
  const handler = (name) => (_req, res) => res.json({ handler: name });

  return {
    UsuariosController: {
      buscarUsuarios: handler("buscarUsuarios"),
      BuscarUsuarioById: handler("BuscarUsuarioById"),
      inativarFuncionario: handler("inativarFuncionario"),
      alterarIsMasterFuncionario: handler("alterarIsMasterFuncionario"),
      promoverUsuario: handler("promoverUsuario"),
    },
  };
});

const request = require("supertest");
const router =
  require("../../../../src/api/admin/usuarios/usuarios.route.js").default;
const { createApp } = require("../../../helpers/createApp.js");
const app = createApp(router);

describe("Rotas administrativas de usuários", () => {
  it("encaminha GET / para buscarUsuarios", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body).toEqual({ handler: "buscarUsuarios" });
  });

  it("encaminha GET /:id para BuscarUsuarioById", async () => {
    const response = await request(app).get("/42").expect(200);

    expect(response.body).toEqual({ handler: "BuscarUsuarioById" });
  });

  it.each([
    ["/42/inativar", "inativarFuncionario"],
    ["/42/master", "alterarIsMasterFuncionario"],
    ["/42/promover", "promoverUsuario"],
  ])("encaminha PATCH %s", async (path, handler) => {
    const response = await request(app).patch(path).send({}).expect(200);

    expect(response.body).toEqual({ handler });
  });
});
