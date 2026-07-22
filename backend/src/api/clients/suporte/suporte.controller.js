import { SuporteService } from "./suporte.service.js";

export class SuporteController {
  static async enviarEmail(req, res, next) {
    try {
      const response = await SuporteService.processarChamado(req.body);

      return res.status(200).json({
        status: "success",
        message: "Sua mensagem de suporte foi enviada com sucesso!",
        responseId: response.messageId
      });
    } catch (err) {
      next(err);
    }
  }
}
