import styles from "../../../suporte/pages/FAQ/FAQ.module.css";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import politicaPrivacidadePdf from "../../utils/POLÍTICA_DE_PRIVACIDADE_TROPA_LIVRESCA_ABNT.pdf";

export default function PoliticaPrivacidade() {
  const faqData = {
    "Privacidade e Proteção de Dados": [
      {
        q: "O que é a Política de Privacidade da Tropa Livresca?",
        a: "A Política de Privacidade explica quais dados pessoais podem ser coletados pela Tropa Livresca, como esses dados são utilizados, para quais finalidades são tratados, com quem podem ser compartilhados, por quanto tempo podem ser armazenados e quais são os direitos dos titulares.",
      },
      {
        q: "A Tropa Livresca segue a LGPD?",
        a: "Sim. O tratamento de dados pessoais realizado pela Tropa Livresca observa, conforme aplicável, a Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD), o Marco Civil da Internet e demais normas brasileiras aplicáveis à proteção da privacidade e dos dados pessoais.",
      },
      {
        q: "Quem é responsável pelo tratamento dos meus dados?",
        a: "O controlador responsável pelas decisões referentes ao tratamento dos dados pessoais é Gabriel Rodrigues Duarte. O canal para assuntos relacionados à privacidade e proteção de dados é o e-mail suporte.tropalivresca@gmail.com.",
      },
      {
        q: "A Tropa Livresca vende meus dados pessoais?",
        a: "Não. A Tropa Livresca não comercializa dados pessoais dos usuários como produto.",
      },
    ],

    "Dados Pessoais": [
      {
        q: "Quais dados pessoais podem ser coletados?",
        a: "Dependendo das funcionalidades utilizadas, poderão ser tratados dados como nome, sobrenome, endereço de e-mail, telefone, credenciais de acesso, imagem de perfil, descrição, redes sociais, informações de autoria e outros dados fornecidos voluntariamente pelo usuário.",
      },
      {
        q: "Quais dados são coletados durante o uso da plataforma?",
        a: "Durante o acesso e a utilização da plataforma, poderão ser registrados dados técnicos e de navegação, como páginas e funcionalidades acessadas, URL de origem, termos utilizados nas buscas, interações com conteúdos e perfis, comentários, avaliações e outras informações inseridas pelo usuário.",
      },
      {
        q: "A Tropa Livresca coleta dados pessoais sensíveis?",
        a: "A Tropa Livresca não pretende coletar dados pessoais sensíveis como regra geral para o funcionamento da plataforma. Caso alguma funcionalidade futura envolva esse tipo de tratamento, serão observadas a finalidade e a base legal aplicável de acordo com a legislação vigente.",
      },
      {
        q: "Meu telefone, endereço ou foto de perfil são dados sensíveis?",
        a: "Não. O endereço, o número de telefone e a imagem de perfil, por si só, não são classificados como dados pessoais sensíveis pela LGPD.",
      },
    ],

    "Conta e Perfil": [
      {
        q: "Para que meus dados de cadastro são utilizados?",
        a: "Os dados de cadastro podem ser utilizados para criar e gerenciar sua conta, realizar autenticação, disponibilizar funcionalidades restritas, manter informações do perfil e permitir a recuperação e o gerenciamento da conta.",
      },
      {
        q: "Quais informações do meu perfil podem ficar públicas?",
        a: "Dependendo das funcionalidades utilizadas, poderão ser disponibilizados publicamente o nome do autor, informações de autoria, imagem de perfil adicionada para esse fim, descrição do perfil, redes sociais informadas voluntariamente e outras informações que você escolha disponibilizar publicamente.",
      },
      {
        q: "Minha senha fica pública no meu perfil?",
        a: "Não. Informações destinadas exclusivamente à autenticação ou à comunicação, como credenciais de acesso, não são destinadas à publicação no perfil público.",
      },
      {
        q: "Posso controlar quais informações do meu perfil são públicas?",
        a: "As informações disponibilizadas publicamente dependem das funcionalidades da plataforma e das informações que você escolher fornecer para essa finalidade. Recomenda-se evitar inserir informações pessoais desnecessárias em áreas públicas.",
      },
    ],

    "Autopublicação e Revisão": [
      {
        q: "Quais dados são tratados quando envio um livro para autopublicação?",
        a: "Podem ser tratados dados de identificação do autor, informações bibliográficas, título, subtítulo, informações sobre edição e publicação, descrição, categoria, palavras-chave, informações sobre direitos de publicação, informações relacionadas ao público da obra, manuscrito, capas, imagens e dados relacionados ao processo de revisão e publicação.",
      },
      {
        q: "Quem pode acessar o conteúdo que envio para autopublicação?",
        a: "O conteúdo e os metadados enviados poderão ser acessados por administradores e pessoas autorizadas para finalidades como análise, revisão, moderação, processamento, publicação e atendimento de solicitações relacionadas à obra.",
      },
      {
        q: "O conteúdo do meu livro fica público quando envio para revisão?",
        a: "Não necessariamente. Durante o processo de autopublicação e revisão, o conteúdo enviado poderá ser acessado por administradores e pessoas autorizadas para a realização do processo. Caso a obra seja aprovada e publicada, as informações destinadas à divulgação poderão ser disponibilizadas publicamente.",
      },
      {
        q: "O que acontece com uma obra rejeitada ou retirada?",
        a: "Obras rejeitadas ou retiradas poderão continuar armazenadas pelo período necessário para cumprir obrigações legais, exercer direitos, manter registros administrativos ou atender às finalidades legítimas relacionadas ao serviço.",
      },
      {
        q: "Quais informações do meu livro podem ser divulgadas publicamente?",
        a: "Quando uma obra for publicada, poderão ser disponibilizados publicamente dados destinados à divulgação, como informações bibliográficas, nome do autor, capa, informações de autoria e conteúdo destinado à apresentação da obra.",
      },
    ],

    "Compras e Pagamentos": [
      {
        q: "Quais dados são tratados quando realizo uma compra?",
        a: "Poderão ser tratados os dados necessários à identificação do comprador, processamento do pedido e pagamento, entrega do produto, emissão de documentos necessários, prevenção de fraudes e cumprimento de obrigações legais e contratuais.",
      },
      {
        q: "A Tropa Livresca armazena os dados completos do meu cartão?",
        a: "A Tropa Livresca não deverá armazenar dados completos de cartão de pagamento quando a operação puder ser realizada diretamente por um provedor especializado. Caso a plataforma utilize efetivamente um intermediador de pagamentos, seu nome deverá ser informado nesta Política de Privacidade antes da publicação.",
      },
      {
        q: "Meus dados podem ser enviados para um intermediador de pagamentos?",
        a: "Sim. Quando necessário para realizar uma transação, os dados indispensáveis ao processamento do pagamento poderão ser encaminhados a instituições financeiras, processadores ou intermediadores de pagamento, observando-se o princípio da necessidade.",
      },
      {
        q: "Quais dados podem ser utilizados para entregar uma compra?",
        a: "Poderão ser utilizados os dados necessários para realizar a entrega do produto e cumprir as obrigações relacionadas ao pedido, incluindo as informações necessárias para identificar o comprador e o endereço de entrega, quando aplicável.",
      },
    ],

    "Remuneração dos Autores": [
      {
        q: "A Tropa Livresca pode armazenar meus dados bancários?",
        a: "Caso a plataforma disponibilize mecanismos de remuneração aos autores, poderão ser solicitados e armazenados dados bancários ou outros dados financeiros necessários para realizar os pagamentos, como instituição financeira, agência, conta, titular da conta e chave PIX, quando aplicável.",
      },
      {
        q: "Quais informações financeiras podem ficar registradas na minha conta?",
        a: "Quando necessário para o funcionamento dos serviços financeiros, poderão ser armazenados informações como saldo, histórico de vendas e valores a receber ou decorrentes de remunerações realizadas pela plataforma.",
      },
      {
        q: "Para que meus dados bancários são utilizados?",
        a: "Os dados financeiros poderão ser utilizados para realizar pagamentos e remunerações aos autores, controlar valores decorrentes de vendas e cumprir obrigações legais, contratuais e administrativas relacionadas às operações financeiras.",
      },
    ],

    "Compartilhamento de Dados": [
      {
        q: "Com quem meus dados pessoais podem ser compartilhados?",
        a: "Os dados poderão ser compartilhados, quando necessário, com fornecedores especializados em hospedagem, infraestrutura, armazenamento de dados e arquivos, autenticação, processamento de pagamentos, comunicação, segurança, manutenção técnica e outros serviços necessários ao funcionamento da plataforma.",
      },
      {
        q: "A Tropa Livresca compartilha meus dados com autoridades?",
        a: "Sim, quando houver obrigação legal, regulatória, ordem judicial ou determinação de autoridade competente.",
      },
      {
        q: "Meus dados podem ser enviados para outros países?",
        a: "Sim. Alguns fornecedores utilizados pela plataforma poderão estar localizados fora do Brasil ou utilizar infraestrutura localizada em outros países. Quando houver transferência internacional de dados, serão observadas as hipóteses e garantias previstas na legislação brasileira e na regulamentação aplicável da ANPD.",
      },
      {
        q: "A Tropa Livresca compartilha informações que eu mesmo tornei públicas?",
        a: "Sim. Informações que o próprio usuário escolheu disponibilizar publicamente, especialmente relacionadas ao perfil de autor e à publicação de livros, poderão ser acessadas por outros usuários e terceiros.",
      },
    ],

    "Cookies e Armazenamento": [
      {
        q: "A Tropa Livresca utiliza cookies?",
        a: "A Tropa Livresca poderá utilizar cookies e tecnologias semelhantes para autenticação, manutenção da sessão, segurança, armazenamento de preferências, funcionamento de funcionalidades e análise de utilização da plataforma, quando aplicável.",
      },
      {
        q: "Posso desativar os cookies?",
        a: "Sim. O usuário poderá controlar ou excluir cookies por meio das configurações do navegador. Entretanto, a desativação de determinados cookies poderá impedir ou prejudicar o funcionamento de algumas funcionalidades da plataforma.",
      },
      {
        q: "Por quanto tempo meus dados são armazenados?",
        a: "Os dados pessoais serão armazenados pelo período necessário para cumprir as finalidades descritas na Política, manter a conta e fornecer os serviços, cumprir obrigações legais, regulatórias e contratuais, exercer direitos, prevenir fraudes e manter registros necessários à segurança e ao funcionamento da plataforma.",
      },
      {
        q: "Excluir minha conta apaga imediatamente todos os meus dados?",
        a: "Não necessariamente. Alguns dados poderão precisar ser conservados quando houver fundamento legal para sua manutenção, como cumprimento de obrigações legais ou regulatórias, exercício regular de direitos, prevenção de fraudes, segurança ou manutenção de registros necessários à prestação de contas.",
      },
    ],

    "Segurança e Incidentes": [
      {
        q: "Como a Tropa Livresca protege meus dados?",
        a: "A Tropa Livresca adota medidas técnicas e administrativas destinadas a proteger os dados pessoais contra acessos não autorizados, perda, destruição, alteração indevida, divulgação não autorizada e tratamento inadequado ou ilícito. Essas medidas podem incluir controle de acesso, autenticação, conexões seguras, proteção de credenciais, restrição de acesso administrativo e monitoramento dos sistemas.",
      },
      {
        q: "A Tropa Livresca pode garantir que meus dados estão 100% seguros?",
        a: "Não. Embora sejam adotadas medidas de segurança adequadas aos riscos envolvidos, nenhum sistema conectado à internet é absolutamente seguro. Por isso, não é possível garantir proteção absoluta contra todos os eventos.",
      },
      {
        q: "O que devo fazer para proteger minha conta?",
        a: "O usuário deve manter suas credenciais em segurança, utilizar senha forte, não compartilhar sua senha, utilizar dispositivos confiáveis, manter seus dispositivos atualizados e comunicar imediatamente atividades suspeitas relacionadas à conta.",
      },
      {
        q: "O que acontece se houver um incidente de segurança?",
        a: "A Tropa Livresca mantém procedimentos para identificação, avaliação, contenção e tratamento de incidentes. Caso um incidente possa acarretar risco ou dano relevante aos titulares, serão adotadas as providências previstas na legislação e na regulamentação da ANPD, incluindo, quando aplicável, a comunicação à ANPD e aos titulares afetados.",
      },
    ],

    "Direitos dos Titulares": [
      {
        q: "Quais são meus direitos sobre meus dados pessoais?",
        a: "Nos termos da LGPD, o titular poderá, conforme aplicável, solicitar confirmação da existência de tratamento, acesso aos dados, correção, anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade, portabilidade nos termos da regulamentação aplicável, informações sobre compartilhamentos, revogação do consentimento, oposição a determinados tratamentos e outros direitos previstos na legislação.",
      },
      {
        q: "Posso solicitar a correção dos meus dados?",
        a: "Sim. O titular poderá solicitar a correção de dados pessoais incompletos, inexatos ou desatualizados, observados os procedimentos e limites previstos na legislação aplicável.",
      },
      {
        q: "Posso solicitar a exclusão dos meus dados?",
        a: "Sim, quando aplicável. Entretanto, determinados dados poderão precisar ser conservados quando houver fundamento legal, como cumprimento de obrigação legal, exercício regular de direitos, prevenção de fraudes ou outras hipóteses previstas na LGPD.",
      },
      {
        q: "Posso retirar meu consentimento?",
        a: "Sim, quando o tratamento estiver baseado em consentimento. A retirada do consentimento não prejudicará a legalidade dos tratamentos realizados anteriormente com fundamento no consentimento.",
      },
      {
        q: "Como posso exercer meus direitos?",
        a: "Para solicitar informações ou exercer direitos relacionados à proteção de dados pessoais, o titular poderá entrar em contato pelo e-mail suporte.tropalivresca@gmail.com. Sempre que possível, deverá informar seu nome, o e-mail utilizado na plataforma, o direito que pretende exercer e uma descrição da solicitação.",
      },
    ],

    "Crianças e Adolescentes": [
      {
        q: "A Tropa Livresca pode tratar dados de crianças e adolescentes?",
        a: "Caso a plataforma permita o cadastro ou a utilização por crianças e adolescentes, o tratamento de seus dados será realizado observando o melhor interesse desses titulares e as disposições específicas da legislação aplicável.",
      },
      {
        q: "A plataforma possui restrição de idade?",
        a: "Caso determinadas funcionalidades tenham restrição de idade, a Tropa Livresca poderá adotar mecanismos razoáveis para impedir ou limitar o acesso quando exigido pela legislação.",
      },
    ],

    "Decisões Automatizadas": [
      {
        q: "A Tropa Livresca toma decisões automatizadas sobre os usuários?",
        a: "A Tropa Livresca poderá utilizar dados de utilização da plataforma para compreender o funcionamento dos serviços e melhorar suas funcionalidades. Não serão realizadas decisões exclusivamente automatizadas que produzam efeitos jurídicos ou afetem significativamente os interesses do usuário, salvo quando houver funcionalidade específica para essa finalidade e forem observados os direitos previstos na legislação.",
      },
    ],

    "Dados de Terceiros": [
      {
        q: "Posso fornecer dados pessoais de outra pessoa?",
        a: "O usuário deverá fornecer dados pessoais de terceiros somente quando possuir autorização ou outra base legal adequada para fazê-lo.",
      },
      {
        q: "Posso colocar dados pessoais de terceiros no meu livro ou conteúdo?",
        a: "O usuário deve evitar inserir dados pessoais de terceiros em manuscritos, descrições, comentários, avaliações ou outros conteúdos públicos quando essas informações não forem necessárias. A Tropa Livresca poderá adotar medidas para remover ou restringir conteúdos que envolvam exposição indevida de dados pessoais.",
      },
    ],

    "Encerramento da Conta e Alterações": [
      {
        q: "Como posso encerrar minha conta?",
        a: "O usuário poderá solicitar o encerramento de sua conta pelos canais disponibilizados pela plataforma. Após a solicitação, os dados poderão ser eliminados, anonimizados ou conservados conforme a finalidade e as hipóteses previstas na legislação.",
      },
      {
        q: "O que acontece com meus livros publicados se eu excluir minha conta?",
        a: "A exclusão da conta poderá não resultar automaticamente na remoção de todas as informações relacionadas a uma obra publicada. Alguns registros poderão ser mantidos quando necessários para preservar informações de autoria, publicação, vendas, cumprimento de obrigações legais ou exercício regular de direitos.",
      },
      {
        q: "A Política de Privacidade pode ser alterada?",
        a: "Sim. A Política poderá ser atualizada para refletir alterações na legislação, orientações da ANPD, mudanças nos serviços, novas funcionalidades, alterações nos fornecedores ou mudanças nas formas de tratamento dos dados pessoais.",
      },
      {
        q: "Como saberei quando a Política de Privacidade for atualizada?",
        a: "A versão mais recente estará disponível na plataforma e a data da última atualização será indicada no início da Política. Quando uma alteração for relevante e exigir comunicação aos usuários, a Tropa Livresca poderá utilizar meios de contato disponíveis, como e-mail ou aviso na plataforma.",
      },
    ],

    "Contato e Encarregado": [
      {
        q: "Como posso entrar em contato sobre privacidade?",
        a: "Para dúvidas, solicitações, reclamações ou exercício de direitos relacionados à privacidade e à proteção de dados pessoais, entre em contato pelo e-mail suporte.tropalivresca@gmail.com.",
      },
      {
        q: "Quem é o encarregado pelo tratamento de dados?",
        a: "Consta atualmente como encarregado Gabriel Rodrigues Duarte. Caso a Tropa Livresca se enquadre como agente de tratamento de pequeno porte e esteja dispensada da indicação de encarregado nos termos da regulamentação da ANPD, o canal de comunicação suporte.tropalivresca@gmail.com será utilizado para atendimento dos titulares.",
      },
      {
        q: "Qual é a data da última atualização da Política de Privacidade?",
        a: "A última atualização indicada na Política de Privacidade é de 02/10/2026.",
      },
    ],
  };

  const [perguntaAberta, setPerguntaAberta] = useState(null);

  const alternarPergunta = (chaveUnica) => {
    setPerguntaAberta(perguntaAberta === chaveUnica ? null : chaveUnica);
  };

  return (
    <div>
      <DescricaoTela
        titulo="Política de Privacidade"
        descricao="Encontre respostas para as dúvidas mais comuns."
      />

      <a
        href={politicaPrivacidadePdf}
        download="Politica-de-Privacidade-Tropa-Livresca.pdf"
        className={styles.botaoDownload}
      >
        Baixar Política
      </a>

      <div className={styles.container}>
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
      </div>
      <div className={styles.divisao}></div>
      <div className={styles.container}>
        <div className={styles.subcontainer}>
          <div className={styles.contato}>
            <h2 className={styles.contatoTitulo}>
              Ainda ficou com alguma dúvida?
            </h2>

            <p className={styles.contatoTexto}>
              Entre em contato com nossa equipe.
            </p>

            <Link to="/Suporte" className={styles.contatoBotao}>
              Entrar em Contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
