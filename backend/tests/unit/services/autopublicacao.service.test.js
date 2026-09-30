import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const modelMock = {
  buscarDetalhesPorId: jest.fn(),
  criarLivro: jest.fn(),
  atualizarLivro: jest.fn(),
  deletarLivro: jest.fn(),
};

const storageMock = {
  STORAGE_BUCKET: {
    CAPAS: "capa-livros",
    MANUSCRITOS: "manuscrito-livro",
  },
  criarPathUpload: jest.fn(({ userId, tipo, extensao }) => ({
    bucket: tipo === "manuscrito" ? "manuscrito-livro" : "capa-livros",
    path: `${userId}/livro_${tipo}.` + extensao,
  })),
  criarUrlAssinada: jest.fn(
    async (_bucket, path) => `https://signed.test/${path}`,
  ),
  normalizarCaminhoPersistido: jest.fn((value) => value || null),
  obterRegraArquivo: jest.fn((tipo) => ({
    bucket: tipo === "manuscrito" ? "manuscrito-livro" : "capa-livros",
  })),
  removerArquivos: jest.fn(async () => undefined),
  validarArquivoArmazenado: jest.fn(async () => undefined),
  validarMetadadosUpload: jest.fn(() => ({
    regra: { bucket: "manuscrito-livro" },
    extensao: "pdf",
  })),
  validarPathDoUsuario: jest.fn((path, userId) => {
    if (!path.startsWith(`${userId}/`)) {
      const error = new Error("Path de outro usuário.");
      error.statusCode = 403;
      throw error;
    }
    return path;
  }),
};

jest.mock("../../../src/api/common/models/autopublicacao.model.js", () => ({
  AutopublicacaoModel: modelMock,
}));
jest.mock("../../../src/api/common/config/storage.js", () => storageMock);
jest.mock("../../../src/api/common/config/supabase.js", () => ({
  default: {},
  supabaseAdmin: {
    storage: {
      from: jest.fn(() => ({
        createSignedUploadUrl: jest.fn(async (path) => ({
          data: { token: "upload-token", path },
          error: null,
        })),
      })),
    },
  },
}));

const {
  AutopublicacaoService,
} = require("../../../src/api/clients/autopublicacao/autopublicacao.service.js");

const livroBase = {
  id: 10,
  estado: "rascunho",
  fk_user_profile_id: "user-1",
  capa: {
    frente: "user-1/capa-frente.png",
    verso: "user-1/capa-verso.png",
    orelhas: "user-1/capa-orelhas.png",
  },
  manuscrito: "user-1/manuscrito.pdf",
  titulo: "Livro",
  idioma: "portugues",
  categoria: "Fantasia",
  ativo: true,
};

const dadosLivro = {
  detalhes: {
    idioma: "portugues",
    categoria: "Fantasia",
    titulo: "Livro",
    subtitulo: "Subtitulo",
    autor: { nome: "Autor", sobrenome: "Teste" },
  },
  orcamento: {
    numeroPaginas: "10",
    valorLivroDigital: "10",
    valorLivroFisico: "20",
  },
};

describe("AutopublicacaoService - Storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejeita upload com MIME incompatível", async () => {
    storageMock.validarMetadadosUpload.mockImplementationOnce(() => {
      const error = new Error("Tipo MIME de arquivo não permitido.");
      error.statusCode = 400;
      throw error;
    });

    await expect(
      AutopublicacaoService.criarUploadLivro({
        userId: "user-1",
        tipo: "manuscrito",
        extensao: "pdf",
        mimeType: "image/png",
        tamanho: 100,
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("persiste paths e não URL assinada ao criar um livro", async () => {
    modelMock.criarLivro.mockResolvedValue({
      ...livroBase,
      capa: {
        frente: "user-1/capa-frente.png",
        verso: null,
        orelhas: null,
      },
      manuscrito: "user-1/manuscrito.pdf",
    });

    await AutopublicacaoService.criarLivro({
      userId: "user-1",
      dadosLivro,
      capaPaths: { frente: "user-1/capa-frente.png" },
      manuscritoPath: "user-1/manuscrito.pdf",
    });

    const [dadosPersistidos] = modelMock.criarLivro.mock.calls[0];
    expect(dadosPersistidos.manuscrito).toBe("user-1/manuscrito.pdf");
    expect(dadosPersistidos.manuscrito).not.toContain("http");
    expect(dadosPersistidos.capa.frente).toBe("user-1/capa-frente.png");
  });

  it("serializa palavras-chave no tipo text definido pelo schema", async () => {
    modelMock.criarLivro.mockResolvedValue(livroBase);

    await AutopublicacaoService.criarLivro({
      userId: "user-1",
      dadosLivro: {
        ...dadosLivro,
        detalhes: {
          ...dadosLivro.detalhes,
          palavrasChave: [" fantasia ", "aventura"],
        },
      },
    });

    const [dadosPersistidos] = modelMock.criarLivro.mock.calls[0];
    expect(dadosPersistidos.palavras_chave).toBe("fantasia; aventura");
  });

  it("mantém os paths ao editar sem novo arquivo", async () => {
    modelMock.buscarDetalhesPorId.mockResolvedValue(livroBase);
    modelMock.atualizarLivro.mockResolvedValue(livroBase);

    await AutopublicacaoService.atualizarLivro({
      userId: "user-1",
      livroId: 10,
      dadosLivro,
    });

    const [, , , dadosPersistidos] = modelMock.atualizarLivro.mock.calls[0];
    expect(dadosPersistidos.manuscrito).toBe("user-1/manuscrito.pdf");
    expect(dadosPersistidos.capa.frente).toBe("user-1/capa-frente.png");
    expect(storageMock.removerArquivos).not.toHaveBeenCalled();
  });

  it("remove o arquivo antigo quando um manuscrito é substituído", async () => {
    modelMock.buscarDetalhesPorId.mockResolvedValue(livroBase);
    modelMock.atualizarLivro.mockResolvedValue({
      ...livroBase,
      manuscrito: "user-1/novo-manuscrito.pdf",
    });

    await AutopublicacaoService.atualizarLivro({
      userId: "user-1",
      livroId: 10,
      dadosLivro,
      manuscritoPath: "user-1/novo-manuscrito.pdf",
    });

    expect(storageMock.removerArquivos).toHaveBeenCalledWith(
      "manuscrito-livro",
      ["user-1/manuscrito.pdf"],
    );
  });

  it("remove os arquivos associados ao excluir um livro", async () => {
    modelMock.deletarLivro.mockResolvedValue(livroBase);

    await AutopublicacaoService.deletarLivroRascunho(10, "user-1");

    expect(storageMock.removerArquivos).toHaveBeenCalledWith(
      "capa-livros",
      expect.arrayContaining(["user-1/capa-frente.png"]),
    );
    expect(storageMock.removerArquivos).toHaveBeenCalledWith(
      "manuscrito-livro",
      ["user-1/manuscrito.pdf"],
    );
  });

  it("rejeita path pertencente a outro usuário", async () => {
    await expect(
      AutopublicacaoService.criarLivro({
        userId: "user-1",
        dadosLivro,
        manuscritoPath: "user-2/manuscrito.pdf",
      }),
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});
