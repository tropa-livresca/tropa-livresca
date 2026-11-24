/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1603080800")

  // remove field
  collection.fields.removeById("text3035632933")

  // remove field
  collection.fields.removeById("json1414008542")

  // add field
  collection.fields.addAt(17, new Field({
    "help": "",
    "hidden": false,
    "id": "file3035632933",
    "maxSelect": 0,
    "maxSize": 52428800,
    "mimeTypes": [
      "application/pdf"
    ],
    "name": "manuscrito",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "help": "",
    "hidden": false,
    "id": "file3228451811",
    "maxSelect": 0,
    "maxSize": 10485760,
    "mimeTypes": [
      "image/png",
      "image/jpeg"
    ],
    "name": "capa_frente",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1603080800")

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3035632933",
    "max": 0,
    "min": 0,
    "name": "manuscrito",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "help": "",
    "hidden": false,
    "id": "json1414008542",
    "maxSize": 0,
    "name": "capa",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("file3035632933")

  // remove field
  collection.fields.removeById("file3228451811")

  return app.save(collection)
})
