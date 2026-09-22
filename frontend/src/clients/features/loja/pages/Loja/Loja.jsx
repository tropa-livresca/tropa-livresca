import styles from "./Loja.module.css";
import { FaSearch } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Loja() {
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Loja</h1>
        <p>
          Nosso site é feito por quem respira livros, pensando na melhor
          experiência para você.
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.containerlivros}>
          <div className={styles.filtros}>
            <div className={styles.oi}>
              <h1>Gênero</h1>
            </div>
            <ul>
              <li>Romance</li>
              <li>Fantasia</li>
              <li>Ficção Científica</li>
              <li>Mistério</li>
              <li>Terror</li>
              <li>Aventura</li>
              <li>Drama</li>
              <li>Suspense</li>
              <li>História</li>
            </ul>
          </div>
          <div className={styles.form}>
            <form onSubmit className={styles.busca}>
              <span className={styles.iconebusca}>
                <FaSearch />
              </span>

              <input
                className={styles.inputBusca}
                type="text"
                placeholder="Buscar livro"
              />

              <div className={styles.selectContainer}>
                <div
                  className={styles.select}
                  onClick={() =>
                    setDropdownAberto(
                      dropdownAberto === "filtro" ? null : "filtro",
                    )
                  }
                >
                  <span>
                    {filtro === "alfabetico"
                      ? "Ordem Alfabética"
                      : filtro === "data"
                        ? "Data de Publicação"
                        : "Ordenar por"}
                  </span>

                  <FiChevronDown
                    className={
                      dropdownAberto === "filtro" ? styles.setaAberta : ""
                    }
                  />
                </div>

                {dropdownAberto === "filtro" && (
                  <div className={styles.options}>
                    <div onClick={() => handleFiltro("")}>
                      <span>Ordenar por</span>
                    </div>

                    <div onClick={() => handleFiltro("alfabetico")}>
                      <span>Ordem Alfabética</span>
                    </div>

                    <div onClick={() => handleFiltro("data")}>
                      <span>Data de Publicação</span>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className={styles.btnbuscar}>
                Buscar
              </button>
            </form>
          </div>
          <div className={styles.carrinho}>
            <Link to="/carrinho">
              <FiShoppingCart />
            </Link>
          </div>

          <div className={styles.livros}>
            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg" className={styles.capa}/>
              {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>As Aventuras de David Balls</h3>
              <p className={styles.autor}>DVD balls</p>
              <h2><span className={styles.numero}>R$ 42,00</span></h2>
              </Link>
              </div>
              
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            <div className={styles.cardLivro}>
              <Link to="/" className={styles.linkCapa}>
              <div className={styles.capaContainer}>
              <img src="https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg" className={styles.capa}/>
                {/* else <div className={styles.semImagem}> Sem imagem </div>*/}
              </div>
              </Link>

              <div className={styles.infoLivro}>
                <Link>
              <h3>A Volta Dos Que Não Foram</h3>
              <p className={styles.autor}>Lukas Soldera</p>
              <h2><span className={styles.numero}>R$ 67,00</span></h2>
              </Link>
              </div>   
            </div>

            
          </div>
        </div>
        <div className={styles.paginacao}>
                  <button
                    onClick={() =>
                      setPaginaAtual((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={paginaAtual === 1}
                  >
                    Anterior
                  </button>
      
                  <span>
                    Página {paginaAtual} 
                  </span>
      
                  <button
                    onClick={() =>
                      setPaginaAtual((prev) =>
                        Math.min(prev)
                      )
                    }
                    disabled={paginaAtual}
                  >
                    Próximo
                  </button>
                </div>
      </div>
    </main>
  );
}
