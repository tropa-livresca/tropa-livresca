import nodemailer from "nodemailer";

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class SuporteModel {
  static async dispararEmail(dadosMail) {
    try {
      const tempoMinimo = Math.max(
        0,
        Number.parseInt(process.env.SMTP_MIN_DELAY_MS || "5000", 10) || 0,
      );

      if (tempoMinimo > 0) {
        await aguardar(tempoMinimo);
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "465", 10),
        secure: Number.parseInt(process.env.SMTP_PORT || "465", 10) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        family: 4,
      });

      return await transporter.sendMail(dadosMail);
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }
}
