import nodemailer from "nodemailer";
import "dotenv/config";

export const enviarEmail = async (req, res) => {
  const { telefone, email, nome, mensagem, motivo } = req.body;

  const emailCliente = email;
  const mensagemCliente = mensagem;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailCliente || !mensagemCliente || !emailRegex.test(emailCliente)) {
    return res.status(400).send("Dados inválidos ou e-mail malformatado.");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      family: 4,
    });

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
            <p>${mensagemCliente.replace(/\n/g, "<br>")}</p>`,
    };

    const response = await transporter.sendMail(mail);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao enviar e-mail", err: err.message });
  }
};
