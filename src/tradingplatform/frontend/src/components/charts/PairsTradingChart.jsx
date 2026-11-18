import { useEffect, useRef, useState } from "react";
import { createChart, LineSeries, createSeriesMarkers } from "lightweight-charts";

function PairsTradingChart({ result, currencies }) {
  const normalizedChartRef = useRef(null);
  const zscoreChartRef = useRef(null);
  const correlationChartRef = useRef(null);

  const signalMarkersRef = useRef(null);

  const [showSignals, setShowSignals] = useState(true);

  const cryptoA = currencies.find(
    (currency) => String(currency.id) === String(result.crypto1)
  );
  const cryptoB = currencies.find(
    (currency) => String(currency.id) === String(result.crypto2)
  );

  const symbolA = cryptoA?.symbol || "Asset A";
  const symbolB = cryptoB?.symbol || "Asset B";

  const useZscore = result.parameters?.use_zscore === true;
  const useCorrelation = result.parameters?.use_correlation === true;
  const useCointegration = result.parameters?.use_cointegration === true;

  const pvalue = result.metrics?.cointegration_pvalue;
  const cointegrationThreshold = result.parameters?.cointegration_pvalue_threshold ?? 0.05;
  const isCointegrated = pvalue !== null && pvalue !== undefined && !isNaN(pvalue) && pvalue <= cointegrationThreshold;

  useEffect(() => {
    if (!result?.data?.length || !normalizedChartRef.current) {
      return;
    }

    const commonOptions = {
      layout: { textColor: "#374151", background: { color: "#ffffff" } },
      grid: { vertLines: { color: "#f3f4f6" }, horzLines: { color: "#f3f4f6" } },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 0,
        minBarSpacing: 0.01,
        fixLeftEdge: false,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: true
      },
      crosshair: { mode: 1 }
    };

    // 1. Normalized Price Chart
    const normalizedChart = createChart(normalizedChartRef.current, {
      ...commonOptions,
      width: normalizedChartRef.current.clientWidth,
      height: 400
    });

    const seriesA = normalizedChart.addSeries(LineSeries, {
      color: "#2563eb", lineWidth: 2, title: `${symbolA} (Log)`
    });

    const seriesB = normalizedChart.addSeries(LineSeries, {
      color: "#f59e0b", lineWidth: 2, title: `${symbolB} (Beta-Adjusted Log)`
    });

    seriesA.setData(
      result.data
        .filter((item) => item.normalized_a !== null && item.normalized_a !== undefined)
        .map((item) => ({ time: Math.floor(new Date(item.timestamp).getTime() / 1000), value: Number(item.normalized_a) }))
    );

    seriesB.setData(
      result.data
        .filter((item) => item.normalized_b !== null && item.normalized_b !== undefined)
        .map((item) => ({ time: Math.floor(new Date(item.timestamp).getTime() / 1000), value: Number(item.normalized_b) }))
    );

    signalMarkersRef.current = createSeriesMarkers(seriesA, []);
    normalizedChart.timeScale().fitContent();

    // 2. Z-Score Chart
    let zscoreChart = null;
    if (useZscore && zscoreChartRef.current) {
      zscoreChart = createChart(zscoreChartRef.current, {
        ...commonOptions,
        width: zscoreChartRef.current.clientWidth,
        height: 380
      });

      const zscoreSeries = zscoreChart.addSeries(LineSeries, {
        color: "#000000", lineWidth: 2
      });

      zscoreSeries.setData(
        result.data
          .filter((item) => item.z_score !== null && item.z_score !== undefined)
          .map((item) => ({ time: Math.floor(new Date(item.timestamp).getTime() / 1000), value: Number(item.z_score) }))
      );

      const exitLevel = Number(result.parameters?.zscore_exit ?? 0.0);
      zscoreSeries.createPriceLine({ price: exitLevel, color: "#6b7280", lineWidth: 1, lineStyle: 0, axisLabelVisible: true, title: 'Exit' });

      if (result.parameters?.zscore_short_entry !== undefined) {
        zscoreSeries.createPriceLine({ price: Number(result.parameters.zscore_short_entry), color: "#dc2626", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: 'Short Entry' });
      }

      if (result.parameters?.zscore_long_entry !== undefined) {
        zscoreSeries.createPriceLine({ price: Number(result.parameters.zscore_long_entry), color: "#16a34a", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: 'Long Entry' });
      }

      if (result.parameters?.use_stop_loss && result.parameters?.zscore_stop_loss !== undefined) {
        const stopVal = Math.abs(Number(result.parameters.zscore_stop_loss));
        zscoreSeries.createPriceLine({ price: stopVal, color: "#991b1b", lineWidth: 1, lineStyle: 3, axisLabelVisible: true, title: 'Stop Short' });
        zscoreSeries.createPriceLine({ price: -stopVal, color: "#991b1b", lineWidth: 1, lineStyle: 3, axisLabelVisible: true, title: 'Stop Long' });
      }

      zscoreChart.timeScale().fitContent();
    }

    // 3. Correlation Chart
    let correlationChart = null;
    if (useCorrelation && correlationChartRef.current) {
      correlationChart = createChart(correlationChartRef.current, {
        ...commonOptions,
        width: correlationChartRef.current.clientWidth,
        height: 250
      });

      const corrSeries = correlationChart.addSeries(LineSeries, {
        color: "#000000", lineWidth: 2, title: "Rolling Correlation"
      });

      corrSeries.setData(
        result.data
          .filter((item) => item.rolling_correlation !== null && item.rolling_correlation !== undefined)
          .map((item) => ({ time: Math.floor(new Date(item.timestamp).getTime() / 1000), value: Number(item.rolling_correlation) }))
      );

      if (result.parameters?.correlation_threshold !== undefined) {
        corrSeries.createPriceLine({ price: Number(result.parameters.correlation_threshold), color: "#6b7280", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: 'Min Threshold' });
      }

      correlationChart.timeScale().fitContent();
    }

    const charts = [normalizedChart];
    if (zscoreChart) charts.push(zscoreChart);
    if (correlationChart) charts.push(correlationChart);

    let isSyncing = false;
    const subscriptions = [];

    charts.forEach((sourceChart) => {
      const handler = (logicalRange) => {
        if (isSyncing || !logicalRange) return;
        isSyncing = true;
        charts.forEach((targetChart) => {
          if (targetChart !== sourceChart) {
            targetChart.timeScale().setVisibleLogicalRange(logicalRange);
          }
        });
        isSyncing = false;
      };
      sourceChart.timeScale().subscribeVisibleLogicalRangeChange(handler);
      subscriptions.push({ chart: sourceChart, handler });
    });

    const resizeObservers = [];
    const chartContainers = [{ chart: normalizedChart, ref: normalizedChartRef.current }];
    if (zscoreChart) chartContainers.push({ chart: zscoreChart, ref: zscoreChartRef.current });
    if (correlationChart) chartContainers.push({ chart: correlationChart, ref: correlationChartRef.current });

    chartContainers.forEach(({ chart, ref }) => {
      if (!ref) return;
      const observer = new ResizeObserver(() => {
        chart.applyOptions({ width: ref.clientWidth });
      });
      observer.observe(ref);
      resizeObservers.push(observer);
    });

    return () => {
      resizeObservers.forEach((observer) => observer.disconnect());
      subscriptions.forEach(({ chart, handler }) => {
        chart.timeScale().unsubscribeVisibleLogicalRangeChange(handler);
      });
      normalizedChart.remove();
      if (zscoreChart) zscoreChart.remove();
      if (correlationChart) correlationChart.remove();
      signalMarkersRef.current = null;
    };
  }, [result, useZscore, useCorrelation, symbolA, symbolB]);

  // Signal markers
  useEffect(() => {
    if (!signalMarkersRef.current || !result?.data) return;

    if (!showSignals) {
      signalMarkersRef.current.setMarkers([]);
      return;
    }

    const markers = result.data
      .map((item) => {
        const time = Math.floor(new Date(item.timestamp).getTime() / 1000);
        if (!time || !item.signal || item.signal === "hold") return null;

        if (item.signal === "long") return { time, position: "belowBar", color: "#16a34a", shape: "arrowUp", text: "Long" };
        if (item.signal === "short") return { time, position: "aboveBar", color: "#dc2626", shape: "arrowDown", text: "Short" };
        if (item.signal.startsWith("exit")) {
          return { time, position: "aboveBar", color: "#6b7280", shape: "circle", text: "Exit" };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.time - b.time);

    const uniqueMarkers = [];
    let previousTime = null;
    markers.forEach((marker) => {
      if (marker.time === previousTime) return;
      uniqueMarkers.push(marker);
      previousTime = marker.time;
    });

    signalMarkersRef.current.setMarkers(uniqueMarkers);
  }, [result, showSignals]);
  return (
    <div className="strategy-chart">
      <div className="pair-trading-header">
        <h3>Pairs Trading: {symbolA} / {symbolB}</h3>
        {useCointegration && (
          <div className={`cointegration-badge ${isCointegrated ? "badge-healthy" : "badge-risk"}`}>
            {isCointegrated ? `Cointegrated (p ≤ ${cointegrationThreshold})` : "Non-Cointegrated (High Drift Risk)"}
          </div>
        )}
      </div>

      <div className="chart-container">
        <div className="chart-title-row">
          <h4>Logarithmic Price Tracking</h4>
          <span className="chart-subtext">Visualizing the structural gap between the reference asset and beta-adjusted target</span>
        </div>
        <div ref={normalizedChartRef} className="normalized-chart" />
      </div>

      <div className="chart-control-row chart-control-right">
        <div className="toggle-container">
          <label className="toggle-switch">
            <input type="checkbox" checked={showSignals} onChange={(e) => setShowSignals(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label-text">
            Trade Signals {showSignals ? "(On)" : "(Off)"}
          </span>
        </div>
      </div>

      {useZscore && (
        <div className="chart-container">
          <div className="chart-title-row">
            <h4>Spread Equilibrium Z-Score & Bands</h4>
            <span className="chart-subtext">Residual mean-reversion with triggers and stop thresholds</span>
          </div>
          <div ref={zscoreChartRef} className="zscore-chart" />
        </div>
      )}

      {useCorrelation && (
        <div className="chart-container">
          <div className="chart-title-row">
            <h4>Rolling Correlation</h4>
            <span className="chart-subtext">Short-term directional alignment constraint</span>
          </div>
          <div ref={correlationChartRef} className="correlation-chart" />
        </div>
      )}
    </div>
  );
}

export default PairsTradingChart;