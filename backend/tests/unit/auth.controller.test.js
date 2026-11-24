import { jest } from "@jest/globals";

const mockAuthCollection = {
  create: jest.fn(),
  requestVerification: jest.fn(),
  authWithPassword: jest.fn(),
  authRefresh: jest.fn(),
};
const mockProfileCollection = {
  getFirstListItem: jest.fn(),
};
const mockPocketBaseClient = {
  autoCancellation: jest.fn(),
  authStore: {
    save: jest.fn(),
  },
  collection: jest.fn(() => mockAuthCollection),
};
const mockPocketBase = jest.fn(() => mockPocketBaseClient);
const mockAdminPocketBase = {
  collection: jest.fn(() => mockProfileCollection),
  filter: jest.fn(() => "auth_user = user-1"),
};

jest.unstable_mockModule("pocketbase", () => ({
  default: mockPocketBase,
}));
jest.unstable_mockModule("../../src/api/common/config/environment.js", () => ({
  POCKETBASE_URL: "http://localhost:8090",
  FRONTEND_URL: "http://localhost:5173",
  BACKEND_URL: "http://localhost:3000",
}));
jest.unstable_mockModule("../../src/api/common/config/pocketbase.js", () => ({
  criarClienteAdminPocketBase: () => mockAdminPocketBase,
}));

const { AuthController } =
  await import("../../src/api/common/auth/auth.controller.js");

const criarResposta = () => {
  const res = {
    cookie: jest.fn(),
    json: jest.fn(),
    status: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
};

describe("AuthController session handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthCollection.authWithPassword.mockResolvedValue({
      token: "auth-token",
      record: { id: "user-1", email: "user@example.test", verified: true },
    });
    mockAuthCollection.authRefresh.mockResolvedValue({
      token: "refreshed-token",
      record: { id: "user-1", email: "user@example.test" },
    });
    mockProfileCollection.getFirstListItem.mockResolvedValue({
      id: "profile-1",
      auth_user: "user-1",
      is_admin: false,
    });
  });

  it("supports the Express signin handler without a class context", async () => {
    const res = criarResposta();
    const next = jest.fn();

    await AuthController.signin(
      { body: { email: "user@example.test", password: "password" } },
      res,
      next,
    );

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ id: "user-1" }),
      }),
    );
  });

  it("saves the phone number on the PocketBase user during signup", async () => {
    const user = {
      id: "user-1",
      email: "user@example.test",
      nome: "Ana",
      sobrenome: "Silva",
    };
    mockAuthCollection.create.mockResolvedValue(user);
    mockAuthCollection.requestVerification.mockResolvedValue(undefined);
    const res = criarResposta();
    const next = jest.fn();

    await AuthController.signup(
      {
        body: {
          email: user.email,
          password: "password",
          telefone: "(11) 99999-9999",
          nome: user.nome,
          sobrenome: user.sobrenome,
        },
      },
      res,
      next,
    );

    expect(next).not.toHaveBeenCalled();
    expect(mockAuthCollection.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: user.email,
        telefone: "(11) 99999-9999",
      }),
    );
  });

  it("supports the Express setSession handler without a class context", async () => {
    const res = criarResposta();
    const next = jest.fn();

    await AuthController.setSession(
      { body: { token: "existing-token" } },
      res,
      next,
    );

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ id: "user-1" }),
      }),
    );
  });
});
