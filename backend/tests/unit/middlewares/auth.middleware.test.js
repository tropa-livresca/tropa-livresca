import { createRequire } from "node:module";
import { jest } from "@jest/globals";

const require = createRequire(import.meta.url);

jest.mock("../../../src/api/common/config/supabase.js", () => ({
  __esModule: true,
  default: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

const {
  checkAuth,
} = require("../../../src/api/common/middlewares/auth.middleware.js");
const supabase = require("../../../src/api/common/config/supabase.js").default;

describe("checkAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve responder 401 quando não houver token", async () => {
    const req = { cookies: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Token de autenticação não fornecido.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve encaminhar para o próximo middleware quando o token for válido", async () => {
    const req = { cookies: { "auth-token": "token-valido" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    await checkAuth(req, res, next);

    expect(req.user).toEqual({ id: "user-1" });
    expect(next).toHaveBeenCalled();
  });
});
