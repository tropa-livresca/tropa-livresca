/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const profiles = app.findCollectionByNameOrId("users_profile");
    if (!profiles.fields.fieldNames().includes("funcao")) {
      profiles.fields.add(new TextField({ name: "funcao" }));
    }
    /*const authUsers = app.findCollectionByNameOrId("_pb_users_auth_");
  const usuarioRelation = profiles.fields.getByName("usuario");
  if (usuarioRelation) {
    usuarioRelation.collectionId = authUsers.id;
  }
    */
    app.save(profiles);

    const reviews = app.findCollectionByNameOrId("revisoes");
    if (!reviews.fields.fieldNames().includes("arquivo")) {
      reviews.fields.add(
        new FileField({
          name: "arquivo",
          maxSelect: 0,
          maxSize: 0,
          mimeTypes: ["application/pdf"],
          protected: false,
          required: false,
        }),
      );
    }
    app.save(reviews);

    const movements = app.findCollectionByNameOrId("movimentacoes_financeiras");
    if (!movements.fields.fieldNames().includes("dados_bancarios")) {
      movements.fields.add(new JSONField({ name: "dados_bancarios" }));
    }
    return app.save(movements);
  },
  (app) => {
    const profiles = app.findCollectionByNameOrId("users_profile");
    profiles.fields.removeByName("funcao");
    app.save(profiles);

    const reviews = app.findCollectionByNameOrId("revisoes");
    reviews.fields.removeByName("arquivo");
    app.save(reviews);

    const movements = app.findCollectionByNameOrId("movimentacoes_financeiras");
    movements.fields.removeByName("dados_bancarios");
    return app.save(movements);
  },
);
