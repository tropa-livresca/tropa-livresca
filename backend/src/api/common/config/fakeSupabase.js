let bancoEmMemoria = {
  users_profile: [],
  adm_credenciais: [],
  categorias: [],
  livros: [],
  comentarios: [],
  denuncias: [],
  enderecos: [],
  met_pagamentos: [],
  usuarios_cartoes: [],
  vendas: [],
  itens_venda: [],
  cupons: [],
  revisoes: [],
  notificacoes: [],
  notificacoes_lidas: [],
};

class FakeQueryBuilder {
  constructor(tabela) {
    this.tabela = tabela;
    this.filtros = {};
  }

  select(campos = "*") {
    return this;
  }

  update(dadosNovos) {
    this.dadosNovos = dadosNovos;
    return this;
  }

  insert(dadosNovos) {
    const payload = Array.isArray(dadosNovos) ? dadosNovos : [dadosNovos];
    if (!bancoEmMemoria[this.tabela]) bancoEmMemoria[this.tabela] = [];
    bancoEmMemoria[this.tabela].push(...payload);
    return this;
  }

  eq(campo, valor) {
    this.filtros[campo] = valor;
    return this;
  }

  async maybeSingle() {
    const { data, error } = await this.then((res) => res);
    return { data: data[0] || null, error };
  }

  async single() {
    const { data, error } = await this.then((res) => res);
    if (!data || data.length === 0) {
      return {
        data: null,
        error: new Error(
          "PGRST116: JSON object requested, multiple or no rows returned",
        ),
      };
    }
    return { data: data[0], error };
  }
  
  async then(onFulfilled) {
    try {
      let data = bancoEmMemoria[this.tabela] || [];

      if (Object.keys(this.filtros).length > 0) {
        data = data.filter((registro) =>
          Object.keys(this.filtros).every(
            (key) => registro[key] === this.filtros[key],
          ),
        );
      }

      if (this.dadosNovos) {
        data.forEach((registro) => {
          Object.assign(registro, this.dadosNovos);
        });
      }

      const resultado = { data, error: null };
      return onFulfilled ? onFulfilled(resultado) : resultado;
    } catch (error) {
      const resultadoErro = { data: null, error };
      return onFulfilled ? onFulfilled(resultadoErro) : resultadoErro;
    }
  }
}

export const fakeSupabase = {
  from(tabela) {
    if (!bancoEmMemoria[tabela]) {
      bancoEmMemoria[tabela] = [];
    }
    return new FakeQueryBuilder(tabela);
  },

  db: {
    get(tabela) {
      return bancoEmMemoria[tabela] || [];
    },
    insert(tabela, dado) {
      if (!bancoEmMemoria[tabela]) bancoEmMemoria[tabela] = [];
      bancoEmMemoria[tabela].push(dado);
    },
  },

  reset() {
    bancoEmMemoria = {
      users_profile: [],
      adm_credenciais: [],
      categorias: [],
      livros: [],
      comentarios: [],
      denuncias: [],
      enderecos: [],
      met_pagamentos: [],
      usuarios_cartoes: [],
      vendas: [],
      itens_venda: [],
      cupons: [],
      revisoes: [],
      notificacoes: [],
      notificacoes_lidas: [],
    };
  },
};

export const supabaseAdmin = fakeSupabase;
export default fakeSupabase;
