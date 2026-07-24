import { test, mock } from "node:test";
import assert from "node:assert";
import request from "supertest";
import express from "express";

import { fakeSupabase } from "../../common/config/fakeSupabase.js";
import routerDoModulo from "./autopublicacao.route.js"; // Importação estática normal!

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = { id: "user-uuid-123" };
  next();
});

app.use("/api/v1/clients/autopublicacao", routerDoModulo);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

mock.method(globalThis, "fetch", async (url, options = {}) => {
  const urlStr = url.toString();
  const metodo = options.method || "GET";
  const corpo = options.body ? JSON.parse(options.body) : null;

  if (urlStr.includes("/rest/v1/livros")) {
    const tabela = "livros";

    // Regex robusta para capturar o ID independente do formato da query string (id=eq.XXXX)
    const matchId = urlStr.match(/id=eq\.([^&]+)/);
    const id = matchId ? matchId[1] : "livro-uuid-789";

    if (metodo === "PATCH" || metodo === "PUT") {
      // 1. Atualiza o banco falso em memória usando o ID extraído da URL
      await fakeSupabase.from(tabela).update(corpo).eq("id", id);
      
      // 2. O Supabase exige o registro modificado dentro de um array no retorno
      const registroAtualizado = { id, ...corpo };
      
      return new Response(JSON.stringify([registroAtualizado]), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Preference-Applied": "return=representation",
          "Content-Range": "0-0/1"
        }
      });
    }

    if (metodo === "GET") {
      // Quando o Model faz o .maybeSingle(), ele primeiro busca o registro atual via GET
      const dados = fakeSupabase.db.get(tabela);
      const registro = dados.find(l => l.id === id);
      const resultado = registro ? [registro] : [];
      
      return new Response(JSON.stringify(resultado), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Content-Range": `${resultado.length > 0 ? "0-0/1" : "*/0"}`
        }
      });
    }
  }

  // Resposta padrão amigável para chamadas de Storage ou tabelas acessórias
  return new Response(JSON.stringify([]), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
});

test("Suíte de Integração Definitiva via Interceptação de Rede (Node 20)", async (t) => {
  
  t.beforeEach(() => fakeSupabase.reset());

  // ==========================================
  // ROTA 4: PATCH /updateEstado/:id
  // ==========================================
  await t.test(
    "UpdateEstado - Deve transicionar o estado de rascunho para publicado com sucesso",
    async () => {
      fakeSupabase.from("livros").insert({ id: "livro-uuid-789", estado: "rascunho", ativo: true });

      const response = await request(app)
        .patch("/api/v1/clients/autopublicacao/updateEstado/livro-uuid-789")
        .send({ rascunho: false });

      assert.strictEqual(response.status, 200);

      const livrosNoBanco = fakeSupabase.db.get("livros");
      const livroAlterado = livrosNoBanco.find(l => l.id === "livro-uuid-789");
      
      assert.ok(livroAlterado, "O livro deveria existir na memória.");
      assert.strictEqual(livroAlterado.estado, "publicado");
    }
  );

  // ==========================================
  // ROTA 5: PATCH /ativo/:id
  // ==========================================
  await t.test(
    "PATCH /ativo/:id - Deve desativar logicamente um livro no banco",
    async () => {
      fakeSupabase.from("livros").insert({ id: "livro-uuid-789", estado: "rascunho", ativo: true });

      const response = await request(app)
        .patch("/api/v1/clients/autopublicacao/ativo/livro-uuid-789");

      assert.strictEqual(response.status, 200);

      const livrosNoBanco = fakeSupabase.db.get("livros");
      const livroAlterado = livrosNoBanco.find(l => l.id === "livro-uuid-789");
      assert.strictEqual(livroAlterado.ativo, false);
    }
  );
});
