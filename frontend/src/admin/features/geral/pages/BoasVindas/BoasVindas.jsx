import { Link } from "react-router-dom";
import useAdmin from "../../../../../common/hooks/useAdmin";
import styles from "./BoasVindas.module.css";

export default function BoasVindas() {
  const { user } = useAdmin();
  const isMaster = !!user?.is_master;

  return (
    <section className={styles.boasVindas}>
      <div className={styles.apresentacao}>
        <h1 className={styles.titulo}>
          Bem-vindo(a) ao painel administrativo!
        </h1>
        <p className={styles.texto}>
          Gerencie livros, revisões e pedidos da Tropa Livresca. Usuários e
          desempenho financeiro ficam para quem tem acesso master.
        </p>
      </div>

      <div className={styles.container}>
        <h3 className={styles.subtitulo}>Atalhos</h3>
        <div className={styles.atalhos}>
          <Link to="/admin/livros/painel" className={styles.atalho}>
            <span className={styles.atalhoTitulo}>Painel de livros</span>
            <span className={styles.atalhoTexto}>
              Consulte e gerencie os livros do catálogo.
            </span>
          </Link>

          <Link to="/admin/livros/revisoes" className={styles.atalho}>
            <span className={styles.atalhoTitulo}>Revisões</span>
            <span className={styles.atalhoTexto}>
              Acompanhe as revisões das obras em andamento.
            </span>
          </Link>

          <Link to="/admin/ecommerce/pedidos" className={styles.atalho}>
            <span className={styles.atalhoTitulo}>Pedidos e entregas</span>
            <span className={styles.atalhoTexto}>
              Veja os pedidos da loja e o status das entregas.
            </span>
          </Link>

          {isMaster && (
            <>
              <Link to="/admin/usuarios" className={styles.atalho}>
                <span className={styles.atalhoTitulo}>Usuários</span>
                <span className={styles.atalhoTexto}>
                  Gerencie as contas cadastradas no site.
                </span>
              </Link>

              <Link to="/admin/analises/financeiro" className={styles.atalho}>
                <span className={styles.atalhoTitulo}>Financeiro</span>
                <span className={styles.atalhoTexto}>
                  Acompanhe as movimentações financeiras.
                </span>
              </Link>

              <Link to="/admin/analises/graficos" className={styles.atalho}>
                <span className={styles.atalhoTitulo}>Gráficos</span>
                <span className={styles.atalhoTexto}>
                  Veja o desempenho da editora em gráficos.
                </span>
              </Link>
            </>
          )}
        </div>

        <h3 className={styles.subtitulo}>Bom saber</h3>
        <ul className={styles.lembretes}>
          <li className={styles.lembrete}>
            Só obras em revisão podem ser publicadas, negadas ou devolvidas ao
            autor para correção.
          </li>
          <li className={styles.lembrete}>
            Uma obra negada ou devolvida para correção volta para revisão quando
            o autor a reenvia.
          </li>
          <li className={styles.lembrete}>
            Uma obra publicada não volta para revisão pelo painel.
          </li>
        </ul>

        <p className={styles.rodape}>
          Você também pode navegar pelo menu lateral.{" "}
          <Link to="/admin/configuracoes/novasenha" className={styles.link}>
            Alterar minha senha
          </Link>
        </p>
      </div>
    </section>
  );
}
