import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  
  const caminhos = location.pathname.split('/').filter(Boolean);

  const mapaDeNomes = {
    'meuslivros': 'Meus Livros',
    'visualizar': 'Visualizar Livro',
    'cadastro': 'Novo Livro'
  };

  return (
    <nav style={{ padding: '10px', fontSize: '14px' }}>
      <Link to="/">Início</Link>
      
      {caminhos.map((segmento, index) => {
        const urlCompleta = `/${caminhos.slice(0, index + 1).join('/')}`;
        
        const nomeFormatado = mapaDeNomes[segmento] || segmento.charAt(0).toUpperCase() + segmento.slice(1);

        return (
          <span key={urlCompleta}>
            <span style={{ margin: '0 8px', color: '#666' }}>&gt;&gt;</span>
            <Link to={urlCompleta}>{nomeFormatado}</Link>
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
