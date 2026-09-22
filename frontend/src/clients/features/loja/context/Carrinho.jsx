import { useState, useEffect } from "react";
import { CarrinhoContext } from "./CarrinhoContext";

export const CarrinhoProvider = ({ children }) => {
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
          item.id === produto.id && item.tipo === produto.tipo
            ? {
                ...item,
                quantidade: item.quantidade + (produto.quantidade || 1),
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
          ? { ...item, quantidade: item.quantity - 1 }
          : item,
      );
    });
  };

  const excluirItem = (id, tipo) => {
    setItens((itensAtuais) =>
      itensAtuais.filter((item) => !(item.id === id && item.tipo === tipo)),
    );
  };

  const limparCarrinho = () => setItens([]);

  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0);
  const valorSubtotal = itens.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
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
        quantidadeTotal,
        valorSubtotal,
        valorFrete,
        valorTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
