import { SuporteModel } from "../../common/models/suporte.model.js";

export class SuporteService {
  static async processarChamado(dados) {
    const { telefone, email, nome, mensagem, motivo } = dados;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !mensagem || !emailRegex.test(email)) {
      const erroValidacao = new Error("Dados inválidos ou e-mail malformatado.");
      erroValidacao.statusCode = 400;
      throw erroValidacao;
    }

    const mensagemSanitizada = mensagem
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");

    const mail = {
      from: `"Suporte Tropa Livresca" <${process.env.SMTP_USER}>`,
      to: "suporte.tropalivresca@gmail.com",
      replyTo: email,
      subject: `Novo Chamado de Suporte pelo motivo: ${motivo || 'Geral'}`,
      html: `
            <h3>Novo Chamado Recebido</h3>
            <b>Nome:</b> ${nome || 'Não informado'} <br>
            <b>E-mail do remetente:</b> ${email} <br>
            <b>Telefone/Celular:</b> ${telefone || 'Não informado'} <br><br>
            <b>Mensagem:</b><br>
            <p>${mensagemSanitizada}</p>`,
    };

    return await SuporteModel.dispararEmail(mail);
  }
}
