export const LIVRO_ESTADO = Object.freeze({
  RASCUNHO: "rascunho",
  EM_REVISAO: "em_revisao",
  PUBLICADO: "publicado",
  NEGADO: "negado",
  RECALL: "recall",
});

export const ESTADOS_EDITAVEIS = Object.freeze([
  LIVRO_ESTADO.RASCUNHO,
  LIVRO_ESTADO.NEGADO,
  LIVRO_ESTADO.RECALL,
]);

export const ESTADOS_ENVIAVEIS_REVISAO = Object.freeze([
  LIVRO_ESTADO.RASCUNHO,
  LIVRO_ESTADO.NEGADO,
  LIVRO_ESTADO.RECALL,
]);
