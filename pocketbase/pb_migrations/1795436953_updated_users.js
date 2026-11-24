/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text36406763",
    "max": 0,
    "min": 0,
    "name": "descricao",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "json2138977267",
    "maxSize": 0,
    "name": "redes_sociais",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "bool3304254982",
    "name": "is_admin",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text840150026",
    "max": 0,
    "min": 0,
    "name": "senha_admin",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "help": "",
    "hidden": false,
    "id": "bool1963823247",
    "name": "primeiro_acesso",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "help": "",
    "hidden": false,
    "id": "bool2101358089",
    "name": "is_master",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "help": "",
    "hidden": false,
    "id": "json2267428190",
    "maxSize": 0,
    "name": "dados_bancarios",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(15, new Field({
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
  collection.fields.addAt(16, new Field({
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
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("text36406763")

  // remove field
  collection.fields.removeById("json2138977267")

  // remove field
  collection.fields.removeById("bool3304254982")

  // remove field
  collection.fields.removeById("text840150026")

  // remove field
  collection.fields.removeById("bool1963823247")

  // remove field
  collection.fields.removeById("bool2101358089")

  // remove field
  collection.fields.removeById("json2267428190")

  // remove field
  collection.fields.removeById("file437289737")

  // remove field
  collection.fields.removeById("text556983137")

  return app.save(collection)
})
