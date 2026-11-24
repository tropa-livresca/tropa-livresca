import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Carregando from "../../components/Carregando/Carregando";
import MainLayout from "../../components/MainLayout/MainLayout";
import useAuth from "../../../common/hooks/useAuth";
import Modal from "../../../common/components/Modal/Modal";
import modalStyles from "../../../common/components/Modal/Modal.module.css";
import { PerfilProvider } from "../../context/Perfil.jsx";
import { CarrinhoProvider } from "../loja/context/Carrinho.jsx";

const DadosBancarios = lazy(
  () => import("../perfil/pages/DadosBancarios/DadosBancarios.jsx"),
);

const NotFound = lazy(
  () =>
    import("../../../common/features/paginasErro/pages/NotFound/NotFound.jsx"),
);

const PoliticaPrivacidade = lazy(
  () =>
    import("../institucional/pages/PoliticaPrivacidade/PoliticaPrivacidade.jsx"),
);

const Inicio = lazy(() => import("../institucional/pages/Inicio/Inicio"));
const TrocarSenha = lazy(
  () => import("../perfil/pages/TrocarSenha/TrocarSenha"),
);
const SobreAutopublicacao = lazy(
  () =>
    import("../institucional/pages/SobreAutopublicacao/SobreAutopublicacao"),
);
const Perfil = lazy(() => import("../perfil/pages/Perfil/Perfil"));
const Endereco = lazy(() => import("../perfil/pages/Endereco/Endereco"));
const FAQ = lazy(() => import("../suporte/pages/FAQ/FAQ"));
const Historia = lazy(() => import("../institucional/pages/Historia/Historia"));
const Autores = lazy(() => import("../autores/pages/Autores/Autores"));
const AutorById = lazy(() => import("../autores/pages/AutorById/AutorById"));
const MeusLivros = lazy(
  () => import("../autopublicacao/pages/MeusLivros/MeusLivros"),
);
const EditarLivro = lazy(
  () => import("../autopublicacao/pages/EditarLivro/EditarLivro"),
);
const Livros = lazy(() => import("../livros/pages/Livros/Livros"));
const Visualizar = lazy(
  () => import("../autopublicacao/pages/Visualizar/Visualizar"),
);
const NovoLivro = lazy(
  () => import("../autopublicacao/pages/NovoLivro/NovoLivro"),
);
const LivroById = lazy(() => import("../livros/pages/LivroById/LivroById"));
const Suporte = lazy(() => import("../suporte/pages/Suporte/Suporte"));
const Loja = lazy(() => import("../loja/pages/Loja/Loja"));
const Carrinho = lazy(() => import("../loja/pages/Carrinho/Carrinho"));
const ProdutoById = lazy(
  () => import("../loja/pages/ProdutoById/ProdutoById.jsx"),
);
const ResumoCompra = lazy(
  () => import("../loja/pages/ResumoCompra/ResumoCompra.jsx"),
);
const MeusPedidos = lazy(
  () => import("../loja/pages/MeusPedidos/MeusPedidos.jsx"),
);
const BibliotecaPessoal = lazy(
  () => import("../loja/pages/BibliotecaPessoal/BibliotecaPessoal.jsx"),
);
const MeusGanhos = lazy(
  () => import("../ganhos/pages/MeusGanhos/MeusGanhos.jsx"),
);
const Pagamento = lazy(() => import("../loja/pages/Pagamento/Pagamento.jsx"));
const PagamentoCartao = lazy(
  () => import("../loja/pages/PagamentoCartao/PagamentoCartao.jsx"),
);
const PagamentoPix = lazy(
  () => import("../loja/pages/PagamentoPix/PagamentoPix.jsx"),
);
const PagamentoBoleto = lazy(
  () => import("../loja/pages/PagamentoBoleto/PagamentoBoleto.jsx"),
);

const Private = ({ Item }) => {
  const { signed, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return null;

  if (signed) return <Item />;

  const voltar = () => {
    if (location.key === "default") {
      navigate("/", { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <Modal
      title="Acesse sua conta"
      description="Entre ou crie uma conta para continuar. Se preferir, você pode voltar à página anterior."
      onClose={voltar}
    >
      <div className={modalStyles.acoes}>
        <button
          type="button"
          className={modalStyles.botao}
          onClick={() =>
            navigate("/auth/login", {
              state: { from: location },
            })
          }
        >
          Login
        </button>

        <button
          type="button"
          className={`${modalStyles.botao} ${modalStyles.botaoSecundario}`}
          onClick={() =>
            navigate("/auth/cadastro", {
              state: { from: location },
            })
          }
        >
          Cadastre-se
        </button>

        <button
          type="button"
          className={`${modalStyles.botao} ${modalStyles.botaoSecundario}`}
          onClick={voltar}
        >
          Agora não
        </button>
      </div>
    </Modal>
  );
};

const RoutesClients = () => {
  return (
    <CarrinhoProvider>
      <PerfilProvider>
        <Suspense fallback={<Carregando />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Inicio />} />
              <Route
                path="/perfil/dadosbancarios"
                element={<DadosBancarios />}
              />
              <Route path="/historia" element={<Historia />} />
              <Route
                path="/sobreautopublicacao"
                element={<SobreAutopublicacao />}
              />
              <Route
                path="/politica-de-privacidade"
                element={<PoliticaPrivacidade />}
              />
              <Route path="/loja" element={<Loja />} />
              <Route
                path="/bibliotecapessoal"
                element={<Private Item={BibliotecaPessoal} />}
              />
              <Route path="/pagamento" element={<Pagamento />} />
              <Route
                path="/pagamento/cartao"
                element={<Private Item={PagamentoCartao} />}
              />
              <Route
                path="/pagamento/pix"
                element={<Private Item={PagamentoPix} />}
              />
              <Route
                path="/pagamento/boleto"
                element={<Private Item={PagamentoBoleto} />}
              />
              <Route path="/carrinho" element={<Carrinho />} />
              <Route path="/loja/livro/:id" element={<ProdutoById />} />
              <Route
                path="/checkout/:frete/:mod"
                element={<Private Item={Pagamento} />}
              />
              <Route
                path="/pedido/:id"
                element={<Private Item={ResumoCompra} />}
              />
              <Route path="/pedidos" element={<Private Item={MeusPedidos} />} />
              <Route
                path="/meus-ganhos"
                element={<Private Item={MeusGanhos} />}
              />
              <Route path="/autores" element={<Autores />} />
              <Route path="/autores/:id" element={<AutorById />} />
              <Route path="/FAQ" element={<FAQ />} />
              <Route path="/suporte" element={<Suporte />} />
              <Route
                path="/meuslivros"
                element={<Private Item={MeusLivros} />}
              />
              <Route path="/livros" element={<Livros />} />
              <Route path="/livros/:id" element={<LivroById />} />
              <Route path="/perfil" element={<Private Item={Perfil} />} />
              <Route
                path="/perfil/senha"
                element={<Private Item={TrocarSenha} />}
              />
              <Route
                path="/perfil/endereco"
                element={<Private Item={Endereco} />}
              />
              <Route
                path="/novo-livro"
                element={<Private Item={NovoLivro} />}
              />
              <Route
                path="/editar-livro/:id"
                element={<Private Item={EditarLivro} />}
              />
              <Route
                path="/visualizar-livro/:id"
                element={<Private Item={Visualizar} />}
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PerfilProvider>
    </CarrinhoProvider>
  );
};

export default RoutesClients;
