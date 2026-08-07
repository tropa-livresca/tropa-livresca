import { useState } from "react";
import styles from "./FAQ.module.css";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function FAQ() {
  const faqData = {
    "Começando e Envio do Livro": [
      {
        q: "O que é Autopublicação?",
        a: "Na autopublicação, você é o editor do seu próprio livro. Isso significa que você mantém o controle total sobre o conteúdo, o design da capa, a formatação, o preço de venda e as estratégias de divulgação, sem depender da aprovação de uma editora tradicional.",
      },
      {
        q: "Quais formatos de arquivo vocês aceitam?",
        a: "Para o miolo do livro, aceitamos arquivos nos formatos DOCX, PDF e EPUB. Para livros físicos (impressão sob demanda), recomendamos o envio em formato PDF com todas as fontes devidamente incorporadas para evitar erros de impressão.",
      },
      {
        q: "Existe um limite mínimo ou máximo de páginas?",
        a: "Para e-books, não há limite de páginas. Para livros impressos, as restrições variam de acordo com o tipo de encadernação técnico da gráfica (geralmente um mínimo de 32 a 48 páginas para lombada quadrada).",
      },
      {
        q: "Posso publicar em qualquer gênero literário?",
        a: "Sim, aceitamos ficção, não-ficção, poesia, quadrinhos, livros técnicos, entre outros. No entanto, não permitimos conteúdos que violem nossas políticas (como plágio, pirataria, discurso de ódio ou pornografia explícita).",
      },
    ],
    "Direitos Autorais e Registro": [
      {
        q: "Eu continuo sendo o dono dos direitos do meu livro?",
        a: "Sim. Você mantém 100% dos seus direitos autorais. A nossa plataforma funciona apenas como uma distribuidora e facilitadora de publicação. Você pode retirar o seu livro do ar ou alterar os arquivos quando desejar.",
      },
      {
        q: "A plataforma exige exclusividade?",
        a: "Não exigimos exclusividade. Você está livre para publicar e vender o seu livro em qualquer outro canal, site ou editora parceira.",
      },
      {
        q: "Como faço para registrar o ISBN e a Ficha Catalográfica?",
        a: "Você pode registrar seu livro diretamente no site da CBL (Câmara Brasileira do Livro). Se preferir, nossa plataforma oferece serviços adicionais de emissão de ISBN e Ficha Catalográfica durante o processo de publicação (consulte as taxas na aba de serviços).",
      },
      {
        q: "Meu livro precisa estar registrado antes de enviar?",
        a: "Não é obrigatório por lei, mas recomendamos fortemente que você faça o registro de direitos autorais (na Biblioteca Nacional ou via blockchain) antes de divulgar sua obra publicamente, guaranteeing a sua segurança jurídica.",
      },
    ],
    "Formatação, Capa e Produção": [
      {
        q: "Vocês revisam ou diagramam o meu livro?",
        a: "Nossa plataforma padrão funciona no modelo 'faça você mesmo', onde você envia os arquivos prontos. Caso precise de suporte profissional, oferecemos serviços opcionais contratados à parte para revisão gramatical, diagramação interna e criação de capa.",
      },
      {
        q: "Como funciona a impressão sob demanda (POD)?",
        a: "Você não precisa investir em grandes tiragens nem manter estoque. Quando um leitor compra o seu livro físico na nossa loja ou em parceiros, o pedido é enviado automaticamente para a gráfica, que imprime uma única cópia e envia diretamente para a casa do comprador.",
      },
      {
        q: "Como sei se a minha capa está no tamanho correto?",
        a: "Disponibilizamos gabaritos em PDF e PSD na nossa área do autor. O tamanho exato da lombada do livro impresso depende diretamente do número de páginas final.",
      },
    ],
    "Preços, Vendas e Royalties": [
      {
        q: "Quanto custa para publicar o livro aqui?",
        a: "Publicar na nossa plataforma é 100% gratuito. Você não paga nada para cadastrar o seu e-book ou livro físico no sistema. Nós só ganhamos uma comissão quando o seu livro for vendido.",
      },
      {
        q: "Como são calculados os royalties?",
        a: "O cálculo é transparente: O preço de um livro é dado pela soma do valor mínimo para a sua produção com o valor da comissão que você escolher. Portanto, os seus royalties serão proporcionais ao valor que você registrar.",
      },
      {
        q: "Qual é o valor mínimo para resgatar meus ganhos?",
        a: "O valor mínimo para transferência bancária é de R$ 50,00. Os pagamentos são processados mensalmente, depositados até o dia 15 do mês subsequente ao fechamento das vendas.",
      },
      {
        q: "Quem define o preço da venda do livro?",
        a: "Você tem total autonomia para definir o preço. O sistema apenas calculará e informará o preço mínimo necessário para cobrir os custos de impressão e taxas operacionais da plataforma.",
      },
    ],
    "Distribuição e Entrega": [
      {
        q: "Onde o meu livro estará disponível para venda?",
        a: "Eles estarão disponibilizados em nossa loja virtual e, futuramente, em lojas de terceiros.",
      },
      {
        q: "Como funciona o envio para o leitor?",
        a: "Nós cuidamos de tudo. O processamento do pagamento, a emissão da nota fiscal, a impressão (no caso de livros físicos) e o envio postal pelos Correios ou transportadoras são de total responsabilidade da nossa plataforma.",
      },
      {
        q: "Posso comprar exemplares do meu próprio livro com desconto?",
        a: "Sim. O autor pode comprar qualquer quantidade de exemplares da sua própria obra pagando apenas o preço de custo de impressão + frete, ideal para eventos de lançamento, palestras ou vendas diretas.",
      },
    ],
  };

  const [perguntaAberta, setPerguntaAberta] = useState(null);

  const alternarPergunta = (chaveUnica) => {
    setPerguntaAberta(perguntaAberta === chaveUnica ? null : chaveUnica);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Perguntas Frequentes</h1>
      </div>

      {Object.entries(faqData).map(([categoria, itens]) => (
        <div key={categoria} className={styles.categoriaCard}>
          <h2 className={styles.categoriaTitulo}>{categoria}</h2>

          {itens.map((item, index) => {
            const idUnico = `${categoria}-${index}`;
            const estaAberto = perguntaAberta === idUnico;

            return (
              <div key={index} className={styles.faqBloco}>
                <button
                  type="button"
                  onClick={() => alternarPergunta(idUnico)}
                  className={`${styles.perguntaBotao} ${estaAberto ? styles.aberto : ""}`}
                >
                  <span>{item.q}</span>
                  <span
                    className={`${styles.seta} ${estaAberto ? styles.abertoIcone : ""}`}
                  >
                    <FiChevronDown />
                  </span>
                </button>

                {estaAberto && (
                  <div className={styles.respostaCard}>
                    <p className={styles.respostaTexto}>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className={styles.contato}>
        <h2 className={styles.contatoTitulo}>Ainda ficou com alguma dúvida?</h2>

        <p className={styles.contatoTexto}>
          Entre em contato com nossa equipe.
        </p>

        <Link to="/Suporte" className={styles.contatoBotao}>
          Entrar em Contato
        </Link>
      </div>
    </div>
  );
}
