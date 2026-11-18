import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const mockCriarLivro = jest.fn();
const mockAtualizarLivro = jest.fn();

jest.mock(
  "../../../src/api/clients/autopublicacao/autopublicacao.service.js",
  () => ({
    AutopublicacaoService: {
      criarLivro: mockCriarLivro,
      atualizarLivro: mockAtualizarLivro,
    },
  }),
);

const { AutopublicacaoController } = require(
  "../../../src/api/clients/autopublicacao/autopublicacao.controller.js",
);

describe("AutopublicacaoController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("converte dadosLivro multipart para objeto antes de criar o registro", async () => {
    const dadosLivro = {
      detalhes: { titulo: "Livro" },
      orcamento: { valorLivroDigital: "10" },
    };
    const resultado = { data: { id: "livro-1" } };
    const req = {
      user: { id: "usuario-1" },
      body: {
        dadosLivro: JSON.stringify(dadosLivro),
        estadoInicial: "rascunho",
      },
      files: { manuscrito: [{ originalname: "manuscrito.pdf" }] },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    mockCriarLivro.mockResolvedValue(resultado);

    await AutopublicacaoController.criarLivro(req, res, next);

    expect(mockCriarLivro).toHaveBeenCalledWith({
      userId: "usuario-1",
      dadosLivro,
      estadoInicial: "rascunho",
      arquivos: req.files,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(resultado);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejeita dadosLivro multipart com JSON inválido", async () => {
    const req = {
      user: { id: "usuario-1" },
      body: { dadosLivro: "{inválido" },
    };
    const next = jest.fn();

    await AutopublicacaoController.criarLivro(req, {}, next);

    expect(mockCriarLivro).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Os dados do livro não estão em um JSON válido.",
      }),
    );
  });
});
