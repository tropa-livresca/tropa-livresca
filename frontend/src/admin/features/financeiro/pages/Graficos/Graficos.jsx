import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
  Cell,
  Text,
} from "recharts";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

import { useEffect, useState } from "react";
import { useGraficos } from "../../hooks/useGraficos.js";
import Carregando from "../../../../components/Carregando/Carregando";
import DescricaoTela from "../../../../../clients/components/DescricaoTela/DescricaoTela.jsx";

import styles from "./Graficos.module.css";

const CORES = [
  "#67170c",
  "#d4b46a",
  "#a8442f",
  "#8c6a2f",
  "#c9998d",
  "#432c28",
  "#7a6a5b",
];

const COR_LIVROS = "#67170c";
const COR_AUTORES = "#c8a45c";

const COR_TEXTO = { fill: "var(--cor-texto-muted)" };

const FONTE_NUMERO = { fontFamily: "none" };
const LINHA_EIXO = { stroke: "#e3d5ad" };

const nomePeriodo = {
  "7d": (
    <>
      Últimos <span className={styles.numero}>7</span> dias
    </>
  ),
  "30d": (
    <>
      Últimos <span className={styles.numero}>30</span> dias
    </>
  ),
  "90d": (
    <>
      Últimos <span className={styles.numero}>90</span> dias
    </>
  ),
  mes: "Este mês",
  ano: "Este ano",
};

function TickNumero({ x, y, payload }) {
  return (
    <text
      x={x}
      y={y}
      dy="0.71em"
      textAnchor="middle"
      fontSize={12}
      style={{ ...COR_TEXTO, ...FONTE_NUMERO }}
    >
      {payload.value}
    </text>
  );
}

const ALINHAMENTO_NOMES = "middle";

function TickCategoria({ y, width, payload }) {
  const larguraNomes = (width ?? 140) - 12;

  return (
    <Text
      x={ALINHAMENTO_NOMES === "middle" ? larguraNomes / 2 : 0}
      y={y}
      width={larguraNomes}
      textAnchor={ALINHAMENTO_NOMES}
      verticalAnchor="middle"
      fontSize={12}
      style={COR_TEXTO}
    >
      {payload.value}
    </Text>
  );
}

function GraficoVazio() {
  return (
    <div className={styles.vazio}>
      Não existem dados de vendas para o período selecionado.
    </div>
  );
}

function TooltipVendas({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className={styles.tooltip}>
      <strong>{label ?? payload[0].name}</strong>
      <p>
        Exemplares vendidos:{" "}
        <span className={styles.numero}>
          {Number(payload[0].value).toLocaleString("pt-BR")}
        </span>
      </p>
    </div>
  );
}

function RotuloPizza({ x, y, cx, genero, percent }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      style={COR_TEXTO}
    >
      <tspan>{genero} (</tspan>
      <tspan style={FONTE_NUMERO}>{(percent * 100).toFixed(1)}%</tspan>
      <tspan>)</tspan>
    </text>
  );
}

export default function Graficos() {
  const { buscarEstatisticasVendas, dados, carregando } = useGraficos();

  const [periodo, setPeriodo] = useState("30d");
  const [periodoAberto, setPeriodoAberto] = useState(false);

  useEffect(() => {
    buscarEstatisticasVendas(periodo);
  }, [buscarEstatisticasVendas, periodo]);

  const selecionarPeriodo = (valor) => {
    setPeriodo(valor);
    setPeriodoAberto(false);
  };

  const topLivros = dados?.topLivros ?? [];
  const generos = dados?.generos ?? [];
  const autores = dados?.autores ?? [];

  if (carregando) {
    return <Carregando mensagem="Procurando os dados..." />;
  }

  const livrosOrdenados = [...topLivros]
    .sort((a, b) => Number(b.total_vendido) - Number(a.total_vendido))
    .slice(0, 3)
    .map((livro) => ({
      ...livro,
      totalVendido: Number(livro.total_vendido),
    }));

  const generosOrdenados = [...generos]
    .sort((a, b) => Number(b.total_vendido) - Number(a.total_vendido))
    .map((genero) => ({
      ...genero,
      totalVendido: Number(genero.total_vendido),
    }));

  const autoresOrdenados = [...autores]
    .sort((a, b) => Number(b.total_vendido) - Number(a.total_vendido))
    .map((autor) => ({
      ...autor,
      nomeCompleto: `${autor.autor_nome} ${autor.autor_sobrenome}`.trim(),
      totalVendido: Number(autor.total_vendido),
    }));

  return (
    <main>
      <DescricaoTela
        titulo="Bem-vindo(a) ao painel administrativo!"
        descricao="Gerencie livros, revisões e pedidos da Tropa Livresca. Usuários e
          desempenho financeiro ficam para quem tem acesso master."
      />

      <div className={styles.container}>
        <div className={styles.cabecalho}>
          <h2 className={styles.secaoTitulo}>Estatísticas de vendas</h2>

          <div className={styles.filtros}>
            <span className={styles.rotulo}>Período dos dados</span>

            <div className={styles.selectCustom}>
              <button
                type="button"
                className={styles.selectBotao}
                onClick={() => setPeriodoAberto(!periodoAberto)}
              >
                <span>{nomePeriodo[periodo]}</span>
                <FiChevronDown
                  className={periodoAberto ? styles.iconeAberto : ""}
                />
              </button>

              {periodoAberto && (
                <div className={styles.opcoes}>
                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      periodo === "7d" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarPeriodo("7d")}
                  >
                    {nomePeriodo["7d"]}
                  </button>

                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      periodo === "30d" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarPeriodo("30d")}
                  >
                    {nomePeriodo["30d"]}
                  </button>

                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      periodo === "90d" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarPeriodo("90d")}
                  >
                    {nomePeriodo["90d"]}
                  </button>

                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      periodo === "mes" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarPeriodo("mes")}
                  >
                    {nomePeriodo.mes}
                  </button>

                  <button
                    type="button"
                    className={`${styles.opcao} ${
                      periodo === "ano" ? styles.opcaoSelecionada : ""
                    }`}
                    onClick={() => selecionarPeriodo("ano")}
                  >
                    {nomePeriodo.ano}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className={styles.grade}>
          <article className={styles.card}>
            <h2>
              Top <span className={styles.numero}>3</span> livros mais vendidos
            </h2>
            <p className={styles.descricao}>
              Livros com maior quantidade de exemplares vendidos.
            </p>

            {livrosOrdenados.length === 0 ? (
              <GraficoVazio />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={livrosOrdenados}
                  layout="vertical"
                  margin={{ top: 10, right: 24, bottom: 10, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3d5ad" />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={<TickNumero />}
                    axisLine={LINHA_EIXO}
                    tickLine={LINHA_EIXO}
                  />

                  <YAxis
                    type="category"
                    dataKey="titulo"
                    width={140}
                    tick={<TickCategoria />}
                    axisLine={LINHA_EIXO}
                    tickLine={LINHA_EIXO}
                  />

                  <Tooltip
                    content={<TooltipVendas />}
                    cursor={{ fill: " #fff9e9" }}
                  />

                  <Bar
                    dataKey="totalVendido"
                    name="Exemplares vendidos"
                    fill={COR_LIVROS}
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </article>

          <article className={styles.card}>
            <h2>Gêneros mais vendidos</h2>
            <p className={styles.descricao}>
              Distribuição de exemplares vendidos por categoria.
            </p>

            {generosOrdenados.length === 0 ? (
              <GraficoVazio />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={generosOrdenados}
                    dataKey="totalVendido"
                    nameKey="genero"
                    cx="50%"
                    cy="45%"
                    outerRadius={100}
                    label={<RotuloPizza />}
                    labelLine={{ stroke: "var(--cor-texto-muted)" }}
                  >
                    {generosOrdenados.map((genero, index) => (
                      <Cell
                        key={genero.genero}
                        fill={CORES[index % CORES.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<TooltipVendas />} />

                  <Legend
                    formatter={(valor) => (
                      <span className={styles.legenda}>{valor}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </article>

          <article className={`${styles.card} ${styles.cardLargo}`}>
            <h2>Autores que mais venderam</h2>
            <p className={styles.descricao}>
              Ranking de autores por quantidade de exemplares vendidos.
            </p>

            {autoresOrdenados.length === 0 ? (
              <GraficoVazio />
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(320, autoresOrdenados.length * 45)}
              >
                <BarChart
                  data={autoresOrdenados}
                  layout="vertical"
                  margin={{ top: 10, right: 24, bottom: 10, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3d5ad" />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={<TickNumero />}
                    axisLine={LINHA_EIXO}
                    tickLine={LINHA_EIXO}
                  />

                  <YAxis
                    type="category"
                    dataKey="nomeCompleto"
                    width={160}
                    tick={<TickCategoria />}
                    axisLine={LINHA_EIXO}
                    tickLine={LINHA_EIXO}
                  />

                  <Tooltip
                    content={<TooltipVendas />}
                    cursor={{ fill: "#fff9e9" }}
                  />

                  <Bar
                    dataKey="totalVendido"
                    name="Exemplares vendidos"
                    fill={COR_AUTORES}
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </article>
        </section>

        <p className={styles.rodape}>
          Esqueceu sua senha de administrador?{" "}
          <Link to="/admin/configuracoes/novasenha" className={styles.link}>
            Alterar minha senha
          </Link>
        </p>
      </div>
    </main>
  );
}
