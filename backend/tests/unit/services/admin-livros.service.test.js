import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const modelMock = { alterarAtivoLivro: jest.fn() };

jest.mock("../../../src/api/common/models/livro.model.js", () => ({
  LivroModel: modelMock,
}));

const {
  LivrosService,
} = require("../../../src/api/admin/livros/livros.service.js");

describe("LivrosService.AlterarAtivoLivro", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("tira o livro da loja", async () => {
    modelMock.alterarAtivoLivro.mockResolvedValue({ id: 7, ativo: false });

    await expect(LivrosService.AlterarAtivoLivro("7", false)).resolves.toEqual(
      { id: 7, ativo: false },
    );
    expect(modelMock.alterarAtivoLivro).toHaveBeenCalledWith("7", false);
  });

  it("exige um valor booleano", async () => {
    await expect(
      LivrosService.AlterarAtivoLivro("7", "false"),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(modelMock.alterarAtivoLivro).not.toHaveBeenCalled();
  });

  it("responde 404 para livro inexistente", async () => {
    modelMock.alterarAtivoLivro.mockResolvedValue(null);

    await expect(
      LivrosService.AlterarAtivoLivro("999", true),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
