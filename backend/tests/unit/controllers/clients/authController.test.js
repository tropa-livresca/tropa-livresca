import { AuthController } from "../../../../src/api/clients/auth/auth.controller.js";
import { AuthService } from "../../../../src/api/clients/auth/auth.service.js";

jest.mock("../../../../src/api/clients/auth/auth.service.js", () => ({
  AuthService: {
    signinComGoogle: jest.fn(),
  },
}));

describe("AuthController.signinComGoogle", () => {
  it("deve retornar erro 502 quando o OAuth não fornecer uma URL", async () => {
    AuthService.signinComGoogle.mockResolvedValue({});

    const req = {
      body: {},
      query: {},
      protocol: "http",
      get: () => "localhost:3000",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await AuthController.signinComGoogle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("Não foi possível gerar"),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
