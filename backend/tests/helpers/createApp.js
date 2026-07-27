import express from "express";

export function createApp(router) {
  const app = express();

  app.use(express.json());

  app.use(router);

  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
  });

  return app;
}