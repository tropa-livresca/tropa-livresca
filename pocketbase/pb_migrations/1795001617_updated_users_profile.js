/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2556683188")

  // remove field
  collection.fields.removeById("text556983137")

  // remove field
  collection.fields.removeById("text1860104509")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2556683188")

  // add field
  collection.fields.addAt(1, new Field({
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
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1860104509",
    "max": 0,
    "min": 0,
    "name": "funcao",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
