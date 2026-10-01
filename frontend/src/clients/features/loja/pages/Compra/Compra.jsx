import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import styles from "./Compra.module.css";
import { useCarrinho } from "../../hooks/useCarrinho";
import { useCompra } from "../../hooks/useCompra";
import { useEndereco } from "../../../perfil/hooks/useEndereco";

const formatarPreco = (valor) =>
  `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;

export default function Compra() {
  const navigate = useNavigate();
  const { itens, valorSubtotal, limparCarrinho } = useCarrinho();
  const { enderecos = [], BuscarEnderecos } = useEndereco();
  const { criarPedido, pagarPedido, carregando, erro } = useCompra();

  const [enderecoEscolhido, setEnderecoId] = useState(null);
  const [pedido, setPedido] = useState(null);

  const temFisico = itens.some((item) => item.tipo === "fisico");

  useEffect(() => {
    if (temFisico) BuscarEnderecos();
  }, [temFisico, BuscarEnderecos]);

  // Sem escolha do usuário, usa o endereço principal.
  const enderecoPadrao = enderecos.find((e) => e.principal) || enderecos[0];
  const enderecoId = enderecoEscolhido ?? enderecoPadrao?.id ?? null;

  const handleConfirmar = async () => {
    const venda = await criarPedido(itens, temFisico ? enderecoId : null);
    if (venda) setPedido(venda);
  };

  const handlePagar = async () => {
    const pago = await pagarPedido(pedido.id);
    if (pago) {
      limparCarrinho();
      navigate(`/pedido/${pedido.id}`, { replace: true });
    }
  };

  if (itens.length === 0 && !pedido) {
    return (
      <main className={styles.container}>
        <section className={styles.vazio}>
          <p>Seu carrinho está vazio.</p>
          <Link to="/loja" className={styles.voltar}>
            <FiArrowLeft /> Voltar para a Loja
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Finalizar compra</h1>
        <p>
          {pedido
            ? "Pedido criado. Confirme o pagamento para concluir."
            : "Revise seus livros e escolha onde receber."}
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.conteudo}>
          <div className={styles.colunaPrincipal}>
            <section className={styles.cartao}>
              <h2>Itens</h2>
              <ul className={styles.itens}>
                {itens.map((item) => (
                  <li key={`${item.id}-${item.tipo}`} className={styles.item}>
                    <div>
                      <strong>{item.titulo}</strong>
                      <small>
                        {item.tipo === "fisico" ? "Físico" : "Digital"} ·{" "}
                        {item.quantidade}x
                      </small>
                    </div>
                    <span>{formatarPreco(item.preco * item.quantidade)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {temFisico && (
              <section className={styles.cartao}>
                <h2>Endereço de entrega</h2>

                {enderecos.length === 0 ? (
                  <p className={styles.aviso}>
                    Você ainda não tem endereço cadastrado.{" "}
                    <Link to="/perfil/endereco">Cadastrar endereço</Link>
                  </p>
                ) : (
                  <div className={styles.enderecos}>
                    {enderecos.map((endereco) => (
                      <label key={endereco.id} className={styles.endereco}>
                        <input
                          type="radio"
                          name="endereco"
                          value={endereco.id}
                          checked={enderecoId === endereco.id}
                          onChange={() => setEnderecoId(endereco.id)}
                          disabled={!!pedido}
                        />
                        <span>
                          {endereco.rua}, {endereco.num}
                          {endereco.complemento
                            ? ` - ${endereco.complemento}`
                            : ""}
                          <br />
                          {endereco.bairro} · {endereco.cidade}/
                          {endereco.estado} · CEP {endereco.cep}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            )}

            {!temFisico && (
              <section className={styles.cartao}>
                <h2>Entrega digital</h2>
                <p className={styles.aviso}>
                  Após o pagamento, o e-book é enviado para o e-mail da sua
                  conta.
                </p>
              </section>
            )}
          </div>

          <aside className={styles.resumo}>
            <h2>Resumo</h2>

            {pedido ? (
              <>
                <div className={styles.linha}>
                  <span>Livros</span>
                  <strong>{formatarPreco(pedido.total - pedido.frete)}</strong>
                </div>
                <div className={styles.linha}>
                  <span>Frete</span>
                  <strong>
                    {pedido.frete > 0 ? formatarPreco(pedido.frete) : "Grátis"}
                  </strong>
                </div>
                <div className={`${styles.linha} ${styles.total}`}>
                  <span>Total</span>
                  <strong>{formatarPreco(pedido.total)}</strong>
                </div>

                <button
                  type="button"
                  className={styles.botao}
                  onClick={handlePagar}
                  disabled={carregando}
                >
                  {carregando ? "Processando..." : "Pagar (simulado)"}
                </button>
                <p className={styles.nota}>
                  Pagamento demonstrativo: nenhuma cobrança real é feita.
                </p>
              </>
            ) : (
              <>
                <div className={styles.linha}>
                  <span>Subtotal estimado</span>
                  <strong>{formatarPreco(valorSubtotal)}</strong>
                </div>
                <p className={styles.nota}>
                  O frete e o total final são calculados ao confirmar.
                </p>

                <button
                  type="button"
                  className={styles.botao}
                  onClick={handleConfirmar}
                  disabled={carregando || (temFisico && !enderecoId)}
                >
                  {carregando ? "Criando pedido..." : "Confirmar pedido"}
                </button>
              </>
            )}

            {erro && <p className={styles.erro}>{erro}</p>}

            {!pedido && (
              <Link to="/carrinho" className={styles.voltar}>
                <FiArrowLeft /> Voltar ao carrinho
              </Link>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
