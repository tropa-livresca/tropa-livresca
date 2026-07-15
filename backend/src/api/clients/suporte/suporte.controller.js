import nodemailer from "nodemailer";
import "dotenv/config";

export const enviarEmail = async (req, res, next) => {
  const { telefone, email, nome, mensagem, motivo } = req.body;

  const emailCliente = email;
  const mensagemCliente = mensagem;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailCliente || !mensagemCliente || !emailRegex.test(emailCliente)) {
      const erroValidacao = new Error("Dados inválidos ou e-mail malformatado.");
      erroValidacao.statusCode = 400;
      throw erroValidacao;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465", 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      family: 4,
    });

    const mensagemSanitizada = mensagemCliente
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");

    const mail = {
      from: `"Suporte Tropa Livresca" <${process.env.SMTP_USER}>`,
      to: "suporte.tropalivresca@gmail.com",
      replyTo: emailCliente,
      subject: `Novo Chamado de Suporte pelo motivo: ${motivo || 'Geral'}`,
      html: `
            <h3>Novo Chamado Recebido</h3>
            <b>Nome:</b> ${nome || 'Não informado'} <br>
            <b>E-mail do remetente:</b> ${emailCliente} <br>
            <b>Telefone/Celular:</b> ${telefone || 'Não informado'} <br><br>
            <b>Mensagem:</b><br>
            <p>${mensagemSanitizada}</p>`,
    };

    const response = await transporter.sendMail(mail);
    
    return res.status(200).json({
      status: "success",
      message: "Sua mensagem de suporte foi enviada com sucesso!",
      responseId: response.messageId
    });
    
  } catch (err) {
    next(err);
  }
};
