import { useEffect, useRef, useState } from "react";
import { createChart, LineSeries, AreaSeries, CrosshairMode, createSeriesMarkers } from "lightweight-charts";

function EquityCurve({ data, splitDate, symA, symB, focusedTradeCycle }) {
  const eqContainerRef = useRef(null);
  const ddContainerRef = useRef(null);
  const chartRefs = useRef({});

  const [drawdownStats, setDrawdownStats] = useState(null);

  useEffect(() => {
    if (!eqContainerRef.current || !ddContainerRef.current) return;
    if (!data?.length) return;

    const sanitizeData = (rawData) => {
      const pointsMap = new Map();
      rawData.forEach((item) => {
        const time = Math.floor(new Date(item.timestamp).getTime() / 1000);
        if (Number.isFinite(time)) pointsMap.set(time, item);
      });
      return Array.from(pointsMap.values()).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    };

    const cleanData = sanitizeData(data);
    const splitTimestamp = splitDate ? (new Date(splitDate).getTime() / 1000) : Infinity;

    const trainData = [];
    const testData = [];
    const bnhData = [];
    const ddTrainData = [];
    const ddTestData = [];

    // Drawdown Calculation Variables
    const rawStartCap = cleanData[0]?.equity || 10000;
    const isPairs = cleanData[0]?.price_a !== undefined;

    const initPriceA = isPairs ? cleanData[0]?.price_a : null;
    const initPriceB = isPairs ? cleanData[0]?.price_b : null;
    const initSinglePrice = !isPairs ? cleanData[0]?.price : null;

    const calcBnH = (point) => {
      if (isPairs && initPriceA && initPriceB) {
        const qtyA = (rawStartCap / 2) / initPriceA;
        const qtyB = (rawStartCap / 2) / initPriceB;
        return (qtyA * point.price_a) + (qtyB * point.price_b);
      } else if (!isPairs && initSinglePrice) {
        return rawStartCap * (point.price / initSinglePrice);
      }
      return rawStartCap;
    };

    let maxStitchedEquity = 0;
    let lastTrainPoint = null;

    // Advanced Drawdown Tracking
    let peak = rawStartCap;
    let maxDd = 0;
    let maxDdDate = null;
    let maxDdDuration = 0; // ms
    let currentDdStart = cleanData[0]?.timestamp;

    let globalTroughPeakDate = cleanData[0]?.timestamp;
    let recoveryDate = null;

    cleanData.forEach(item => {
      const time = Math.floor(new Date(item.timestamp).getTime() / 1000);
      const equity = Number(item.equity);
      if (!Number.isFinite(time) || !Number.isFinite(equity)) return;

      const bnh = calcBnH(item);
      bnhData.push({ time, value: bnh });

      maxStitchedEquity = Math.max(maxStitchedEquity, equity);
      const ddLine = maxStitchedEquity > 0 ? ((equity - maxStitchedEquity) / maxStitchedEquity) * 100 : 0;

      if (time <= splitTimestamp) {
        trainData.push({ time, value: equity });
        ddTrainData.push({ time, value: ddLine });
        lastTrainPoint = { time, equity, dd: ddLine };
      } else {
        if (testData.length === 0 && lastTrainPoint) {
          testData.push({ time: lastTrainPoint.time, value: lastTrainPoint.equity });
          ddTestData.push({ time: lastTrainPoint.time, value: lastTrainPoint.dd });
        }
        testData.push({ time, value: equity });
        ddTestData.push({ time, value: ddLine });
      }

      // Track advanced stats for the summary block
      if (equity >= peak) {
        if (peak > rawStartCap || equity > rawStartCap) {
          const duration = new Date(item.timestamp) - new Date(currentDdStart);
          if (duration > maxDdDuration) {
            maxDdDuration = duration;
          }
          if (maxDd > 0 && !recoveryDate && currentDdStart === globalTroughPeakDate) {
            recoveryDate = item.timestamp;
          }
        }
        peak = equity;
        currentDdStart = item.timestamp;
      } else {
        const drop = (peak - equity) / peak;
        if (drop > maxDd) {
          maxDd = drop;
          maxDdDate = item.timestamp;
          globalTroughPeakDate = currentDdStart;
          recoveryDate = null;
        }
      }
    });

    const currentDd = peak > 0 ? (peak - Number(cleanData[cleanData.length - 1].equity)) / peak : 0;

    setDrawdownStats({
      maxDrawdown: maxDd * 100,
      maxDrawdownDate: maxDdDate,
      longestDurationDays: Math.floor(maxDdDuration / (1000 * 60 * 60 * 24)),
      recoveryDays: recoveryDate ? Math.floor((new Date(recoveryDate) - new Date(globalTroughPeakDate)) / (1000 * 60 * 60 * 24)) : null,
      currentDrawdown: currentDd * 100
    });

    const eqChart = createChart(eqContainerRef.current, {
      width: eqContainerRef.current.clientWidth,
      height: 320,
      layout: { background: { color: "transparent" }, textColor: "#666" },
      grid: { vertLines: { color: "rgba(128,128,128,0.15)" }, horzLines: { color: "rgba(128,128,128,0.15)" } },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 0,
        minBarSpacing: 0.01,
        fixLeftEdge: false,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: true
      }
    });

    const ddChart = createChart(ddContainerRef.current, {
      width: ddContainerRef.current.clientWidth,
      height: 140,
      layout: { background: { color: "transparent" }, textColor: "#666" },
      grid: { vertLines: { color: "rgba(128,128,128,0.15)" }, horzLines: { color: "rgba(128,128,128,0.15)" } },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 0,
        minBarSpacing: 0.01,
        fixLeftEdge: false,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: true
      }
    });

    const bnhTitle = (isPairs && symA && symB) ? `Buy & Hold (50% ${symA} / 50% ${symB})` : "Buy & Hold";

    const bnhSeries = eqChart.addSeries(LineSeries, {
      color: "#9ca3af", lineWidth: 2, lineStyle: 2, priceFormat: { type: "price", precision: 2, minMove: 0.01 }, title: bnhTitle
    });

    const trainEqSeries = eqChart.addSeries(LineSeries, {
      color: "#A9792E", lineWidth: 2, priceFormat: { type: "price", precision: 2, minMove: 0.01 }, title: "In-Sample"
    });

    const testEqSeries = eqChart.addSeries(LineSeries, {
      color: "#E85DAF", lineWidth: 2, priceFormat: { type: "price", precision: 2, minMove: 0.01 }, title: "Out-of-Sample"
    });

    const ddTrainSeries = ddChart.addSeries(AreaSeries, {
      topColor: "rgba(169, 122, 46, 0.48)", bottomColor: "#a97a2e17", lineColor: "#A9792E", lineWidth: 2,
      priceFormat: { type: "custom", formatter: price => `${price.toFixed(2)}%` }, title: "In-Sample DD"
    });

    const ddTestSeries = ddChart.addSeries(AreaSeries, {
      topColor: "rgba(232, 93, 174, 0.46)", bottomColor: "#e85dae28", lineColor: "#E85DAF", lineWidth: 2,
      priceFormat: { type: "custom", formatter: price => `${price.toFixed(2)}%` }, title: "Out-of-Sample DD"
    });

    if (bnhData.length) bnhSeries.setData(bnhData);
    if (trainData.length) trainEqSeries.setData(trainData);
    if (testData.length) testEqSeries.setData(testData);
    if (ddTrainData.length) ddTrainSeries.setData(ddTrainData);
    if (ddTestData.length) ddTestSeries.setData(ddTestData);

    eqChart.timeScale().fitContent();
    ddChart.timeScale().fitContent();

    const firstTime = cleanData[0]?.time ?? Infinity;
    const lastTime = cleanData[cleanData.length - 1]?.time ?? -Infinity;

    if (Number.isFinite(firstTime) && Number.isFinite(lastTime)) {
      eqChart.timeScale();
      ddChart.timeScale();
    }

    const eqTrainMarkers = createSeriesMarkers(trainEqSeries, []);
    const eqTestMarkers = createSeriesMarkers(testEqSeries, []);
    const ddTrainMarkers = createSeriesMarkers(ddTrainSeries, []);
    const ddTestMarkers = createSeriesMarkers(ddTestSeries, []);

    // Cache the marker instances specifically, not just the series
    chartRefs.current = { eqChart, ddChart, eqTrainMarkers, eqTestMarkers, ddTrainMarkers, ddTestMarkers };

    let isSyncing = false;
    const syncHandler = (sourceChart, targetChart) => (logicalRange) => {
      if (isSyncing || !logicalRange) return;
      isSyncing = true;
      targetChart.timeScale().setVisibleLogicalRange(logicalRange);
      isSyncing = false;
    };

    const eqSub = syncHandler(eqChart, ddChart);
    const ddSub = syncHandler(ddChart, eqChart);

    eqChart.timeScale().subscribeVisibleLogicalRangeChange(eqSub);
    ddChart.timeScale().subscribeVisibleLogicalRangeChange(ddSub);

    const resizeObserver = new ResizeObserver(() => {
      if (eqContainerRef.current) eqChart.applyOptions({ width: eqContainerRef.current.clientWidth });
      if (ddContainerRef.current) ddChart.applyOptions({ width: ddContainerRef.current.clientWidth });
    });

    resizeObserver.observe(eqContainerRef.current);
    resizeObserver.observe(ddContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      eqChart.timeScale().unsubscribeVisibleLogicalRangeChange(eqSub);
      ddChart.timeScale().unsubscribeVisibleLogicalRangeChange(ddSub);
      eqChart.remove();
      ddChart.remove();
      chartRefs.current = {};
    };
  }, [data, splitDate, symA, symB]);

  // Handle marker updates to target both the equity curve and drawdown charts simultaneously
  useEffect(() => {
    const { eqChart, eqTrainMarkers, eqTestMarkers, ddTrainMarkers, ddTestMarkers } = chartRefs.current;
    if (!eqChart || !eqTrainMarkers || !eqTestMarkers || !ddTrainMarkers || !ddTestMarkers) return;

    eqTrainMarkers.setMarkers([]);
    eqTestMarkers.setMarkers([]);
    ddTrainMarkers.setMarkers([]);
    ddTestMarkers.setMarkers([]);

    if (!focusedTradeCycle) return;
    const { entry, exit } = focusedTradeCycle;
    const splitTs = splitDate ? (new Date(splitDate).getTime() / 1000) : Infinity;

    const newTrainMarkers = [];
    const newTestMarkers = [];

    const appendMarker = (trade, isEntry) => {
      if (!trade) return;
      const timeNum = Math.floor(new Date(trade.timestamp).getTime() / 1000);
      const targetSeries = timeNum <= splitTs ? newTrainMarkers : newTestMarkers;

      let shape = 'arrowUp';
      let color = '#10b981';
      let position = 'belowBar';
      let text = 'Entry';

      if (isEntry) {
        const isLong = trade.action === 'buy' || trade.action === 'long';
        shape = isLong ? 'arrowUp' : 'arrowDown';
        color = isLong ? '#10b981' : '#ef4444';
        position = isLong ? 'belowBar' : 'aboveBar';
        text = `Entry (${trade.action})`;
      } else {
        shape = 'circle';
        color = trade.pnl >= 0 ? '#10b981' : '#ef4444';
        position = trade.pnl >= 0 ? 'aboveBar' : 'belowBar';
        text = `Exit`;
      }

      targetSeries.push({ time: timeNum, position, color, shape, text, size: 2 });
    };

    appendMarker(entry, true);
    appendMarker(exit, false);

    newTrainMarkers.sort((a, b) => a.time - b.time);
    newTestMarkers.sort((a, b) => a.time - b.time);

    // Apply markers to both chart panes
    eqTrainMarkers.setMarkers(newTrainMarkers);
    eqTestMarkers.setMarkers(newTestMarkers);
    ddTrainMarkers.setMarkers(newTrainMarkers);
    ddTestMarkers.setMarkers(newTestMarkers);
    
  }, [focusedTradeCycle, splitDate]);

  return (
    <div className="equity-curve-wrapper">
      <div ref={eqContainerRef} className="equity-chart-pane" />
      <h4 className="drawdown-title">Drawdown Depth</h4>
      <div ref={ddContainerRef} className="drawdown-chart-pane" />

      {drawdownStats && (
        <div className="drawdown-summary">
          <div className="drawdown-summary-item">
            <span className="drawdown-summary-label">Max Drawdown</span>
            <strong className="drawdown-summary-value text-negative">
              -{drawdownStats.maxDrawdown.toFixed(2)}%
              {drawdownStats.maxDrawdownDate && ` on ${new Date(drawdownStats.maxDrawdownDate).toLocaleDateString()}`}
            </strong>
          </div>
          <div className="drawdown-summary-item">
            <span className="drawdown-summary-label">Longest Duration</span>
            <strong className="drawdown-summary-value">{drawdownStats.longestDurationDays} days</strong>
          </div>
          <div className="drawdown-summary-item">
            <span className="drawdown-summary-label">Recovery Duration</span>
            <strong className="drawdown-summary-value text-gray">
              {drawdownStats.recoveryDays ? `${drawdownStats.recoveryDays} days to peak` : "Not recovered during the test period"}
            </strong>
          </div>
          <div className="drawdown-summary-item">
            <span className="drawdown-summary-label">Current Drawdown</span>
            <strong className="drawdown-summary-value">-{drawdownStats.currentDrawdown.toFixed(2)}%</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquityCurve;