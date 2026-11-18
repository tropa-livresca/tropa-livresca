/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2556683188");

    // add field
    collection.fields.addAt(
      10,
      new Field({
        cascadeDelete: false,
        collectionId: "pbc_2556683188",
        help: "",
        hidden: false,
        id: "relation577089629",
        maxSelect: 0,
        minSelect: 0,
        name: "usuario",
        presentable: false,
        required: false,
        system: false,
        type: "relation",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2556683188");

    // remove field
    collection.fields.removeById("relation577089629");

    return app.save(collection);
  },
);
