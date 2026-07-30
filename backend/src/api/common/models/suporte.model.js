import nodemailer from "nodemailer";

export class SuporteModel {
  static async dispararEmail(dadosMail) {
    try {
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

      return await transporter.sendMail(dadosMail);
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }
}
