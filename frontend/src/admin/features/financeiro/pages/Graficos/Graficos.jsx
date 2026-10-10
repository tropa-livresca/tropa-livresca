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
} from "recharts";

import { useEffect, useState } from "react";
import { useGraficos } from "../../hooks/useGraficos.js";
import Carregando from "../../../../components/Carregando/Carregando";
import DescricaoTela from "../../../../../clients/components/DescricaoTela/DescricaoTela.jsx";

import styles from "./Graficos.module.css";

const CORES = [
  "#6D4AFF",
  "#9278FF",
  "#B5A5FF",
  "#D0C5FF",
  "#E4DEFF",
  "#8B5CF6",
  "#A78BFA",
];

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
        Exemplares vendidos: {Number(payload[0].value).toLocaleString("pt-BR")}
      </p>
    </div>
  );
}

export default function Graficos() {
  const { buscarEstatisticasVendas, dados, carregando } = useGraficos();

  const [periodo, setPeriodo] = useState("30d");

  useEffect(() => {
    buscarEstatisticasVendas(periodo);
  }, [buscarEstatisticasVendas, periodo]);

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
    <main className={styles.container}>
      <DescricaoTela
        titulo="Gráficos de Venda"
        descricao="Visualize as estatísticas de vendas em gráficos interativos."
      />

      <div className={styles.filtros}>
        <label htmlFor="periodo">Período dos dados</label>

        <select
          id="periodo"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="mes">Este mês</option>
          <option value="ano">Este ano</option>
        </select>
      </div>

      <section className={styles.grade}>
        <article className={styles.card}>
          <h2>Top 3 livros mais vendidos</h2>
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
                margin={{ top: 10, right: 24, bottom: 10, left: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" allowDecimals={false} />

                <YAxis
                  type="category"
                  dataKey="titulo"
                  width={140}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip content={<TooltipVendas />} />

                <Bar
                  dataKey="totalVendido"
                  name="Exemplares vendidos"
                  fill="#6D4AFF"
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
                  label={({ genero, percent }) =>
                    `${genero} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {generosOrdenados.map((genero, index) => (
                    <Cell
                      key={genero.genero}
                      fill={CORES[index % CORES.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(valor) => [
                    Number(valor).toLocaleString("pt-BR"),
                    "Exemplares vendidos",
                  ]}
                />

                <Legend />
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
                margin={{ top: 10, right: 24, bottom: 10, left: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" allowDecimals={false} />

                <YAxis
                  type="category"
                  dataKey="nomeCompleto"
                  width={160}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip content={<TooltipVendas />} />

                <Bar
                  dataKey="totalVendido"
                  name="Exemplares vendidos"
                  fill="#8B5CF6"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </article>
      </section>
    </main>
  );
}
