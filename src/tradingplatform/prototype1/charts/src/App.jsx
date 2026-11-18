import { useState, useRef, useCallback } from "react";

import TradingViewChart from "./TradingViewChart";
import RechartsChart from "./RechartsChart";
import EChartsChart from "./EChartsChart";
import PlotlyChart from "./PlotlyChart";

import "./App.css";


const BASE_URL = "http://127.0.0.1:8002";


function App() {

  const [timeframe, setTimeframe] =
    useState("1m");

  const [source, setSource] =
    useState("direct");

  const [limit, setLimit] =
    useState(10000);

  const [data, setData] =
    useState([]);

  const [benchmarkLoading, setBenchmarkLoading] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [benchmark, setBenchmark] =
    useState(null);

  const benchmarkIdRef =
    useRef(0);

  const chartStartTimes =
    useRef({});

  const sourceLabels = {
    direct: "Stored in DB",
    sql: "1m → SQL",
    python: "1m → Python",
  };

  const [chartTimes, setChartTimes] =
    useState({
      tradingview: null,
      recharts: null,
      echarts: null,
      plotly: null,
    });


  const startChartBenchmark =
    useCallback(() => {

      benchmarkIdRef.current += 1;

      const benchmarkId =
        benchmarkIdRef.current;

      const start =
        performance.now();

      chartStartTimes.current = {
        tradingview: {
          benchmarkId,
          start,
        },

        recharts: {
          benchmarkId,
          start,
        },

        echarts: {
          benchmarkId,
          start,
        },

        plotly: {
          benchmarkId,
          start,
        },
      };


      setChartTimes({
        tradingview: null,
        recharts: null,
        echarts: null,
        plotly: null,
      });

    }, []);


  const handleChartComplete =
    useCallback(
      (chartName) => {

        const timing =
          chartStartTimes.current[
            chartName
          ];

        if (!timing) {
          return;
        }

        if (
          timing.benchmarkId !==
          benchmarkIdRef.current
        ) {
          return;
        }

        const elapsed =
          performance.now() -
          timing.start;

        setChartTimes(
          (previous) => {

            if (
              previous[chartName] !== null
            ) {
              return previous;
            }


            return {
              ...previous,

              [chartName]:
                Number(
                  elapsed.toFixed(2)
                ),
            };
          }
        );


        delete chartStartTimes.current[
          chartName
        ];

      },
      []
    );

  async function loadData() {

    setLoading(true);
    setError("");
    setBenchmark(null);

    try {

      const params =
        new URLSearchParams({
          timeframe,
          source,
          limit: String(limit),
        });

      const response =
        await fetch(
          `${BASE_URL}/bitcoin?${params}`
        );

      if (!response.ok) {

        const body =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          body?.detail ||
          `HTTP ${response.status}`
        );
      }

      const result =
        await response.json();

      if (
        !Array.isArray(result.data)
      ) {

        throw new Error(
          "API returned invalid chart data."
        );
      }

      startChartBenchmark();

      setData(result.data);

    } catch (err) {

      setData([]);

      setError(
        err.message ||
        "Failed to load data."
      );

    } finally {

      setLoading(false);
    }
  }

async function runBenchmark() {

  setBenchmarkLoading(true);
  setBenchmark(null);
  setError("");

  try {

    const params =
      new URLSearchParams({
        timeframe,
        limit: String(limit),
      });

    const response =
      await fetch(
        `${BASE_URL}/benchmark?${params}`
      );

    if (!response.ok) {

      const body =
        await response
          .json()
          .catch(() => null);

      throw new Error(
        body?.detail ||
        `HTTP ${response.status}`
      );
    }

    const result =
      await response.json();

    setBenchmark(result);

  } catch (err) {

    setError(
      err.message ||
      "Benchmark failed."
    );

  } finally {

    setBenchmarkLoading(false);
  }
}

  return (
    <div className="app">

      <h1>
        Crypto Chart Benchmark
      </h1>

      <div className="controls">

        <div className="control">

          <label>
            Timeframe
          </label>

          <select
            value={timeframe}
            onChange={(event) => {

              setTimeframe(
                event.target.value
              );

              setData([]);

              setChartTimes({
                tradingview: null,
                recharts: null,
                echarts: null,
                plotly: null,
              });

            }}
          >
            <option value="1m">
              1 minute
            </option>

            <option value="1h">
              1 hour
            </option>

            <option value="1d">
              1 day
            </option>

          </select>

        </div>

        <div className="control">

          <label>
            Source
          </label>

          <select
            value={source}
            onChange={(event) =>
              setSource(
                event.target.value
              )
            }
          >
            <option value="direct">
              Stored in DB
            </option>

            <option value="sql">
              1m → SQL
            </option>

            <option value="python">
              1m → Python
            </option>

          </select>

        </div>

        <div className="control">

          <label>
            Candles
          </label>

          <input
            type="number"
            min="1"
            max="8000000"
            value={limit}
            onChange={(event) =>
              setLimit(
                Number(
                  event.target.value
                )
              )
            }
          />

        </div>

        <button
          onClick={loadData}
          disabled={loading || benchmarkLoading}
        >
          {loading
            ? "Loading..."
            : "Load data"}
        </button>

        <button
          onClick={runBenchmark}
          disabled={loading || benchmarkLoading}
        >
          {benchmarkLoading
            ? "Calculating..."
            : "Benchmark"}
        </button>

      </div>

      {benchmarkLoading && (

        <div className="benchmark-loading">
          Calculating database benchmark...
        </div>
      )}

      {loading && (
        <div className="loading">
          Loading Bitcoin data...
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        data.length === 0 && (
          <div className="loading">
            No data.
          </div>
        )}

            {benchmark && (

        <div className="benchmark">

          <h2>
            Database Benchmark
          </h2>

          <p>
            Timeframe:{" "}
            <strong>
              {benchmark.timeframe}
            </strong>
          </p>

          <p>
            Requested candles:{" "}
            <strong>
              {benchmark.requested_candles}
            </strong>
          </p>

          <div className="benchmark-results">

            <div>
              <strong>
                Stored in DB{" "}
              </strong>

              <span>
                 {benchmark.direct.total_ms}ms
              </span>
            </div>


            <div>
              <strong>
                1m → SQL{" "}
              </strong>

              <span>
                {benchmark.sql.total_ms}ms
              </span>
            </div>


            <div>
              <strong>
                1m → Python{" "}
              </strong>

              <span>
                {benchmark.python.total_ms}ms
              </span>
            </div>

          </div>

          <p className="fastest">
            Fastest:{" "}
            <strong>
              {sourceLabels[benchmark.fastest] || benchmark.fastest}
            </strong>
          </p>

        </div>
      )}

      {data.length > 0 && (

        <div className="chart-grid">

          <div className="chart-card">

            <div className="chart-header">

              <h2>
                TradingView Lightweight Charts
              </h2>

              <span>

                {chartTimes.tradingview !== null
                  ? `${chartTimes.tradingview} ms`
                  : "Rendering..."}

              </span>

            </div>

            <TradingViewChart
              data={data}
              onRenderComplete={() =>
                handleChartComplete(
                  "tradingview"
                )
              }
            />

          </div>

          <div className="chart-card">

            <div className="chart-header">

              <h2>
                Recharts
              </h2>

              <span>

                {chartTimes.recharts !== null
                  ? `${chartTimes.recharts} ms`
                  : "Rendering..."}

              </span>

            </div>

            <RechartsChart
              data={data}
              onRenderComplete={() =>
                handleChartComplete(
                  "recharts"
                )
              }
            />

          </div>

          <div className="chart-card">

            <div className="chart-header">

              <h2>
                Apache ECharts
              </h2>

              <span>

                {chartTimes.echarts !== null
                  ? `${chartTimes.echarts} ms`
                  : "Rendering..."}

              </span>

            </div>

            <EChartsChart
              data={data}
              onRenderComplete={() =>
                handleChartComplete(
                  "echarts"
                )
              }
            />

          </div>

          <div className="chart-card">

            <div className="chart-header">

              <h2>
                Plotly.js
              </h2>

              <span>

                {chartTimes.plotly !== null
                  ? `${chartTimes.plotly} ms`
                  : "Rendering..."}

              </span>

            </div>

            <PlotlyChart
              data={data}
              onRenderComplete={() =>
                handleChartComplete(
                  "plotly"
                )
              }
            />

          </div>

        </div>
      )}

    </div>
  );
}

export default App;