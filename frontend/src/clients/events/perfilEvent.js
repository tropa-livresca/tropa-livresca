const ouvintes = new Set();

export const perfilEvent = {
  emitir() {
    ouvintes.forEach((o) => o());
  },
  inscrever(ouvinte) {
    ouvintes.add(ouvinte);
    return () => ouvintes.delete(ouvinte);
  }
};
