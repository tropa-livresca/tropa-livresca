const cache = new Map();

const TEMPO_CACHE = 30 * 60 * 1000;

export class GoogleBooksCache {
  static get(chave) {
    const item = cache.get(chave);

    if (!item) {
      return null;
    }

    const expirado = Date.now() - item.timestamp > TEMPO_CACHE;

    if (expirado) {
      cache.delete(chave);
      return null;
    }

    return item.data;
  }

  static set(chave, data) {
    cache.set(chave, {
      data,
      timestamp: Date.now(),
    });
  }

  static delete(chave) {
    cache.delete(chave);
  }

  static clear() {
    cache.clear();
  }

  static size() {
    return cache.size;
  }
}
