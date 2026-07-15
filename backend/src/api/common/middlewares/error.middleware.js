export const errorHandler = (err, req, res, next) => {
    console.error("Erro detectado no servidor", err.stack || err.message);

    const statusCode = err.statusCode || 500;

    let mensagem = err.message || "Ocorreu um erro interno inesperado no servidor.";

    if (err.code && err.code.startsWith("22")) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            error: "O identificador fornecido possui um formato inválido."
        });
    }

    if (err.code === "P0001") {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            error: mensagem
        });
    }

    return res.status(statusCode).json({
        status: "error",
        statusCode,
        error: mensagem
    });
};
