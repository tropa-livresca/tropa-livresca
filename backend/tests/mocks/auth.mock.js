import { jest } from "@jest/globals";

export const mockUserIntegration = { id: "user-integration-123" };

export const authMiddlewareMock = {
  checkAuth: jest.fn((req, res, next) => {
    req.user = mockUserIntegration;
    next();
  }),
  verificarAutenticacaoAdm: jest.fn((req, res, next) => {
    req.user = mockUserIntegration;
    req.adm = mockUserIntegration;
    next();
  }),
};
