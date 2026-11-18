/// <reference path="../pb_data/types.d.ts" />

// Tropa Livresca - estrutura inicial convertida de Supabase/PostgreSQL
// Compatibilidade: PocketBase reserva o campo "id" (string). O UUID original
// de users_profile.id é preservado em id_supabase.

migrate((app) => {
    const profiles = new Collection({
        type: "base",
        name: "users_profile",
        fields: [
            { type: "text", name: "id", required: true },
            { type: "text", name: "nome", required: true },
            { type: "text", name: "sobrenome", required: true },
            { type: "text", name: "telefone", required: true },
            { type: "text", name: "imagem" },
            { type: "text", name: "descricao" },
            { type: "json", name: "redes_sociais" },
            { type: "bool", name: "is_admin", required: true },
            { type: "text", name: "senha_adm" },
            { type: "bool", name: "primeiro_acesso", required: true },
            { type: "text", name: "email" },
            { type: "bool", name: "is_master" },
            { type: "json", name: "dados_bancarios" },
        ],
    });
    app.save(profiles);

    const books = new Collection({
        type: "base",
        name: "livros",
        fields: [
            { type: "bool", name: "direitos_de_publicacao", required: true },
            { type: "number", name: "numero_edicao" },
            { type: "date", name: "data_de_publicacao", required: true },
            { type: "number", name: "preco_digital", required: true },
            { type: "number", name: "preco_fisico", required: true },
            { type: "text", name: "titulo", required: true },
            { type: "text", name: "subtitulo", required: true },
            { type: "text", name: "descricao", required: true },
            { type: "bool", name: "ativo", required: true },
            { type: "text", name: "estado", required: true },
            { type: "text", name: "idioma", required: true },
            { type: "text", name: "manuscrito" },
            { type: "json", name: "colaboradores" },
            { type: "json", name: "capa" },
            { type: "text", name: "categoria" },
            { type: "text", name: "ISBN" },
            { type: "number", name: "numero_paginas" },
        ],
    });
    app.save(books);

    const sales = new Collection({
        type: "base",
        name: "vendas",
        fields: [
            { type: "date", name: "data", required: true },
            { type: "number", name: "total", required: true },
            { type: "number", name: "metodo_pagamento", required: true },
            { type: "text", name: "status_pagamento", required: true },
            { type: "json", name: "endereco_entrega" },
            { type: "text", name: "status_entrega", required: true },
        ],
    });
    app.save(sales);

    const saleItems = new Collection({
        type: "base",
        name: "itens_venda",
        fields: [
            { type: "number", name: "qtd", required: true },
            { type: "number", name: "subtotal", required: true },
            { type: "bool", name: "fisico", required: true },
            { type: "number", name: "preco_unitario", required: true },
        ],
    });
    app.save(saleItems);

    const reviews = new Collection({
        type: "base",
        name: "avaliacoes",
        fields: [
            { type: "date", name: "data_criacao", required: true },
            { type: "number", name: "qtd_estrelas" },
        ],
    });
    app.save(reviews);

    const movements = new Collection({
        type: "base",
        name: "movimentacoes_financeiras",
        fields: [
            { type: "date", name: "data", required: true },
            { type: "text", name: "tipo", required: true },
            { type: "number", name: "valor", required: true },
            { type: "text", name: "descricao", required: true },
            { type: "text", name: "status", required: true },
        ],
    });
    app.save(movements);

    const addresses = new Collection({
        type: "base",
        name: "enderecos",
        fields: [
            { type: "text", name: "estado", required: true },
            { type: "text", name: "bairro", required: true },
            { type: "text", name: "rua", required: true },
            { type: "number", name: "num", required: true },
            { type: "text", name: "cep", required: true },
            { type: "text", name: "cidade", required: true },
            { type: "text", name: "complemento" },
            { type: "text", name: "pais" },
            { type: "bool", name: "ativo" },
            { type: "bool", name: "principal" },
        ],
    });
    app.save(addresses);

    const bookReviews = new Collection({
        type: "base",
        name: "revisoes",
        fields: [
            { type: "date", name: "data_criacao", required: true },
            { type: "text", name: "apontamento" },
            { type: "text", name: "nome" },
            { type: "bool", name: "completado", required: true },
        ],
    });
    app.save(bookReviews);

    // Relações: equivalentes às FKs documentadas no PostgreSQL.
    const profileId = profiles.id;
    const bookId = books.id;
    const saleId = sales.id;

    books.fields.add(new RelationField({
        name: "fk_user_profile_id",
        collectionId: profileId,
        maxSelect: 1,
        cascadeDelete: false,
        required: true,
    }));
    app.save(books);

    sales.fields.add(new RelationField({
        name: "fk_user_profile_id",
        collectionId: profileId,
        maxSelect: 1,
        cascadeDelete: false,
        required: true,
    }));
    app.save(sales);

    saleItems.fields.add(new RelationField({
        name: "fk_livros_itens_id",
        collectionId: bookId,
        maxSelect: 1,
        cascadeDelete: false,
        required: true,
    }));
    saleItems.fields.add(new RelationField({
        name: "fk_vendas_id",
        collectionId: saleId,
        maxSelect: 1,
        cascadeDelete: false,
        required: true,
    }));
    app.save(saleItems);

    reviews.fields.add(new RelationField({
        name: "fk_livros_id",
        collectionId: bookId,
        maxSelect: 1,
        cascadeDelete: false,
    }));
    reviews.fields.add(new RelationField({
        name: "fk_users_profile_id",
        collectionId: profileId,
        maxSelect: 1,
        cascadeDelete: false,
    }));
    app.save(reviews);

    movements.fields.add(new RelationField({
        name: "fk_user_profile_id",
        collectionId: profileId,
        maxSelect: 1,
        cascadeDelete: false,
    }));
    movements.fields.add(new RelationField({
        name: "fk_vendas_id",
        collectionId: saleId,
        maxSelect: 1,
        cascadeDelete: false,
    }));
    app.save(movements);

    addresses.fields.add(new RelationField({
        name: "fk_user_profile_id",
        collectionId: profileId,
        maxSelect: 1,
        cascadeDelete: false,
        required: true,
    }));
    app.save(addresses);

    bookReviews.fields.add(new RelationField({
        name: "fk_user_profile_id",
        collectionId: profileId,
        maxSelect: 1,
        cascadeDelete: false,
        required: true,
    }));
    bookReviews.fields.add(new RelationField({
        name: "fk_livro_id",
        collectionId: bookId,
        maxSelect: 1,
        cascadeDelete: false,
        required: true,
    }));
    app.save(bookReviews);
}, (app) => {
    const names = [
        "revisoes",
        "enderecos",
        "movimentacoes_financeiras",
        "avaliacoes",
        "itens_venda",
        "vendas",
        "livros",
        "users_profile",
    ];

    for (const name of names) {
        try {
            app.delete(app.findCollectionByNameOrId(name));
        } catch (_) {
            // Permite rollback seguro caso uma coleção já não exista.
        }
    }
});
