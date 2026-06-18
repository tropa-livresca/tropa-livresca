  import nodemailer from "nodemailer";

import "dotenv/config";

export const sendEmail = async (telefone, email, motivo, nome, mensagem) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    family: 4,
  });

  const mail = {
    form: process.env.SMTP_USER,
    to: "gabrielrduarte777@gmail.com",
    subject: `Contato de ${nome}, motivo ${motivo}`,
    text: mensagem,
  };

  try {
    const response = await transporter.sendMail(mail);
    return response;
  } catch (err) {
    throw err;
  }
};
