export const LIVRO_ESTADO = Object.freeze({
  RASCUNHO: "rascunho",
  EM_REVISAO: "em_revisao",
  PUBLICADO: "publicado",
  NEGADO: "negado",
  RECALL: "recall",
});

export const LIVRO_ESTADOS = Object.freeze(Object.values(LIVRO_ESTADO));

export const TRANSICOES_LIVRO = Object.freeze({
  [LIVRO_ESTADO.RASCUNHO]: Object.freeze([LIVRO_ESTADO.EM_REVISAO]),
  [LIVRO_ESTADO.EM_REVISAO]: Object.freeze([
    LIVRO_ESTADO.PUBLICADO,
    LIVRO_ESTADO.NEGADO,
    LIVRO_ESTADO.RECALL,
  ]),
  [LIVRO_ESTADO.PUBLICADO]: Object.freeze([]),
  [LIVRO_ESTADO.NEGADO]: Object.freeze([LIVRO_ESTADO.EM_REVISAO]),
  [LIVRO_ESTADO.RECALL]: Object.freeze([LIVRO_ESTADO.EM_REVISAO]),
});

export const TRANSICOES_CLIENTE = Object.freeze({
  [LIVRO_ESTADO.RASCUNHO]: Object.freeze([LIVRO_ESTADO.EM_REVISAO]),
  [LIVRO_ESTADO.NEGADO]: Object.freeze([LIVRO_ESTADO.EM_REVISAO]),
  [LIVRO_ESTADO.RECALL]: Object.freeze([LIVRO_ESTADO.EM_REVISAO]),
});

export const TRANSICOES_ADMINISTRADOR = Object.freeze({
  [LIVRO_ESTADO.EM_REVISAO]: Object.freeze([
    LIVRO_ESTADO.PUBLICADO,
    LIVRO_ESTADO.NEGADO,
    LIVRO_ESTADO.RECALL,
  ]),
});

export function transicaoPermitida(
  estadoAtual,
  novoEstado,
  transicoes = TRANSICOES_LIVRO,
) {
  return Boolean(transicoes[estadoAtual]?.includes(novoEstado));
}
