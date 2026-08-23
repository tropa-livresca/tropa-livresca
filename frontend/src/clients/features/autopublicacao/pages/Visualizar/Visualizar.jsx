import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMeusLivros } from "../../hooks/useMeusLivros.js";
import styles from "./Visualizar.module.css";
import Carregando from "../../../../components/Carregando/Carregando";

export default function Visualizar() {
    const { id } = useParams();
    const { buscarLivroById, carregando, livroSelecionado } = useMeusLivros();

    useEffect(() => {
        if (id) {
            buscarLivroById(id);
        }
    }, [id, buscarLivroById]);

    if (carregando) {
        return <Carregando mensagem="Carregando manuscrito..."/>;
    }

    if (!livroSelecionado) {
        return <div className={styles.error}>Livro não encontrado</div>;
    }

    const {
        titulo,
        estado,
        subtitulo,
        capa,
        manuscrito,
        autor_nome,
        autor_sobrenome,
        descricao,
        idioma,
        imagens_explicitas,
        publico_alvo,
        numero_edicao,
        preco_digital,
        preco_fisico,
        colaboradores,
        direitos_de_publicacao,
        conteudo_por_IA,
    } = livroSelecionado;

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <span className={`${styles.badge} ${styles[estado]}`}>{estado}</span>
                    <h1 className={styles.titulo}>{titulo}</h1>
                    {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
                    <p className={styles.autor}>Por: <strong>{autor_nome} {autor_sobrenome}</strong></p>
                </div>
                <div className={styles.headerActions}>
                    {estado === "rascunho" && (
                        <Link to={`/editar-livro/${id}`} className={`${styles.btn} ${styles.btnPrimary}`}>
                            Editar Livro
                        </Link>
                    )}
                    <Link to="/meuslivros" className={`${styles.btn} ${styles.btnSecondary}`}>
                        Voltar ao Painel
                    </Link>
                </div>
            </header>

            <section className={styles.layoutGrid}>
                <div className={styles.mainContent}>
                    <div className={styles.card}>
                        <h2>Sinopse / Descrição</h2>
                        <p className={styles.descricao}>{descricao || "Nenhuma descrição informada."}</p>
                    </div>

                    {manuscrito && (
                        <div className={styles.card}>
                            <h2>Visualização do Manuscrito</h2>
                            <div className={styles.pdfWrapper}>
                                <object data={manuscrito} type="application/pdf" width="100%" height="650px">
                                    <p className={styles.vazio}>
                                        Seu navegador não suporta a exibição de PDFs.{" "}
                                        <a href={manuscrito} download target="_blank" rel="noreferrer" className={styles.btnlivro}>
                                            Clique aqui para baixar o arquivo.
                                        </a>
                                    </p>
                                </object>
                            </div>
                        </div>
                    )}
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.card}>
                        <h2>Preços de Venda</h2>
                        <div className={styles.precosGrid}>
                            <div className={styles.precoItem}>
                                <span>Físico</span>
                                <strong>R$ {preco_fisico || "0,00"}</strong>
                            </div>
                            <div className={styles.precoItem}>
                                <span>Digital</span>
                                <strong>R$ {preco_digital || "0,00"}</strong>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2>Metadados e Regras</h2>
                        <ul className={styles.metaList}>
                            <li><span>Idioma:</span> <strong>{idioma}</strong></li>
                            <li><span>Edição:</span> <strong>{numero_edicao || "1"}</strong></li>
                            <li><span>Público-alvo:</span> <strong>{publico_alvo}</strong></li>
                            <li><span>Imagens Explícitas:</span> <strong>{imagens_explicitas ? "Sim" : "Não"}</strong></li>
                            <li><span>Conteúdo por IA:</span> <strong>{conteudo_por_IA ? "Sim" : "Não"}</strong></li>
                            <li><span>Direitos de Autopublicação:</span> <strong>{direitos_de_publicacao ? "Sim" : "Não"}</strong></li>
                            <li>
                                <span>Colaboradores:</span>
                                <div>
                                    {Array.isArray(colaboradores) && colaboradores.length > 0 ? (
                                        colaboradores.map((colab, index) => (
                                            <div key={index} className={styles.colabItem}>
                                                {colab.nome} {colab.sobrenome} ({colab.funcao})
                                            </div>
                                        ))
                                    ) : (
                                        <strong>Nenhum informado</strong>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>

                    {(capa?.frente || capa?.verso) && (
                        <div className={styles.card}>
                            <h2>Capas do Livro</h2>
                            <div className={styles.capasContainer}>
                                {capa?.frente && (
                                    <div className={styles.capaBox}>
                                        <span>Frente</span>
                                        <img src={capa.frente} alt="Capa Frente" />
                                    </div>
                                )}
                                {capa?.verso && (
                                    <div className={styles.capaBox}>
                                        <span>Verso</span>
                                        <img src={capa.verso} alt="Capa Verso" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </aside>
            </section>
        </main>
    );
}
