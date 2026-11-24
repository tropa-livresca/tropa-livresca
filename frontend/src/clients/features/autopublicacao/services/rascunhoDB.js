const NOME_BANCO = "tropa-livresca";
const VERSAO_BANCO = 1;
const NOME_COLECAO = "rascunhos";

let conexaoBanco;

function abrirBanco() {
  if (conexaoBanco) return conexaoBanco;

  conexaoBanco = new Promise((resolve, reject) => {
    const requisicao = indexedDB.open(NOME_BANCO, VERSAO_BANCO);

    requisicao.onupgradeneeded = (event) => {
      const banco = event.target.result;

      if (!banco.objectStoreNames.contains(NOME_COLECAO)) {
        banco.createObjectStore(NOME_COLECAO, {
          keyPath: "id",
        });
      }
    };

    requisicao.onsuccess = () => resolve(requisicao.result);

    requisicao.onerror = () => {
      conexaoBanco = null;
      reject(requisicao.error);
    };

    requisicao.onblocked = () => {
      reject(new Error("O banco de rascunhos está bloqueado."));
    };
  });

  return conexaoBanco;
}

export async function salvarRascunho(usuarioId, dados) {
  const banco = await abrirBanco();

  return new Promise((resolve, reject) => {
    const transacao = banco.transaction(NOME_COLECAO, "readwrite");

    transacao.objectStore(NOME_COLECAO).put({
      id: usuarioId,
      dados,
      atualizadoEm: new Date().toISOString(),
    });

    transacao.oncomplete = () => resolve(true);
    transacao.onerror = () => reject(transacao.error);
    transacao.onabort = () => reject(transacao.error);
  });
}

export async function buscarRascunho(usuarioId) {
  const banco = await abrirBanco();

  return new Promise((resolve, reject) => {
    const transacao = banco.transaction(NOME_COLECAO, "readonly");
    const requisicao = transacao.objectStore(NOME_COLECAO).get(usuarioId);

    requisicao.onsuccess = () => {
      resolve(requisicao.result?.dados || null);
    };

    requisicao.onerror = () => reject(requisicao.error);
  });
}

export async function removerRascunho(usuarioId) {
  const banco = await abrirBanco();

  return new Promise((resolve, reject) => {
    const transacao = banco.transaction(NOME_COLECAO, "readwrite");

    transacao.objectStore(NOME_COLECAO).delete(usuarioId);

    transacao.oncomplete = () => resolve(true);
    transacao.onerror = () => reject(transacao.error);
    transacao.onabort = () => reject(transacao.error);
  });
}
