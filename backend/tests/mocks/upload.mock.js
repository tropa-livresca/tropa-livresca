import { jest } from "@jest/globals";

export const uploadMiddlewareMock = {
  upload: {
    single: jest.fn(() => (req, res, next) => {
      req.body = req.body || {};
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        req.file = {
          originalname: "avatar.jpg",
          buffer: Buffer.from("fake-binary-data"),
          mimetype: "image/jpeg",
        };
      }
      next();
    }),
    any: jest.fn(() => (req, res, next) => {
      next();
    }),
  },
};
