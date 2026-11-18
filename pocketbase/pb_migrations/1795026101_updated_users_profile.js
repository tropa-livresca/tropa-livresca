/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2556683188")

  // remove field
  collection.fields.removeById("text437289737")

  // add field
  collection.fields.addAt(9, new Field({
    "exceptDomains": [],
    "help": "",
    "hidden": false,
    "id": "email3885137012",
    "name": "email",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "file437289737",
    "maxSelect": 0,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "imagem",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text556983137",
    "max": 0,
    "min": 0,
    "name": "telefone",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2556683188")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text437289737",
    "max": 0,
    "min": 0,
    "name": "imagem",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("email3885137012")

  // remove field
  collection.fields.removeById("file437289737")

  // remove field
  collection.fields.removeById("text556983137")

  return app.save(collection)
})
