import styles from "./SobreAutopublicacao.module.css";
import { Link } from "react-router-dom";

export default function SobreAutopublicacao() {
  return (
    <div className={styles.home_wrapper}>
      <div className={styles.topo}>
      <section className={styles.hero_section}>
        <div className={styles.hero_content}>
          <span className={styles.hero_tagline}>A Jornada do Autor</span>
          <h1>O Processo de Autopublicação</h1>
          <p>
            Entenda como funciona o caminho que transforma seus originais em uma obra 
            publicada, mantendo o controle absoluto sobre a sua criação.
          </p>
          <div className={styles.hero_actions}>
            <Link to="/auth/cadastro" className={styles.btn_primary}>Começar Publicação</Link>
            <Link to="/livros" className={styles.btn_secondary}>Conhecer o Catálogo</Link>
          </div>
        </div>
      </section>
      </div>
      <div class={styles.divisao}></div>
      <div className={styles.container}>
      <div className={styles.subcontainer}>
      <section className={styles.secao_texto}>
        <article className={styles.artigo_fluxo}>
          <div className={styles.card}>
          <h2>Liberdade Editorial e Formatos</h2>
          <p>
            Na autopublicação, você assume o papel de editor do seu próprio livro. Isso significa que você mantém o controle total sobre o conteúdo, o design da capa, a formatação, o preço de venda e as estratégias de divulgação, sem depender da aprovação ou dos critérios de uma editora tradicional. Qualquer gênero literário é bem-vindo em nossa plataforma — desde ficção, não-ficção e poesia até quadrinhos e livros técnicos —, contanto que as obras respeitem nossas diretrizes de comunidade, que proíbem estritamente plágio, pirataria, discurso de ódio ou pornografia explícita.
          </p>
          <p>
            Para dar vida ao projeto, o processo começa no envio do miolo do livro, aceito nos formatos DOCX, PDF e EPUB. No caso de e-books, não há qualquer limitação quanto ao volume de páginas. Já para as versões físicas, que operam sob o modelo de impressão sob demanda, as restrições são puramente técnicas e ligadas à gráfica: os livros precisam conter entre 32 e 48 páginas no mínimo para viabilizar a encadernação em lombada quadrada. Recomenda-se também que o arquivo final para impressão seja enviado em PDF com todas as fontes devidamente incorporadas, garantindo que o layout saia idêntico ao planejado.
          </p>
          </div>
          <div className={styles.card}>
          <h2>Direitos Autorais e Proteção Jurídica</h2>
          <p>
            Um dos maiores pilares deste modelo é que você continua sendo o dono de 100% dos seus direitos autorais. A Tropa Livresca atua exclusivamente como uma distribuidora e facilitadora de publicação, conferindo ao escritor a liberdade de retirar a obra do ar ou atualizar seus arquivos a qualquer momento. Além disso, não exigimos nenhum tipo de exclusividade, deixando o autor livre para comercializar seu livro em qualquer outro canal, site ou editora parceira simultaneamente.
          </p>
          <p>
            Embora o registro prévio da obra não seja uma exigência legal para a publicação, recomendamos fortemente que você faça o registro de direitos autorais na Biblioteca Nacional ou via ferramentas de blockchain antes da divulgação pública, assegurando sua proteção jurídica. Em relação às burocracias de mercado, como a emissão do código ISBN e da Ficha Catalográfica, os autores podem realizar o processo diretamente no site da Câmara Brasileira do Livro (CBL) ou optar pelos serviços opcionais de emissão oferecidos pela nossa própria plataforma durante as etapas de cadastro.
          </p>
          </div>
          <div className={styles.card}>
          <h2>Produção Inteligente e Impressão Sob Demanda</h2>
          <p>
            A plataforma opera por padrão no modelo "faça você mesmo", fornecendo gabaritos em formatos PDF e PSD na Área do Autor para auxiliar no dimensionamento correto da capa — cujo tamanho exato de lombada é calculado automaticamente com base no número final de páginas. Caso o escritor sinta a necessidade de suporte especializado, dispomos de serviços profissionais adicionais contratados à parte para revisão gramatical, diagramação interna e criação de arte de capa personalizada.
          </p>
          <p>
            A grande inovação para o livro físico reside na Impressão Sob Demanda (POD). Com ela, você elimina o principal obstáculo financeiro da publicação independente: não há necessidade de investir dinheiro em grandes tiragens iniciais nem se preocupar com logística de estoque. Quando um leitor realiza a compra em nossa loja virtual, o pedido é disparado diretamente para a gráfica parceira. Eles imprimem um único exemplar correspondente àquela venda e cuidam de toda a distribuição, postagem e entrega na casa do comprador. Como autor, você ganha ainda o benefício de comprar exemplares da sua própria obra pagando apenas o preço de custo da impressão somado ao frete, formato ideal para eventos de lançamento, palestras ou vendas diretas.
          </p>
          </div>
          <div className={styles.card2}>
          <h2>Precificação Transparente e Royalties</h2>
          <p>
            Publicar na plataforma é um processo totalmente gratuito. Não há taxas ou custos ocultos para cadastrar e disponibilizar seus e-books ou livros físicos em nossa vitrine; o sistema é remunerado exclusivamente através de uma comissão retida no ato de cada venda realizada. 
          </p>
          <p>
            A definição do preço final de venda fica inteiramente sob a sua autonomia. O painel calcula e informa o valor mínimo operacional necessário para cobrir os custos gráficos de produção e as taxas da plataforma. A partir desse piso, você adiciona a margem de comissão que deseja receber. O cálculo é totalmente transparente: seus royalties serão proporcionais ao valor estabelecido por você. O saldo acumulado dessas vendas é transferido de forma automática mensalmente para sua conta bancária até o dia 15 do mês subsequente, bastando atingir o valor mínimo de resgate de R$ 50,00.
          </p>
          </div>
        </article>
      </section>
            </div>
              </div>
      <div class={styles.divisao}></div>
<div className={styles.container}>
      <div className={styles.subcontainer}>
      <section className={styles.contato}>
        <h2 className={styles.contatoTitulo}>Ainda ficou com alguma dúvida?</h2>
        <p className={styles.contatoTexto}>
          Nossa equipe está pronta para orientar você em todas as etapas da jornada literária.
        </p>
        <Link to="/Suporte" className={styles.contatoBotao}>
          Entrar em Contato
        </Link>
      </section>
    
</div>
</div>
    </div>
  );
}
