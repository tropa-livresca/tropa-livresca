import { sendEmail } from "../middlewares/suporte.middleware";

export const enviarEmail = async (req, res) => {
  const { telefone, email, nome, mensagem, motivo } = req.body;

  const anexo = req.file;

  try {
      const response = await sendEmail(email, nome, mensagem, motivo);
      return res.json(response);
  } catch (err) {
    return res.status(500).json({error: "Erro Real", err});
  }
};
