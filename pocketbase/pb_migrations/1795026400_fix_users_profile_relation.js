/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const profiles = app.findCollectionByNameOrId("users_profile");
    const users = app.findCollectionByNameOrId("users");
    const fieldNames = profiles.fields.fieldNames();

    if (!fieldNames.includes("telefone")) {
      profiles.fields.add(
        new TextField({
          id: "text5890000002",
          name: "telefone",
          required: false,
        }),
      );
    }

    if (!fieldNames.includes("email")) {
      profiles.fields.add(
        new EmailField({
          id: "email5890000003",
          name: "email",
          required: false,
        }),
      );
    }

    profiles.fields.add(
      new RelationField({
        cascadeDelete: false,
        collectionId: users.id,
        help: "",
        hidden: false,
        id: "relation5890000001",
        maxSelect: 1,
        minSelect: 0,
        name: "auth_user",
        presentable: false,
        required: false,
        system: false,
      }),
    );
    profiles.fields.getByName("telefone").required = false;
    profiles.fields.getByName("email").required = false;
    profiles.fields.getByName("is_admin").required = false;
    profiles.fields.getByName("primeiro_acesso").required = false;

    return app.save(profiles);
  },
  (app) => {
    const profiles = app.findCollectionByNameOrId("users_profile");
    const fieldNames = profiles.fields.fieldNames();

    profiles.fields.removeById("relation5890000001");
    profiles.fields.getByName("is_admin").required = true;
    profiles.fields.getByName("primeiro_acesso").required = true;

    if (
      fieldNames.includes("telefone") &&
      profiles.fields.getByName("telefone").id === "text5890000002"
    ) {
      profiles.fields.removeById("text5890000002");
    }

    if (
      fieldNames.includes("email") &&
      profiles.fields.getByName("email").id === "email5890000003"
    ) {
      profiles.fields.removeById("email5890000003");
    }

    return app.save(profiles);
  },
);
