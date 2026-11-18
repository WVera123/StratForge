import { useEffect, useRef, useState } from "react";
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  LineSeries,
  HistogramSeries
} from "lightweight-charts";

function resizeChart(chart, container) {
  if (!chart || !container) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width > 0 && height > 0) chart.resize(width, height);
}

function timestampToUnixTime(timestamp) {
  if (!timestamp) return null;
  const milliseconds = new Date(timestamp).getTime();
  if (!Number.isFinite(milliseconds)) return null;
  return Math.floor(milliseconds / 1000);
}

function dateToUnixTime(date, endOfDay = false) {
  if (!date) return null;
  const suffix = endOfDay ? "T23:59:59Z" : "T00:00:00Z";
  const milliseconds = new Date(`${date}${suffix}`).getTime();
  if (!Number.isFinite(milliseconds)) return null;
  return Math.floor(milliseconds / 1000);
}

function isValidNumber(value) {
  return value !== null && value !== undefined && Number.isFinite(Number(value));
}

class ChannelBandRenderer {
  constructor(view, fillColor) {
    this.view = view;
    this.fillColor = fillColor || "rgba(37, 99, 235, 0.12)";
  }
  draw(target) {
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      const horizontalPixelRatio = scope.horizontalPixelRatio;
      const verticalPixelRatio = scope.verticalPixelRatio;
      const chart = this.view.chart;
      const series = this.view.series;
      const data = this.view.data;

      if (!chart || !series || !data || data.length < 2) return;

      const timeScale = chart.timeScale();
      const points = [];

      data.forEach((item) => {
        const x = timeScale.timeToCoordinate(item.time);
        const upper = series.priceToCoordinate(item.upper);
        const lower = series.priceToCoordinate(item.lower);

        if (x === null || x === undefined || upper === null || upper === undefined || lower === null || lower === undefined) {
          return;
        }

        points.push({
          x: x * horizontalPixelRatio,
          upper: upper * verticalPixelRatio,
          lower: lower * verticalPixelRatio,
        });
      });

      if (points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].upper);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].upper);
      }

      for (let i = points.length - 1; i >= 0; i--) {
        ctx.lineTo(points[i].x, points[i].lower);
      }

      ctx.closePath();
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    });
  }
}

class ChannelBandPaneView {
  constructor(chart, series, data, fillColor) {
    this.chart = chart;
    this.series = series;
    this.data = data;
    this._renderer = new ChannelBandRenderer(this, fillColor);
  }
  renderer() { return this._renderer; }
}

class ChannelBandPrimitive {
  constructor(chart, series, data, fillColor) {
    this.chart = chart;
    this.series = series;
    this.data = data;
    this._paneView = new ChannelBandPaneView(chart, series, data, fillColor);
  }
  paneViews() { return [this._paneView]; }
  attached({ requestUpdate }) { this._requestUpdate = requestUpdate; }
  detached() { this._requestUpdate = undefined; }
  updateAllViews() { if (this._requestUpdate) this._requestUpdate(); }
}

function MeanReversionChart({ result, currencies, startDate, endDate }) {
  const priceChartRef = useRef(null);
  const rsiChartRef = useRef(null);
  const zscoreChartRef = useRef(null);
  const macdChartRef = useRef(null);
  const adxChartRef = useRef(null);
  const signalMarkersRef = useRef(null);
  
  const [showSignals, setShowSignals] = useState(true);

  const crypto = currencies.find((currency) => String(currency.id) === String(result.crypto1));

  // Determine which features are active in the dataset
  const hasMACD = result.data?.some((item) => isValidNumber(item.macd));
  const hasADX = result.data?.some((item) => isValidNumber(item.adx));
  const hasDualMA = result.data?.some((item) => isValidNumber(item.short_ma) && isValidNumber(item.long_ma));
  const hasTripleMA = result.data?.some((item) => isValidNumber(item.triple_ma_fast));
  const hasDonchian = result.data?.some((item) => isValidNumber(item.donchian_upper) && isValidNumber(item.donchian_lower));
  const hasBB = result.data?.some((item) => isValidNumber(item.bb_upper) && isValidNumber(item.bb_lower));
  const hasATR = result.data?.some((item) => isValidNumber(item.atr_upper) && isValidNumber(item.atr_lower));
  const hasTrendSMA = result.data?.some((item) => isValidNumber(item.trend_sma));
  const hasMAExit = result.data?.some((item) => isValidNumber(item.ma_exit_line));
  const hasRSI = result.data?.some((item) => isValidNumber(item.rsi));
  const hasZScore = result.data?.some((item) => isValidNumber(item.z_score));
  const hasVWAP = result.data?.some((item) => isValidNumber(item.vwap));

  useEffect(() => {
    if (!result?.data?.length || !priceChartRef.current) return;

    const validData = result.data
      .map((item) => {
        const time = timestampToUnixTime(item.timestamp);
        if (time === null) return null;
        return { ...item, time };
      })
      .filter(Boolean)
      .sort((a, b) => a.time - b.time);

    const uniqueData = [];
    let previousTime = null;
    validData.forEach((item) => {
      if (item.time === previousTime) return;
      uniqueData.push(item);
      previousTime = item.time;
    });

    if (!uniqueData.length) return;

    const commonOptions = {
      grid: { vertLines: { color: "#e5e7eb" }, horzLines: { color: "#e5e7eb" } },
      crosshair: { mode: 1 },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 0,
        minBarSpacing: 0.01,
        fixLeftEdge: false,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: true
      }
    };

    const priceChart = createChart(priceChartRef.current, { ...commonOptions, width: priceChartRef.current.clientWidth, height: priceChartRef.current.clientHeight });

    const candleSeries = priceChart.addSeries(CandlestickSeries, {
      upColor: "#16a34a", downColor: "#dc2626", borderUpColor: "#16a34a", borderDownColor: "#dc2626", wickUpColor: "#16a34a", wickDownColor: "#dc2626"
    });

    const candleData = uniqueData
      .filter((item) => isValidNumber(item.open) && isValidNumber(item.high) && isValidNumber(item.low) && isValidNumber(item.close))
      .map((item) => ({ time: item.time, open: Number(item.open), high: Number(item.high), low: Number(item.low), close: Number(item.close) }));

    candleSeries.setData(candleData);
    signalMarkersRef.current = createSeriesMarkers(candleSeries, []);

    const getLineData = (field) => uniqueData
      .filter((item) => isValidNumber(item[field]))
      .map((item) => ({ time: item.time, value: Number(item[field]) }));

    // Price Overlays
    if (hasDualMA) {
      priceChart.addSeries(LineSeries, { color: "#22c55e", lineWidth: 1, title: "Fast MA" }).setData(getLineData("short_ma"));
      priceChart.addSeries(LineSeries, { color: "#ef4444", lineWidth: 2, title: "Slow MA" }).setData(getLineData("long_ma"));
    }

    if (hasTripleMA) {
      priceChart.addSeries(LineSeries, { color: "#22c55e", lineWidth: 1, title: "Fast Triple" }).setData(getLineData("triple_ma_fast"));
      priceChart.addSeries(LineSeries, { color: "#eab308", lineWidth: 1, title: "Med Triple" }).setData(getLineData("triple_ma_medium"));
      priceChart.addSeries(LineSeries, { color: "#ef4444", lineWidth: 2, title: "Slow Triple" }).setData(getLineData("triple_ma_slow"));
    }

    if (hasTrendSMA) {
      priceChart.addSeries(LineSeries, { color: "#000000", lineWidth: 2, title: "Macro Trend" }).setData(getLineData("trend_sma"));
    }

    if (hasMAExit) {
      priceChart.addSeries(LineSeries, { color: "#e11d48", lineWidth: 2, lineStyle: 2, title: "MA Exit" }).setData(getLineData("ma_exit_line"));
    }

    if (hasVWAP) {
      priceChart.addSeries(LineSeries, { color: "#f59e0b", lineWidth: 2, title: "VWAP" }).setData(getLineData("vwap"));
    }

    const drawChannel = (upperField, lowerField, lineColor, areaColor, titleBase, middleField = null) => {
      const upperSeries = priceChart.addSeries(LineSeries, { color: lineColor, lineWidth: 1, title: `${titleBase} High` });
      const lowerSeries = priceChart.addSeries(LineSeries, { color: lineColor, lineWidth: 1, title: `${titleBase} Low` });

      upperSeries.setData(getLineData(upperField));
      lowerSeries.setData(getLineData(lowerField));

      if (middleField) {
        const middleSeries = priceChart.addSeries(LineSeries, { color: "#64748b", lineWidth: 1 });
        middleSeries.setData(getLineData(middleField));
      }

      const bandData = uniqueData
        .filter((item) => isValidNumber(item[upperField]) && isValidNumber(item[lowerField]))
        .map((item) => ({ time: item.time, upper: Number(item[upperField]), lower: Number(item[lowerField]) }));

      if (bandData.length > 0) {
        upperSeries.attachPrimitive(new ChannelBandPrimitive(priceChart, upperSeries, bandData, areaColor));
      }
    };

    if (hasDonchian) drawChannel("donchian_upper", "donchian_lower", "#64748b", "rgba(100, 116, 139, 0.1)", "Donchian", "donchian_middle");
    if (hasBB) drawChannel("bb_upper", "bb_lower", "#2563eb", "rgba(37, 99, 235, 0.12)", "Bollinger", "bb_middle");
    if (hasATR) drawChannel("atr_upper", "atr_lower", "#f97316", "rgba(249, 115, 22, 0.12)", "ATR");

    // Sub-Indicators
    let rsiChart = null;
    if (hasRSI && rsiChartRef.current) {
      rsiChart = createChart(rsiChartRef.current, { ...commonOptions, width: rsiChartRef.current.clientWidth, height: 150 });
      const rsiSeries = rsiChart.addSeries(LineSeries, { color: "#000000", lineWidth: 2 });
      rsiSeries.setData(getLineData("rsi"));

      if (isValidNumber(result.parameters?.rsi_overbought)) {
        rsiSeries.createPriceLine({ price: result.parameters?.rsi_overbought, color: "#dc2626", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "Overbought" });
      }
      rsiSeries.createPriceLine({ price: 50, color: "#9ca3af", lineWidth: 1, lineStyle: 2, axisLabelVisible: false, title: "" });
      if (isValidNumber(result.parameters?.rsi_oversold)) {
        rsiSeries.createPriceLine({ price: result.parameters?.rsi_oversold, color: "#16a34a", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "Oversold" });
      }
    }

    let zscoreChart = null;
    if (hasZScore && zscoreChartRef.current) {
      zscoreChart = createChart(zscoreChartRef.current, { ...commonOptions, width: zscoreChartRef.current.clientWidth, height: 150 });
      const zscoreSeries = zscoreChart.addSeries(LineSeries, { color: "#000000", lineWidth: 2 });
      zscoreSeries.setData(getLineData("z_score"));
      if (isValidNumber(result.parameters?.zscore_long_entry)) {
        zscoreSeries.createPriceLine({ price: Number(result.parameters.zscore_long_entry), color: "#16a34a", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "Long entry" });
      }
      if (isValidNumber(result.parameters?.zscore_short_entry)) {
        zscoreSeries.createPriceLine({ price: Number(result.parameters.zscore_short_entry), color: "#dc2626", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "Short entry" });
      }
      if (isValidNumber(result.parameters?.zscore_exit)) {
        zscoreSeries.createPriceLine({ price: Number(result.parameters.zscore_exit), color: "#6b7280", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "Exit" });
      }
    }

    let macdChart = null;
    if (hasMACD && macdChartRef.current) {
      macdChart = createChart(macdChartRef.current, { ...commonOptions, width: macdChartRef.current.clientWidth, height: 150 });
      const histogram = macdChart.addSeries(HistogramSeries, { priceFormat: { type: "price", precision: 4, minMove: 0.0001 } });
      const macdSeries = macdChart.addSeries(LineSeries, { color: "#000000", lineWidth: 2, title: "MACD" });
      const signalSeries = macdChart.addSeries(LineSeries, { color: "#dc2626", lineWidth: 1, title: "Signal" });

      histogram.setData(uniqueData
        .filter((item) => isValidNumber(item.macd_histogram))
        .map((item) => ({ time: item.time, value: Number(item.macd_histogram), color: Number(item.macd_histogram) >= 0 ? "#16a34a" : "#dc2626" }))
      );
      macdSeries.setData(getLineData("macd"));
      signalSeries.setData(getLineData("macd_signal"));
      macdSeries.createPriceLine({ price: 0, color: "#6b7280", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "Zero" });
    }

    let adxChart = null;
    if (hasADX && adxChartRef.current) {
      adxChart = createChart(adxChartRef.current, { ...commonOptions, width: adxChartRef.current.clientWidth, height: 150 });
      const adxSeries = adxChart.addSeries(LineSeries, { color: "#000000", lineWidth: 2, title: "ADX" });
      const plusDiSeries = adxChart.addSeries(LineSeries, { color: "#16a34a", lineWidth: 1, title: "+DI" });
      const minusDiSeries = adxChart.addSeries(LineSeries, { color: "#dc2626", lineWidth: 1, title: "-DI" });

      adxSeries.setData(getLineData("adx"));
      plusDiSeries.setData(getLineData("plus_di"));
      minusDiSeries.setData(getLineData("minus_di"));

      if (isValidNumber(result.parameters?.adx_threshold)) {
        adxSeries.createPriceLine({ price: Number(result.parameters.adx_threshold), color: "#6b7280", lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: "Threshold" });
      }
    }

    const charts = [priceChart];
    if (rsiChart) charts.push(rsiChart);
    if (zscoreChart) charts.push(zscoreChart);
    if (macdChart) charts.push(macdChart);
    if (adxChart) charts.push(adxChart);

    let isSyncing = false;
    const subscriptions = [];
    charts.forEach((sourceChart) => {
      const sourceTimeScale = sourceChart.timeScale();
      const handler = (logicalRange) => {
        if (isSyncing || logicalRange === null) return;
        isSyncing = true;
        charts.forEach((targetChart) => {
          if (targetChart !== sourceChart) targetChart.timeScale().setVisibleLogicalRange(logicalRange);
        });
        isSyncing = false;
      };
      sourceTimeScale.subscribeVisibleLogicalRangeChange(handler);
      subscriptions.push({ chart: sourceChart, handler });
    });

    const selectedFrom = dateToUnixTime(startDate);
    const selectedTo = endDate ? dateToUnixTime(endDate, true) : null;
    if (selectedFrom !== null && selectedTo !== null && selectedFrom < selectedTo) {
      const selectedRange = { from: selectedFrom, to: selectedTo };
      charts.forEach((chart) => { chart.timeScale().setVisibleRange(selectedRange); });
    } else {
      priceChart.timeScale().fitContent();
      const initialRange = priceChart.timeScale().getVisibleLogicalRange();
      if (initialRange) charts.forEach((chart) => { chart.timeScale().setVisibleLogicalRange(initialRange); });
    }

    const resizeObservers = [];
    const chartContainers = [{ chart: priceChart, container: priceChartRef.current }];
    if (rsiChart) chartContainers.push({ chart: rsiChart, container: rsiChartRef.current });
    if (zscoreChart) chartContainers.push({ chart: zscoreChart, container: zscoreChartRef.current });
    if (macdChart) chartContainers.push({ chart: macdChart, container: macdChartRef.current });
    if (adxChart) chartContainers.push({ chart: adxChart, container: adxChartRef.current });

    chartContainers.forEach(({ chart, container }) => {
      if (!container) return;
      const observer = new ResizeObserver(() => { resizeChart(chart, container); });
      observer.observe(container);
      resizeObservers.push(observer);
    });

    return () => {
      resizeObservers.forEach((observer) => { observer.disconnect(); });
      subscriptions.forEach(({ chart, handler }) => { chart.timeScale().unsubscribeVisibleLogicalRangeChange(handler); });
      signalMarkersRef.current = null;
      
      // Cleanup all dynamically added charts
      priceChart.remove();
      if (rsiChart) rsiChart.remove();
      if (zscoreChart) zscoreChart.remove();
      if (macdChart) macdChart.remove();
      if (adxChart) adxChart.remove();
    };
  }, [
    result, 
    hasMACD, 
    hasADX, 
    hasDualMA, 
    hasTripleMA, 
    hasDonchian, 
    hasBB, 
    hasATR, 
    hasTrendSMA, 
    hasMAExit, 
    hasRSI, 
    hasZScore, 
    hasVWAP, 
    startDate, 
    endDate
  ]);

  useEffect(() => {
    if (!signalMarkersRef.current || !result?.data) return;

    if (!showSignals) {
      signalMarkersRef.current.setMarkers([]);
      return;
    }

    const markers = result.data
      .map((item) => {
        const time = timestampToUnixTime(item.timestamp);
        if (time === null || !item.signal || item.signal === "hold") return null;

        if (item.signal === "long") {
          return { time, position: "belowBar", color: "#16a34a", shape: "arrowUp", text: "Long" };
        }
        if (item.signal === "short") {
          return { time, position: "aboveBar", color: "#dc2626", shape: "arrowDown", text: "Short" };
        }
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
      <h3>Mean Reversion {crypto ? ` — ${crypto.symbol}` : ""}</h3>

      <div className="chart-container">
        <h4>Price and Analysis</h4>
        <div ref={priceChartRef} className="price-chart" style={{ width: "100%", height: "450px" }} />
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

      {hasMACD && (
        <div className="chart-container">
          <h4>MACD</h4>
          <div ref={macdChartRef} className="indicator-chart" style={{ height: "150px" }} />
        </div>
      )}

      {hasADX && (
        <div className="chart-container">
          <h4>ADX</h4>
          <div ref={adxChartRef} className="indicator-chart" style={{ height: "150px" }} />
        </div>
      )}

      {hasRSI && (
        <div className="chart-container">
          <h4>RSI</h4>
          <div ref={rsiChartRef} className="indicator-chart" style={{ height: "150px" }} />
        </div>
      )}

      {hasZScore && (
        <div className="chart-container">
          <h4>Z-Score</h4>
          <div ref={zscoreChartRef} className="indicator-chart" style={{ height: "150px" }} />
        </div>
      )}
    </div>
  );
}

export default MeanReversionChart;