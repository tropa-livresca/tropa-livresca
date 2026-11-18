/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const profiles = app.findCollectionByNameOrId("users_profile");
  if (!profiles.fields.fieldNames().includes("funcao")) {
    profiles.fields.add(new TextField({ name: "funcao" }));
  }
  const authUsers = app.findCollectionByNameOrId("_pb_users_auth_");
  const usuarioRelation = profiles.fields.getByName("usuario");
  if (usuarioRelation) {
    usuarioRelation.collectionId = authUsers.id;
  }
  app.save(profiles);

  const reviews = app.findCollectionByNameOrId("revisoes");
  if (!reviews.fields.fieldNames().includes("arquivo")) {
    reviews.fields.add(new TextField({ name: "arquivo" }));
  }
  app.save(reviews);

  const movements = app.findCollectionByNameOrId("movimentacoes_financeiras");
  if (!movements.fields.fieldNames().includes("dados_bancarios")) {
    movements.fields.add(new JSONField({ name: "dados_bancarios" }));
  }
  app.save(movements);

  const collection = new Collection({
    type: "base",
    name: "storage_files",
    fields: [
      { type: "text", name: "owner", required: true },
      { type: "text", name: "bucket", required: true },
      { type: "text", name: "path", required: true },
      {
        type: "file",
        name: "file",
        required: true,
        maxSelect: 1,
        maxSize: 52428800,
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
        protected: true,
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_storage_files_bucket_path ON storage_files (bucket, path)",
    ],
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("storage_files");
  app.delete(collection);

  const profiles = app.findCollectionByNameOrId("users_profile");
  profiles.fields.removeByName("funcao");
  app.save(profiles);

  const reviews = app.findCollectionByNameOrId("revisoes");
  reviews.fields.removeByName("arquivo");
  app.save(reviews);

  const movements = app.findCollectionByNameOrId("movimentacoes_financeiras");
  movements.fields.removeByName("dados_bancarios");
  return app.save(movements);
});
