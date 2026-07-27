import { jest } from "@jest/globals";

class SupabaseQueryBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.result = {
      data: null,
      error: null,
      count: null,
    };

    this.select = jest.fn(() => this);
    this.insert = jest.fn(() => this);
    this.update = jest.fn(() => this);
    this.upsert = jest.fn(() => this);
    this.delete = jest.fn(() => this);

    this.eq = jest.fn(() => this);
    this.neq = jest.fn(() => this);
    this.ilike = jest.fn(() => this);
    this.in = jest.fn(() => this);
    this.or = jest.fn(() => this);

    this.order = jest.fn(() => this);
    this.range = jest.fn(() => this);
    this.limit = jest.fn(() => this);

    this.single = jest.fn(() => Promise.resolve(this.result));
    this.maybeSingle = jest.fn(() => Promise.resolve(this.result));

    this.then = (onFulfilled) => {
      return Promise.resolve(this.result).then(onFulfilled);
    };
  }

  resolve(data, error = null, count = null) {
    this.result = {
      data,
      error,
      count,
    };
  }
}

export const builder = new SupabaseQueryBuilder();

export const supabaseAdminMock = {
  from: jest.fn(() => builder),
};

export const supabaseMock = {
  from: jest.fn(() => builder),
};

export function resetSupabaseMock() {
  builder.reset();
  supabaseAdminMock.from.mockClear();
  supabaseMock.from.mockClear();
}
