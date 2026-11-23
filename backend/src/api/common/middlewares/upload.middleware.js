import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export const uploadLivro = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
}).fields([
  { name: "manuscrito", maxCount: 1 },
  { name: "capa_frente", maxCount: 1 },
  { name: "capa_verso", maxCount: 1 },
]);
