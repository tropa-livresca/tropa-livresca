const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";

export class GoogleBooksModel {
  static async buscarLivros({ busca = "", page = 1, limit = 6 }) {
    const startIndex = (page - 1) * limit;

    const params = new URLSearchParams({
      q: busca.trim() || "subject:books",
      startIndex: String(startIndex),
      maxResults: String(Math.min(limit, 40)),
      orderBy: "relevance",
    });

    const url = `${GOOGLE_BOOKS_URL}?${params.toString()}`;

    const response = await fetch(url);

    if (response.status === 429) {
      const error = new Error(
        "Limite de requisições da Google Books API atingido.",
      );

      error.statusCode = 429;

      throw error;
    }

    if (!response.ok) {
      const texto = await response.text();

      console.error("Erro Google Books:", response.status, texto);

      const error = new Error("Erro ao consultar a Google Books API.");

      error.statusCode = response.status;

      throw error;
    }

    return await response.json();
  }

  static async buscarLivroById(id) {
    const response = await fetch(`${GOOGLE_BOOKS_URL}/${id}`);

    if (response.status === 429) {
      const error = new Error(
        "Limite de requisições da Google Books API atingido.",
      );

      error.statusCode = 429;

      throw error;
    }

    if (!response.ok) {
      const error = new Error("Livro não encontrado na Google Books API.");

      error.statusCode = 404;

      throw error;
    }

    return await response.json();
  }
}
