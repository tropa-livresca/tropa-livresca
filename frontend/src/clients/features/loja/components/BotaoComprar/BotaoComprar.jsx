import PropTypes from "prop-types";

export default function BotaoComprar({
  pedido,
  handleConfirmar,
  handlePagar,
  carregando,
  temFisico,
  enderecoId,
  formaPagamento,
  className,
}) {
  const pedidoCriado = Boolean(pedido?.id);

  const desabilitado =
    carregando ||
    (!pedidoCriado &&
      ((temFisico && !enderecoId) || !formaPagamento));

  const handleClick = pedidoCriado ? handlePagar : handleConfirmar;

  const textoBotao = carregando
    ? pedidoCriado
      ? "Processando..."
      : "Criando pedido..."
    : pedidoCriado
      ? "Pagar (simulado)"
      : "Finalizar compra";

  return (
    <button
      className={className}
      type="button"
      onClick={handleClick}
      disabled={desabilitado}
    >
      {textoBotao}
    </button>
  );
}

BotaoComprar.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  handleConfirmar: PropTypes.func.isRequired,
  handlePagar: PropTypes.func.isRequired,
  carregando: PropTypes.bool,
  temFisico: PropTypes.bool,
  enderecoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  formaPagamento: PropTypes.string,
  className: PropTypes.string,
};

BotaoComprar.defaultProps = {
  pedido: null,
  carregando: false,
  temFisico: false,
  enderecoId: null,
  formaPagamento: "",
  className: "",
};