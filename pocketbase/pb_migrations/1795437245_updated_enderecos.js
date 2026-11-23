/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2556814402");

    // add field
    collection.fields.addAt(
      11,
      new Field({
        cascadeDelete: false,
        collectionId: "_pb_users_auth_",
        help: "",
        hidden: false,
        id: "relation1308351067",
        maxSelect: 0,
        minSelect: 0,
        name: "fk_user_profile_id",
        presentable: false,
        required: false,
        system: false,
        type: "relation",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2556814402");

    // remove field
    collection.fields.removeById("relation1308351067");

    return app.save(collection);
  },
);
