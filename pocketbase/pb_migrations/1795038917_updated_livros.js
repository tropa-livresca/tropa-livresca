/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1603080800")

  // add field
  collection.fields.addAt(19, new Field({
    "help": "",
    "hidden": false,
    "id": "file436983453",
    "maxSelect": 0,
    "maxSize": 10485760,
    "mimeTypes": [
      "image/png",
      "image/jpeg"
    ],
    "name": "capa_verso",
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

  // remove field
  collection.fields.removeById("file436983453")

  return app.save(collection)
})
