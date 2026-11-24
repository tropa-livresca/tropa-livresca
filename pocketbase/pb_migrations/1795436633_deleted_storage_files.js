/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2195043336");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3479234172",
        "max": 0,
        "min": 0,
        "name": "owner",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3879679654",
        "max": 0,
        "min": 0,
        "name": "bucket",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text190089999",
        "max": 0,
        "min": 0,
        "name": "path",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "file2359244304",
        "maxSelect": 1,
        "maxSize": 52428800,
        "mimeTypes": [
          "image/jpeg",
          "image/png",
          "application/pdf"
        ],
        "name": "file",
        "presentable": false,
        "protected": true,
        "required": true,
        "system": false,
        "thumbs": [],
        "type": "file"
      }
    ],
    "id": "pbc_2195043336",
    "indexes": [
      "CREATE UNIQUE INDEX idx_storage_files_bucket_path ON storage_files (bucket, path)"
    ],
    "listRule": null,
    "name": "storage_files",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
})
