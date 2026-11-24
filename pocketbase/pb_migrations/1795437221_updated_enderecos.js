/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2556814402")

  // remove field
  collection.fields.removeById("relation2990440545")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2556814402")

  // add field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2556683188",
    "help": "",
    "hidden": false,
    "id": "relation2990440545",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "fk_user_profile_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
