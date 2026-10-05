
import { useState, useEffect } from "react";
import { CarrinhoContext } from "./CarrinhoContext";
import { apiFetch } from "../../../../common/services/api";

export const CarrinhoProvider = ({ children }) => {
  const [carregando, setCarregando] = useState(false);
  const [frete, setFrete] = useState(0);

  const [itens, setItens] = useState(() => {
    try {
      const salvo = localStorage.getItem("@loja-livros:carrinho");
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("@loja-livros:carrinho", JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = (produto) => {
    setItens((itensAtuais) => {
      const itemExistente = itensAtuais.find(
        (item) => item.id === produto.id && item.tipo === produto.tipo,
      );

      if (itemExistente) {
        return itensAtuais.map((item) =>
          item.id === produto.id && item.tipo === produto.tipo && item.tipo == "fisico"
            ? {
                ...item,
                quantidade: Number(item.quantidade) + (Number(produto.quantidade) || 1),
              }
            : item,
        );
      }

      return [
        ...itensAtuais,
        { ...produto, quantidade: produto.quantidade || 1 },
      ];
    });
  };

  const removerQuantidade = (id, tipo) => {
    setItens((itensAtuais) => {
      const itemExistente = itensAtuais.find(
        (item) => item.id === id && item.tipo === tipo,
      );

      if (!itemExistente) return itensAtuais;

      if (itemExistente.quantidade === 1) {
        return itensAtuais.filter(
          (item) => !(item.id === id && item.tipo === tipo),
        );
      }

      return itensAtuais.map((item) =>
        item.id === id && item.tipo === tipo
          ? { ...item, quantidade: item.quantidade - 1 }
          : item,
      );
    });
  };

  const excluirItem = (id, tipo) => {
    setItens((itensAtuais) =>
      itensAtuais.filter((item) => !(item.id === id && item.tipo === tipo)),
    );
  };

  const calcularFrete = async (produtos) => {
    setCarregando(true);
    try{

      const inicio = "";
      const queryProdutos = produtos.reduce((inicio, produto) => {"{"+"tipo:"+produto.tipo+","+"quantidade:"+produto.quantidade+"},"})


      const response = await apiFetch(`/api/v1/clients/loja/frete?itensVenda=[${queryProdutos}]`)

      if(!response.ok){
        console.error("Erro ao calcular frete:", response.error);
        return;
      }

      const res = response.json();

      setFrete(res.preco);

    }catch(err){
       console.error("Erro ao calcular frete:", err);
    }finally{
      setCarregando(false)
    }
  };

  const limparCarrinho = () => setItens([]);

  const quantidadeTotal = itens.reduce(
    (acc, item) => acc + Number(item.quantidade),
    0,
  );
  const valorSubtotal = itens.reduce(
    (acc, item) => acc + item.preco * Number(item.quantidade),
    0,
  );

  const temFisico = itens.some((item) => item.tipo === "Físico");
  const valorFrete = temFisico && valorSubtotal < 150 ? 15.0 : 0.0;
  const valorTotal = valorSubtotal + valorFrete;

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarItem,
        removerQuantidade,
        excluirItem,
        limparCarrinho,
        calcularFrete,
        quantidadeTotal,
        valorSubtotal,
        valorFrete,
        valorTotal,
        frete,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};


