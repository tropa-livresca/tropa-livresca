onRecordAfterCreateSuccess((e) => {
  const usuario = e.record;
  const perfil = new Record($app.findCollectionByNameOrId("users_profile"));

  perfil.set("id", usuario.id);
  perfil.set("auth_user", usuario.id);
  perfil.set("telefone", usuario.getString("telefone"));
  perfil.set("email", usuario.getString("email"));
  perfil.set("is_admin", false);
  perfil.set("is_master", false);
  perfil.set("primeiro_acesso", false);

  $app.save(perfil);

  return e.next();
}, "users");
