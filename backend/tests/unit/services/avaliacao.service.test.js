import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const modelMock = {
  buscarResumoLivro: jest.fn(),
  buscarAvaliacaoUsuario: jest.fn(),
  usuarioComprouLivro: jest.fn(),
  salvarAvaliacao: jest.fn(),
};

jest.mock("../../../src/api/common/models/avaliacao.model.js", () => ({
  AvaliacaoModel: modelMock,
}));

const {
  AvaliacaoService,
} = require("../../../src/api/clients/avaliacoes/avaliacao.service.js");

describe("AvaliacaoService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("salva a avaliação de quem comprou o livro", async () => {
    modelMock.usuarioComprouLivro.mockResolvedValue(true);
    modelMock.salvarAvaliacao.mockResolvedValue({ id: 1, qtd_estrelas: 4 });

    await AvaliacaoService.salvarAvaliacao("user-1", "15", 4);

    expect(modelMock.salvarAvaliacao).toHaveBeenCalledWith("user-1", 15, 4);
  });

  it("recusa quem não comprou o livro", async () => {
    modelMock.usuarioComprouLivro.mockResolvedValue(false);

    await expect(
      AvaliacaoService.salvarAvaliacao("user-1", 15, 5),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(modelMock.salvarAvaliacao).not.toHaveBeenCalled();
  });

  it.each([0, 6, 3.5, "abc", undefined])(
    "recusa %p estrelas",
    async (estrelas) => {
      await expect(
        AvaliacaoService.salvarAvaliacao("user-1", 15, estrelas),
      ).rejects.toMatchObject({ statusCode: 400 });
    },
  );

  it("recusa livro inválido", async () => {
    await expect(
      AvaliacaoService.buscarResumoLivro("abc"),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("informa a avaliação do usuário e se ele pode avaliar", async () => {
    modelMock.buscarAvaliacaoUsuario.mockResolvedValue(null);
    modelMock.usuarioComprouLivro.mockResolvedValue(true);

    await expect(
      AvaliacaoService.buscarAvaliacao("user-1", 15),
    ).resolves.toEqual({ avaliacao: null, podeAvaliar: true });
  });
});
