import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PrincipleSelector from "./components/PrincipleSelector";
import CryptoSelector from "./components/CryptoSelector";
import TimeframeSelector from "./components/TimeframeSelector";
import TimeRangeSelector from "./components/TimeRangeSelector";
import StrategyParameters from "./components/StrategyParameters";
import StrategySummary from "./components/StrategySummary";
import RuleBasedParameters from "./components/RuleBasedParameters";
import MeanReversionChart from "./components/charts/MeanReversionChart";
import TrendFollowingChart from "./components/charts/TrendFollowingChart";
import PairsTradingChart from "./components/charts/PairsTradingChart";
import RuleBasedChart from "./components/charts/RuleBasedChart";
import StrategyLogicSummary, { ChartLegend, DataRangeSummary } from "./components/StrategyLogicSummary";
import BacktestHistory from "./components/BacktestHistory";
import ErrorModal from "./components/ErrorModal";
import "./css/strategy-workspace.css";

// Integrated Backtest Components
import EquityCurve from "./components/charts/EquityCurve";
import BacktestMetrics from "./components/BacktestMetrics";
import TradeLogTable from "./components/TradeLogTable";

export function StrategyChart({ result, currencies, startDate, endDate }) {
  if (!result) return null;

  let strategyChart;
  switch (result.principle) {
    case "mean_reversion":
      strategyChart = <MeanReversionChart result={result} currencies={currencies} startDate={startDate} endDate={endDate} />;
      break;
    case "trend_following":
      strategyChart = <TrendFollowingChart result={result} currencies={currencies} startDate={startDate} endDate={endDate} />;
      break;
    case "pairs_trading":
      strategyChart = <PairsTradingChart result={result} currencies={currencies} startDate={startDate} endDate={endDate} />;
      break;
    case "rule_based":
      strategyChart = <RuleBasedChart result={result} currencies={currencies} startDate={startDate} endDate={endDate} />;
      break;
    default:
      strategyChart = <div>Unknown strategy type.</div>;
  }

  return <div className="strategy-charts">{strategyChart}</div>;
}

export default function StrategyPage({ BASE_URL, builderMode, currencies, principles, settings, onClose, onStrategiesChanged }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const processedRouteRef = useRef("");
  const [pendingRouteBacktest, setPendingRouteBacktest] = useState(false);

  const [savedStrategies, setSavedStrategies] = useState([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState("");
  const [loadingStrategies, setLoadingStrategies] = useState(false);

  const [strategyName, setStrategyName] = useState("");
  const [principle, setPrinciple] = useState("");
  const [crypto1, setCrypto1] = useState("");
  const [crypto2, setCrypto2] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [datasetStartDate, setDatasetStartDate] = useState("2016-01-01");
  const [trainSplit, setTrainSplit] = useState(50);
  const [dataRange, setDataRange] = useState({ start: null, end: null });

  const [parameters, setParameters] = useState([]);
  const [parameterValues, setParameterValues] = useState({});
  const [previewResult, setPreviewResult] = useState(null);

  // Unified Backtest States
  const [positionSizing, setPositionSizing] = useState(settings.positionSizing || "fixed");
  const [positionAllocation, setPositionAllocation] = useState(settings.positionAllocation ?? 100);
  const [trainResult, setTrainResult] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [combinedResult, setCombinedResult] = useState(null);
  const [bnhReturnPct, setBnhReturnPct] = useState(0);
  const [bnhReturnAbs, setBnhReturnAbs] = useState(0);
  const [activeView, setActiveView] = useState("overview");
  const [dataTab, setDataTab] = useState("combined");
  const [focusedTrade, setFocusedTrade] = useState(null);
  const [focusedTradeCycle, setFocusedTradeCycle] = useState(null);
  const [backtestHistory, setBacktestHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryRunId, setSelectedHistoryRunId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteStrategyName, setDeleteStrategyName] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errorContext, setErrorContext] = useState("");
  const [criticalError, setCriticalError] = useState("");

  function showContextualError(message, context = "configuration") {
    setError(message);
    setErrorContext(context);
  }

  function clearContextualError() {
    setError("");
    setErrorContext("");
  }

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewSuccess, setPreviewSuccess] = useState(false);

  useEffect(() => {
    if (builderMode === "edit" || builderMode === "history") {
      fetchSavedStrategies();
    }
  }, [builderMode]);

  useEffect(() => {
    if (builderMode !== "edit") return;

    const strategyId = searchParams.get("strategy_id");

    // No strategy ID means the user wants the selection screen.
    if (!strategyId) {
      setSelectedStrategyId("");
      setPendingRouteBacktest(false);
      processedRouteRef.current = "";
    }
  }, [builderMode, searchParams]);

  useEffect(() => {
    if (!crypto1 || !timeframe) {
      setDataRange({ start: null, end: null });
      return;
    }
    fetch(`${BASE_URL}/market-data/${crypto1}/range?timeframe=${timeframe}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.start_date && data.end_date) {
          setDataRange({ start: data.start_date, end: data.end_date });
        } else {
          setDataRange({ start: null, end: null });
        }
      })
      .catch(() => setDataRange({ start: null, end: null }));
  }, [crypto1, timeframe]);

  function handleEditStrategy() {
    setSelectedStrategyId("");
    setPendingRouteBacktest(false);
    processedRouteRef.current = "";

    clearContextualError();

    navigate("/workspace/edit", {
      replace: true
    });
  }

  function formatHistoryDate(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  }

  function getHistoryMetrics(run) {
    return run.result_snapshot?.combined?.metrics || {};
  }

  function formatHistoryReturn(run) {
    const metrics = getHistoryMetrics(run);
    const value = Number(metrics.total_return);
    if (!Number.isFinite(value)) return "N/A";

    return `${value >= 0 ? "+" : ""}${formatCurrency(value)}`;
  }

  function getHistoryTradeCount(run) {
    const trades = run.result_snapshot?.combined?.trades;
    return Array.isArray(trades) ? trades.length : null;
  }

  // Compute Full Data Dates for Train/Test Splits
  const computedDates = useMemo(() => {
    if (!dataRange.start || !dataRange.end || !datasetStartDate) return null;
    const dbStartTs = new Date(dataRange.start).getTime();
    const dbEndTs = new Date(dataRange.end).getTime();
    const userStartTs = new Date(datasetStartDate).getTime();
    const startTs = Math.max(dbStartTs, userStartTs);
    const endTs = dbEndTs;

    if (startTs >= endTs) return null;
    const splitTs = startTs + (endTs - startTs) * (trainSplit / 100);
    return {
      trainStart: new Date(startTs).toISOString().split("T")[0],
      trainEnd: new Date(splitTs).toISOString().split("T")[0],
      testStart: new Date(splitTs).toISOString().split("T")[0],
      testEnd: new Date(endTs).toISOString().split("T")[0]
    };
  }, [dataRange, trainSplit, datasetStartDate]);

  // Focus Trade Lifecycle Observer
  useEffect(() => {
    if (!focusedTrade || !combinedResult?.trades) {
      setFocusedTradeCycle(null);
      return;
    }

    const trades = combinedResult.trades;
    const idx = trades.findIndex(t => t === focusedTrade);
    if (idx === -1) return;

    let entry = null;
    let exit = null;
    const isEntry = ['buy', 'long', 'short'].includes(focusedTrade.action);

    if (isEntry) {
      entry = focusedTrade;
      for (let i = idx + 1; i < trades.length; i++) {
        if (['sell', 'exit'].includes(trades[i].action)) {
          exit = trades[i];
          break;
        }
      }
    } else {
      exit = focusedTrade;
      for (let i = idx - 1; i >= 0; i--) {
        if (['buy', 'long', 'short'].includes(trades[i].action)) {
          entry = trades[i];
          break;
        }
      }
    }

    const data = combinedResult.data || [];
    const entryCandle = entry ? data.find(d => d.timestamp === entry.timestamp) : null;
    const exitCandle = exit ? data.find(d => d.timestamp === exit.timestamp) : null;

    setFocusedTradeCycle({ entry, exit, entryCandle, exitCandle });

    setTimeout(() => {
      const chartSection = document.getElementById("equity-curve-section");
      if (chartSection) chartSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, [focusedTrade, combinedResult]);

  async function fetchSavedStrategies() {
    setLoadingStrategies(true);
    clearContextualError();
    try {
      const response = await fetch(`${BASE_URL}/strategies/get`);
      const responseText = await response.text();
      if (!response.ok) throw new Error(responseText || "Could not load saved strategies.");
      const data = JSON.parse(responseText);
      setSavedStrategies(Array.isArray(data) ? data : []);
    } catch (error) {
      showContextualError(error.message || "Could not load saved strategies.", "selection");
    } finally {
      setLoadingStrategies(false);
    }
  }

  async function fetchBacktestHistory() {
    if (!selectedStrategyId) {
      setBacktestHistory([]);
      return;
    }

    setLoadingHistory(true);

    try {
      const response = await fetch(
        `${BASE_URL}/backtests/history?strategy_id=${selectedStrategyId}`
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Could not load backtest history.");
      }

      const data = JSON.parse(responseText);
      setBacktestHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      showContextualError(error.message || "Could not load backtest history.", "backtest");
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    if (selectedStrategyId) {
      fetchBacktestHistory();
    } else {
      setBacktestHistory([]);
    }
  }, [selectedStrategyId]);

  async function handleRestoreBacktestRun(backtestId) {
    setLoadingHistory(true);
    clearContextualError();

    try {
      const response = await fetch(
        `${BASE_URL}/backtests/history/${backtestId}`
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Could not load the selected backtest.");
      }

      const run = JSON.parse(responseText);
      const snapshot = run.result_snapshot || {};

      if (!snapshot.combined) {
        throw new Error(
          "This saved run does not contain complete backtest results."
        );
      }

      // Load the strategy configuration first, if necessary.
      if (String(run.strategy_id) !== String(selectedStrategyId)) {
        await handleStrategySelection(String(run.strategy_id));
      }

      // Restore the saved results after strategy selection has completed.
      setSelectedHistoryRunId(run.id);
      setTrainResult(snapshot.training || null);
      setTestResult(snapshot.testing || null);
      setCombinedResult(snapshot.combined);

      setBnhReturnPct(0);
      setBnhReturnAbs(0);

      setFocusedTrade(null);
      setFocusedTradeCycle(null);

      setActiveView("overview");
      setDataTab("combined");

      if (run.position_sizing) {
        setPositionSizing(run.position_sizing);
      }

      if (run.position_allocation != null) {
        setPositionAllocation(Number(run.position_allocation) * 100);
      }

      setHasUnsavedChanges(false);

      // Scroll to the restored results.
      setTimeout(() => {
        document.getElementById("backtest-results-anchor")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);

    } catch (error) {
      showContextualError(error.message || "Could not restore backtest run.", "backtest");
    } finally {
      setLoadingHistory(false);
    }
  }

  async function handleStrategySelection(strategyId) {
    setSelectedStrategyId(strategyId);
    setSelectedHistoryRunId(null);
    setTrainResult(null);
    setTestResult(null);
    setCombinedResult(null);
    setFocusedTrade(null);
    setFocusedTradeCycle(null);
    setPreviewResult(null);
    clearContextualError();
    if (!strategyId) {
      setStrategyName("");
      setPrinciple("");
      setCrypto1("");
      setCrypto2("");
      setTimeframe("");
      setParameters([]);
      setParameterValues({});
      setHasUnsavedChanges(false);
      return;
    }
    const strategy = savedStrategies.find((item) => String(item.id) === String(strategyId));
    if (!strategy) {
      showContextualError("Could not find the selected strategy.", "selection");
      return;
    }
    setStrategyName(strategy.title || "");
    setCrypto1(strategy.crypto1 ? String(strategy.crypto1) : "");
    setCrypto2(strategy.crypto2 ? String(strategy.crypto2) : "");
    setTimeframe(strategy.timeframe || "");
    setDatasetStartDate(strategy.start_date ? String(strategy.start_date).substring(0, 10) : "2016-01-01");
    setTrainSplit(strategy.split || 50);

    if (strategy.principle) {
      await loadPrincipleForExistingStrategy(strategy.principle, strategy.parameters || {});
    } else {
      setPrinciple("");
      setParameters([]);
      setParameterValues({});
    }

    setHasUnsavedChanges(false);
  }

  async function loadPrincipleForExistingStrategy(selectedPrinciple, existingValues) {
    setPrinciple(selectedPrinciple);
    try {
      const response = await fetch(`${BASE_URL}/strategies/${selectedPrinciple}/parameters`);
      const responseText = await response.text();
      if (!response.ok) throw new Error(responseText || "Could not load strategy parameters.");
      const data = JSON.parse(responseText);
      setParameters(data);
      const values = {};
      data.forEach((parameter) => { values[parameter.name] = parameter.default; });
      Object.entries(existingValues || {}).forEach(([name, value]) => { values[name] = value; });
      setParameterValues(values);
    } catch (error) {
      setParameters([]);
      setParameterValues({});
      showContextualError(error.message || "Could not load strategy parameters.", "configuration");
    }
  }

  async function handlePrincipleChange(selectedPrinciple) {
    setPrinciple(selectedPrinciple);
    setPreviewResult(null);
    clearContextualError();
    setHasUnsavedChanges(true);
    if (!selectedPrinciple) {
      setParameters([]);
      setParameterValues({});
      return;
    }
    await fetchStrategyParameters(selectedPrinciple);
  }

  async function fetchStrategyParameters(selectedPrinciple) {
    try {
      const response = await fetch(`${BASE_URL}/strategies/${selectedPrinciple}/parameters`);
      const responseText = await response.text();
      if (!response.ok) throw new Error(responseText || "Could not load strategy parameters.");
      const data = JSON.parse(responseText);
      setParameters(data);
      const defaults = {};
      data.forEach((parameter) => { defaults[parameter.name] = parameter.default; });
      setParameterValues(defaults);
    } catch (error) {
      setParameters([]);
      setParameterValues({});
      showContextualError(error.message || "Could not load strategy parameters.", "configuration");
    }
  }

  function handleParameterChange(name, value) {
    setParameterValues((previous) => ({ ...previous, [name]: value }));
    setHasUnsavedChanges(true);
  }

  function validatePreviewConfiguration(context = "configuration") {
    if (!principle) { showContextualError("Please select a strategy principle.", context); return false; }
    if (!crypto1) { showContextualError("Please select a cryptocurrency.", context); return false; }
    if (principle === "pairs_trading" && !crypto2) { showContextualError("Pairs Trading requires two cryptocurrencies.", context); return false; }
    if (principle === "pairs_trading" && crypto1 === crypto2) { showContextualError("Please select two different cryptocurrencies.", context); return false; }
    if (!timeframe) { showContextualError("Please select a candle timeframe.", context); return false; }
    if (!computedDates) { showContextualError("Market data date range is invalid or unavailable.", context); return false; }
    return true;
  }

  function handlePreviewStrategy() {
    if (!validatePreviewConfiguration()) return;
    fetchPreview();
  }

  async function handleSaveStrategy() {
    if (!validatePreviewConfiguration()) return;
    if (!strategyName.trim()) {
      showContextualError("Please enter a title for your strategy before saving.", "configuration");
      return;
    }

    const saved = await fetchSave();
    if (saved) {
      await fetchPreview();
    }
  }

  async function fetchPreview() {
    setLoading(true);
    clearContextualError();
    setPreviewSuccess(false);
    try {
      const requestBody = {
        crypto1: Number(crypto1),
        crypto2: principle === "pairs_trading" ? Number(crypto2) : null,
        timeframe,
        start_date: computedDates.trainStart,
        end_date: computedDates.trainEnd,
        principle,
        parameters: parameterValues,
        position_sizing: settings.positionSizing || "fixed",
        initial_capital: Number(settings.initialCapital ?? 10000),
        maker_fee: Number((settings.makerFee ?? 0) / 100),
        taker_fee: Number((settings.takerFee ?? 0) / 100),
        slippage_rate: Number((settings.slippage ?? 0) / 100)
      };
      const response = await fetch(`${BASE_URL}/strategies/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const responseText = await response.text();
      if (!response.ok) throw new Error(responseText || "Could not update strategy preview.");
      setPreviewResult(JSON.parse(responseText));

      setPreviewSuccess(true);
      setTimeout(() => setPreviewSuccess(false), 4000);
    } catch (error) {
      showContextualError(error.message || "Could not update strategy preview.", "preview");
    } finally {
      setLoading(false);
    }
  }


  async function fetchSave() {
    setIsSaving(true);
    setSaveSuccess(false);
    clearContextualError();

    try {
      const requestBody = {
        user_id: 1,
        title: strategyName.trim(),
        crypto1: Number(crypto1),
        crypto2: principle === "pairs_trading" ? Number(crypto2) : null,
        timeframe,
        principle,
        start_date: datasetStartDate,
        split: trainSplit,
        parameters: parameterValues
      };

      const url =
        builderMode === "edit"
          ? `${BASE_URL}/strategies/edit/${selectedStrategyId}`
          : `${BASE_URL}/strategies/create`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText || "Could not save strategy."
        );
      }

      setSaveSuccess(true);
      setHasUnsavedChanges(false);

      // When creating, select the newly saved strategy
      // without navigating away from the create workspace.
      if (builderMode === "create") {
        try {
          const newStrategy = JSON.parse(responseText);

          if (newStrategy?.id) {
            setSelectedStrategyId(newStrategy.id);
          }
        } catch (parseError) {
          console.error(
            "Could not parse the new strategy ID.",
            parseError
          );
        }
      }

      // Refresh the saved strategy list.
      if (onStrategiesChanged) {
        await onStrategiesChanged();
      }

      await fetchSavedStrategies();

      setTimeout(() => setSaveSuccess(false), 4000);

      return true;

    } catch (error) {
      showContextualError(
        error.message || "Could not save strategy.",
        "configuration"
      );

      return false;

    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteStrategy() {
    if (!selectedStrategyId || isDeleting) return;

    setIsDeleting(true);
    clearContextualError();
    setCriticalError("");
    setDeleteStrategyName("");

    try {
      const response = await fetch(
        `${BASE_URL}/strategies/delete/${selectedStrategyId}`,
        {
          method: "POST"
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText || "Could not delete the strategy."
        );
      }

      // Close the confirmation modal immediately after successful deletion.
      setShowDeleteConfirmation(false);
      setCriticalError("");

      // Remove the deleted strategy from the local list.
      setSavedStrategies((previous) =>
        previous.filter(
          (strategy) => String(strategy.id) !== String(selectedStrategyId)
        )
      );

      // Clear the selected strategy and its configuration.
      setSelectedStrategyId("");
      setStrategyName("");
      setPrinciple("");
      setCrypto1("");
      setCrypto2("");
      setTimeframe("");
      setDatasetStartDate("2016-01-01");
      setTrainSplit(50);
      setDataRange({ start: null, end: null });

      setParameters([]);
      setParameterValues({});
      setPreviewResult(null);

      // Clear backtest results and history.
      setTrainResult(null);
      setTestResult(null);
      setCombinedResult(null);
      setBacktestHistory([]);
      setSelectedHistoryRunId(null);

      setFocusedTrade(null);
      setFocusedTradeCycle(null);

      setBnhReturnPct(0);
      setBnhReturnAbs(0);

      setHasUnsavedChanges(false);
      setActiveView("overview");
      setDataTab("combined");

      // Refresh the homepage strategy list.
      if (onStrategiesChanged) {
        await onStrategiesChanged();
      }

      // Return to the strategy selection screen.
      processedRouteRef.current = "";
      setPendingRouteBacktest(false);

      navigate("/", { replace: true });

    } catch (error) {
      setShowDeleteConfirmation(false);
      setCriticalError(
        error.message || "Could not delete the strategy."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  // Handle Full Backtest Request
  async function handleRunBacktest() {
    if (!validatePreviewConfiguration("backtest")) return;

    if (!selectedStrategyId || hasUnsavedChanges) {
      setCriticalError("Your strategy has unsaved changes. Please save it before running a backtest.");
      return;
    }

    setLoading(true);
    setCriticalError("");
    clearContextualError();
    setActiveView("overview");
    setFocusedTrade(null);

    try {
      const initialCap = Number(settings.initialCapital ?? 10000);
      const requestBody = {
        strategy_id: Number(selectedStrategyId),
        crypto1: Number(crypto1),
        crypto2: principle === "pairs_trading" ? Number(crypto2) : null,
        timeframe,
        train_start_date: computedDates.trainStart,
        train_end_date: computedDates.trainEnd,
        test_start_date: computedDates.testStart,
        test_end_date: computedDates.testEnd,
        position_sizing: positionSizing,
        position_allocation: Number(positionAllocation) / 100,
        initial_capital: initialCap,
        maker_fee: Number((settings.makerFee ?? 0) / 100),
        taker_fee: Number((settings.takerFee ?? 0) / 100),
        slippage_rate: Number((settings.slippage ?? 0) / 100)
      };

      const response = await fetch(`${BASE_URL}/backtests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      if (!response.ok) throw new Error(responseText || "Failed to run backtest.");
      const result = JSON.parse(responseText);

      setTrainResult(result.training);
      setTestResult(result.testing);
      setCombinedResult(result.combined);
      setSelectedHistoryRunId(null);

      let bnhPct = 0;
      let bnhAbs = 0;
      const eqCurve = result.combined?.equity_curve || [];
      if (eqCurve.length > 0) {
        const first = eqCurve[0];
        const last = eqCurve[eqCurve.length - 1];
        if (first.price_a !== undefined) {
          const qtyA = (initialCap / 2) / first.price_a;
          const qtyB = (initialCap / 2) / first.price_b;
          const finalVal = (qtyA * last.price_a) + (qtyB * last.price_b);
          bnhPct = ((finalVal / initialCap) - 1) * 100;
          bnhAbs = finalVal - initialCap;
        } else if (first.price !== undefined) {
          bnhPct = ((last.price / first.price) - 1) * 100;
          bnhAbs = (initialCap * (last.price / first.price)) - initialCap;
        }
      }

      setBnhReturnPct(bnhPct);
      setBnhReturnAbs(bnhAbs);

      // Smooth scroll to results
      await fetchBacktestHistory();
      setTimeout(() => {
        document.getElementById("backtest-results-anchor")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);

    } catch (error) {
      showContextualError(error.message || "Failed to run backtest.", "backtest");
    } finally {
      setLoading(false);
    }
  }

  // Handle actions requested through URL query parameters.
  useEffect(() => {
    if (!savedStrategies.length) return;

    const strategyId = searchParams.get("strategy_id");
    const backtestId = searchParams.get("backtest_id");
    const shouldRunBacktest = searchParams.get("run_backtest") === "true";

    if (!strategyId) return;

    const routeKey = `${strategyId}-${backtestId || ""}-${shouldRunBacktest}`;

    if (processedRouteRef.current === routeKey) return;

    const strategyExists = savedStrategies.some(
      (strategy) => String(strategy.id) === String(strategyId)
    );

    if (!strategyExists) {
      showContextualError("The requested strategy could not be found.", "selection");
      return;
    }

    processedRouteRef.current = routeKey;

    async function processRouteAction() {
      clearContextualError();

      await handleStrategySelection(String(strategyId));

      if (backtestId) {
        await handleRestoreBacktestRun(backtestId);
      } else if (shouldRunBacktest) {
        setPendingRouteBacktest(true);
      }
    }

    processRouteAction();
  }, [savedStrategies, searchParams]);

  useEffect(() => {
    if (!pendingRouteBacktest || !selectedStrategyId || !computedDates) {
      return;
    }

    setPendingRouteBacktest(false);
    handleRunBacktest();
  }, [pendingRouteBacktest, selectedStrategyId, computedDates]);

  // Render Inline Focused Trade
  const renderTradeDetails = () => {
    if (!focusedTradeCycle) return null;
    const { entry, exit, entryCandle, exitCandle } = focusedTradeCycle;
    const isPairs = principle === "pairs_trading";
    const selectedCrypto1 = currencies.find(c => String(c.id) === String(crypto1));
    const selectedCrypto2 = currencies.find(c => String(c.id) === String(crypto2));
    const symA = selectedCrypto1?.symbol || "Asset A";
    const symB = selectedCrypto2?.symbol || "Asset B";

    const isOpen = !exit;
    const netPnl = exit?.pnl || 0;
    const fees = (entry?.fees || 0) + (exit?.fees || 0);
    const grossPnl = netPnl + fees;
    const isProfitable = netPnl >= 0;

    let statusText = "Open";
    let statusClass = "trade-status-open";
    if (!isOpen) {
      statusText = isProfitable ? "Closed · Profitable" : "Closed · Loss";
      statusClass = isProfitable ? "trade-status-profit" : "trade-status-loss";
    }

    const formatPrice = (trade) => {
      if (!trade) return "-";
      if (isPairs) return `${symA}: $${trade.price?.toFixed(4)} \n ${symB}: $${trade.price_b?.toFixed(4)}`;
      return `$${trade.price?.toFixed(4)}`;
    };

    const formatDateTime = (ts) => {
      const d = new Date(ts);
      return d.toISOString().split('T')[0] + ' ' + d.toTimeString().substring(0, 5);
    };

    const calcDuration = (start, end) => {
      const ms = new Date(end).getTime() - new Date(start).getTime();
      const totalHours = Math.floor(ms / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h`;
      return `${Math.floor(ms / (1000 * 60))}m`;
    };

    const entryDate = entry ? formatDateTime(entry.timestamp) : "-";
    const exitDate = exit ? formatDateTime(exit.timestamp) : "-";
    const holdingTime = entry && exit ? calcDuration(entry.timestamp, exit.timestamp) : "-";

    const formatReason = (reason) => {
      const mapping = { target: "Target Reversion", stop: "Stop Loss Hit", stop_loss: "Stop Loss Hit", time: "Time Limit Reached", force_close: "System Force Close", rule: "Rule Condition Met" };
      return mapping[reason] || reason || "Standard Exit Signal";
    };

    const knownIndicators = ['bb_upper', 'bb_middle', 'bb_lower', 'rsi', 'z_score', 'macd', 'macd_signal', 'adx', 'trend_sma', 'vwap', 'rolling_correlation'];
    const renderIndicators = (candle) => {
      if (!candle) return null;
      const found = knownIndicators.filter(k => candle[k] !== undefined && candle[k] !== null);
      if (found.length === 0) return null;
      return (
        <div className="trade-indicator-pills">
          {found.map(k => (
            <span key={k} className="trade-indicator-pill">
              {k.replace(/_/g, ' ').toUpperCase()}: {Number(candle[k]).toFixed(4)}
            </span>
          ))}
        </div>
      );
    };

    return (
      <div className="trade-details-card">
        <div className="trade-details-header">
          <h3>Trade Breakdown</h3>
          <span className={`trade-status-pill ${statusClass}`}>{statusText}</span>
        </div>
        <div className="trade-details-grid">
          <div className="trade-metric-group">
            <span className="trade-metric-label">Direction</span>
            <span className="trade-metric-value" style={{ textTransform: 'capitalize' }}>{entry?.action || "Unknown"}</span>
          </div>
          <div className="trade-metric-group">
            <span className="trade-metric-label">Entry Date</span>
            <span className="trade-metric-value">{entryDate}</span>
          </div>
          <div className="trade-metric-group">
            <span className="trade-metric-label">Exit Date</span>
            <span className="trade-metric-value">{!isOpen ? exitDate : "Pending"}</span>
          </div>
          <div className="trade-metric-group">
            <span className="trade-metric-label">Holding Time</span>
            <span className="trade-metric-value">{holdingTime}</span>
          </div>
          <div className="trade-metric-group">
            <span className="trade-metric-label">Gross P&L</span>
            <span className={`trade-metric-value ${!isOpen ? (grossPnl >= 0 ? 'text-positive' : 'text-negative') : ''}`}>
              {!isOpen ? `${grossPnl >= 0 ? '+' : ''}$${grossPnl.toFixed(2)}` : "-"}
            </span>
          </div>
          <div className="trade-metric-group">
            <span className="trade-metric-label">Total Fees</span>
            <span className="trade-metric-value text-gray">${fees.toFixed(2)}</span>
          </div>
          <div className="trade-metric-group">
            <span className="trade-metric-label">Net P&L</span>
            <span className={`trade-metric-value ${!isOpen ? (netPnl >= 0 ? 'text-positive' : 'text-negative') : ''}`}>
              {!isOpen ? `${netPnl >= 0 ? '+' : ''}$${netPnl.toFixed(2)}` : "-"}
            </span>
          </div>
          <div className="trade-metric-group">
            <span className="trade-metric-label">Execution</span>
            <span className="trade-metric-value">Market</span>
          </div>
        </div>
        <div className="trade-context-container">
          <div className="trade-context-block">
            <h4>Entry Context</h4>
            <p style={{ whiteSpace: "pre-line" }}>Executed standard {entry?.action} entry signal.<br />{formatPrice(entry)}</p>
            {renderIndicators(entryCandle)}
          </div>
          {!isOpen && (
            <div className="trade-context-block">
              <h4>Exit Context</h4>
              <p style={{ whiteSpace: "pre-line" }}>{formatReason(exit?.exit_reason)}.<br />{formatPrice(exit)}</p>
              {renderIndicators(exitCandle)}
            </div>
          )}
        </div>
      </div>
    );
  };


  const selectedPrinciple = principles.find((item) => item.key === principle);
  const isPairsTrading = principle === "pairs_trading";

  const canPreview = Boolean(
    principle &&
    crypto1 &&
    timeframe &&
    computedDates &&
    (principle !== "pairs_trading" || (crypto2 && crypto1 !== crypto2))
  );

  const canRunBacktest = Boolean(
    selectedStrategyId && canPreview && !hasUnsavedChanges
  );

  const navigateToStep = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const selectedCrypto = currencies.find(
    c => String(c.id) === String(crypto1)
  );

  const selectedCrypto2 = currencies.find(
    c => String(c.id) === String(crypto2)
  );

  const formatCurrency = (value) =>
    `$${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  return (
    <>

      <ErrorModal
        type={showDeleteConfirmation ? "confirm" : "error"}
        title={
          showDeleteConfirmation
            ? "Delete strategy?"
            : "Something went wrong"
        }
        message={
          showDeleteConfirmation
            ? `Are you sure you want to delete "${deleteStrategyName || strategyName || "Untitled strategy"}"? This action cannot be undone.`
            : criticalError
        }
        confirmText="Delete Strategy"
        cancelText="Cancel"
        onConfirm={handleDeleteStrategy}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setCriticalError("");
        }}
        isLoading={isDeleting}
      />

      {builderMode === "edit" && !selectedStrategyId && (
        <section className="strategy-selection">
          <div className="strategy-selection-card">
            <h2>Edit Existing Strategy</h2>
            <p>Select a saved strategy to load its configuration.</p>

            {error && errorContext === "selection" && (
              <div className="workspace-context-error" role="alert" style={{
                marginBottom: "12px", padding: "12px 16px", borderRadius: "10px",
                background: "#FFF4F2", border: "1px solid #F3C5BE",
                color: "#9F3025", fontSize: "14px", lineHeight: 1.5
              }}>{error}</div>
            )}

            <div className="form-group">
              <label htmlFor="existing-strategy">Select Strategy</label>

              <select
                id="existing-strategy"
                value={selectedStrategyId}
                onChange={(e) => handleStrategySelection(e.target.value)}
                disabled={loadingStrategies}
              >
                <option value="">
                  {loadingStrategies
                    ? "Loading strategies..."
                    : "Select a strategy..."}
                </option>

                {savedStrategies.map(strategy => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.title}
                  </option>
                ))}
              </select>
            </div>

            {!loadingStrategies && savedStrategies.length === 0 && (
              <p>No saved strategies were found.</p>
            )}

            <button className="button-purple" onClick={onClose}>
              Back
            </button>
          </div>
        </section>
      )}

      {builderMode && (builderMode === "create" || selectedStrategyId) && (
        <div className="creator-page strategy-workspace">

          {/* WORKSPACE HEADER */}

          <div className="workspace-heading">
            <div>
              <h1>Strategy workspace</h1>
              <p>
                Create, preview, backtest and refine one continuous workspace.
              </p>
            </div>
          </div>

          {/* WORKFLOW STEPPER */}

          <nav className="workflow-stepper">
            {[
              { id: "step-configure", number: "01", title: "Create & configure", color: "purple" },
              { id: "step-preview", number: "02", title: "Preview signals", color: "teal" },
              { id: "step-backtest", number: "03", title: "Run backtest", color: "amber" },
              { id: "step-review", number: "04", title: "Review & refine", color: "pink" }
            ].map((step) => (
              <button
                key={step.id}
                className={`workflow-step ${step.color}`}
                onClick={() => navigateToStep(step.id)}
              >
                <span className="workflow-step-icon">{step.number}</span>
                <span>{step.title}</span>
              </button>
            ))}
          </nav>

          <section
            id="step-configure"
            className="workspace-section configuration-section"
          >
            <div className="workspace-section-heading">
              <div className="workspace-section-number purple">01</div>
              <div>
                <h2>Create & configure</h2>
                <p>
                  Define your logic and historical dataset. Load an existing
                  strategy or edit the configuration below.
                </p>
              </div>
              <span className="section-status">
                {hasUnsavedChanges ? "Unsaved changes" : "Configuration ready"}
              </span>
            </div>
            {error && errorContext === "configuration" && (
              <div className="workspace-context-error" role="alert" style={{
                marginTop: "16px", padding: "12px 16px", borderRadius: "10px",
                background: "#FFF4F2", border: "1px solid #F3C5BE",
                color: "#9F3025", fontSize: "14px", lineHeight: 1.5
              }}>{error}</div>
            )}
            <div className="workspace-card">

              <div className="configuration-card-heading">
                <div>
                  <h3>{strategyName || "New strategy"}</h3>
                  <span>
                    {selectedStrategyId ? "Saved strategy" : "New configuration"}
                  </span>
                </div>
                <div className="workspace-header-actions">
                  {saveSuccess && (
                    <span className="workspace-success">
                      <span className="status-dot" />
                      Strategy saved
                    </span>
                  )}

                  <button
                    className="button-purple"
                    onClick={handleSaveStrategy}
                    disabled={loading || isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Strategy"}
                  </button>
                  <button
                    className="button-purple"
                    onClick={handleEditStrategy}
                    disabled={loadingStrategies}
                  >
                    Load existing
                  </button>
                  <button
                    type="button"
                    className="button-danger"
                    onClick={() => {
                      setDeleteStrategyName(strategyName.trim());
                      setShowDeleteConfirmation(true);
                    }}
                    disabled={loading || isSaving || isDeleting || !selectedStrategyId}
                  >
                    Delete Strategy
                  </button>
                </div>
              </div>

              <div className="configuration-grid">

                {/* BASIC INFO */}

                <div className="configuration-column">
                  <h4 className="configuration-column-title">Basic info</h4>

                  <div className="form-group">
                    <label htmlFor="title">Strategy Title</label>
                    <input
                      id="title"
                      type="text"
                      placeholder="e.g. Mean Reversion v2"
                      value={strategyName}
                      onChange={(e) => {
                        setStrategyName(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <PrincipleSelector
                    principles={principles}
                    value={principle}
                    onChange={handlePrincipleChange}
                  />
                </div>

                {/* ENVIRONMENT */}

                <div className="configuration-column">
                  <h4 className="configuration-column-title">Environment</h4>

                  {principle ? (
                    <>
                      <CryptoSelector
                        currencies={currencies}
                        crypto1={crypto1}
                        crypto2={crypto2}
                        onCrypto1Change={(v) => {
                          setCrypto1(v);
                          setHasUnsavedChanges(true);
                        }}
                        onCrypto2Change={(v) => {
                          setCrypto2(v);
                          setHasUnsavedChanges(true);
                        }}
                        isPair={isPairsTrading}
                      />

                      <TimeframeSelector
                        value={timeframe}
                        onChange={(v) => {
                          setTimeframe(v);
                          setHasUnsavedChanges(true);
                        }}
                      />

                      <TimeRangeSelector
                        trainSplit={trainSplit}
                        onSplitChange={(v) => {
                          setTrainSplit(v);
                          setHasUnsavedChanges(true);
                        }}
                        datasetStartDate={datasetStartDate}
                        onDatasetStartDateChange={(v) => {
                          setDatasetStartDate(v);
                          setHasUnsavedChanges(true);
                        }}
                      />

                      {computedDates && (
                        <div className="data-split">
                          <span>
                            Available data: {computedDates.trainStart} – {computedDates.testEnd}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="workspace-empty">
                      Select a strategy principle to configure the environment.
                    </div>
                  )}
                </div>

                {/* FEATURES & PARAMETERS */}

                <div className="configuration-column">
                  <h4 className="configuration-column-title">
                    Features & parameters
                  </h4>

                  {!principle ? (
                    <div className="workspace-empty">
                      Choose a principle to see compatible features.
                    </div>
                  ) : principle === "rule_based" ? (
                    <RuleBasedParameters
                      values={parameterValues}
                      onChange={handleParameterChange}
                    />
                  ) : parameters.length > 0 ? (
                    <div className="feature-configuration">

                      <StrategyParameters
                        parameters={parameters}
                        values={parameterValues}
                        onChange={handleParameterChange}
                        principle={principle}
                        principles={principles}
                      />
                    </div>
                  ) : (
                    <div className="workspace-empty">
                      Loading compatible features...
                    </div>
                  )}
                </div>

              </div>


              <div className="workspace-card-footer">
                <span>Next: preview your signals before running a historical test.</span>

                <button
                  className="button button-purple"
                  onClick={handlePreviewStrategy}
                  disabled={loading || isSaving}
                >
                  {loading ? "Generating preview..." : "Preview strategy"}
                </button>
              </div>
            </div>
          </section>

          <section
            id="step-preview"
            className="workspace-section"
          >
            <div className="workspace-section-heading">
              <div className="workspace-section-number teal">02</div>
              <div>
                <h2>Preview signals</h2>
                <p>
                  Check where your configuration generates entry and exit
                  signals across the same historical window.
                </p>
              </div>

              {previewResult && (
                <span className="section-status status-success">
                  Preview updated
                </span>
              )}
            </div>

            <div className="workspace-card preview-logic-card">
              {previewResult ? (
                <>
                  <StrategyLogicSummary
                    principle={principle}
                    parameters={parameters}
                    values={parameterValues}
                    crypto1={crypto1}
                    crypto2={crypto2}
                    currencies={currencies}
                    startDate={computedDates?.trainStart}
                    endDate={computedDates?.trainEnd}
                  />
                </>
              ) : (
                <div className="workspace-empty">
                  <h3>Strategy logic</h3>
                  <p>
                    Configure your strategy above and select Preview Strategy
                    to generate the entry and exit logic.
                  </p>
                </div>
              )}
            </div>
            {error && errorContext === "preview" && (
              <div className="workspace-context-error" role="alert" style={{
                marginTop: "12px", padding: "12px 16px", borderRadius: "10px",
                background: "#FFF4F2", border: "1px solid #F3C5BE",
                color: "#9F3025", fontSize: "14px", lineHeight: 1.5
              }}>{error}</div>
            )}
            <div className="preview-chart-layout">
              {/* CHART */}
              <div className="workspace-card preview-chart-card">
                <div className="workspace-card-heading">
                  <div>
                    <h3>
                      {selectedPrinciple?.name || "Strategy"} –{" "}
                      {selectedCrypto?.symbol || "Selected asset"}
                      {isPairsTrading && selectedCrypto2
                        ? ` / ${selectedCrypto2.symbol}`
                        : ""}
                    </h3>
                    <p>Historical price development and generated signals.</p>
                  </div>
                </div>

                {previewResult ? (
                  <>
                    <StrategyChart
                      result={previewResult}
                      currencies={currencies}
                      startDate={computedDates?.trainStart}
                      endDate={computedDates?.trainEnd}
                    />
                    <DataRangeSummary
                      startDate={computedDates?.trainStart}
                      endDate={computedDates?.trainEnd}
                    />
                  </>
                ) : (
                  <div className="preview-placeholder">
                    <span>Chart preview</span>
                    <p>
                      Generate a strategy preview to display price overlays
                      and trading signals.
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR */}
              <aside className="preview-sidebar">
                <div className="preview-sidebar-heading">
                  <span>STRATEGY OVERVIEW</span>
                </div>

                <StrategySummary
                  result={previewResult}
                  currencies={currencies}
                  principle={selectedPrinciple}
                />

                <ChartLegend
                  principle={principle}
                  values={parameterValues}
                />
              </aside>
            </div>
          </section>

          <section
            id="step-backtest"
            className="workspace-section"
          >
            <div className="workspace-section-heading">
              <div className="workspace-section-number amber">03</div>
              <div>
                <h2>Run backtest</h2>
                <p>
                  Evaluate your current configuration on historical data.
                  Historical results do not predict future performance.
                </p>
              </div>

              {combinedResult && (
                <span className="section-status status-success-amber">
                  Backtest completed
                </span>
              )}
            </div>

            <div className="workspace-card">

              <div className="backtest-panel-heading">
                <div>
                  <h3>Backtest configuration</h3>
                  <p>Adjust how positions are sized during the simulation.</p>
                </div>
                <span className="backtest-editable-tag">Editable</span>
              </div>

              <div className="backtest-configurable-grid">

                <div className="backtest-configurable-item">
                  <label htmlFor="position-sizing">Position sizing</label>
                  <select
                    id="position-sizing"
                    value={positionSizing}
                    onChange={(e) => {
                      setPositionSizing(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <option value="fixed">Fixed</option>
                    <option value="compounding">Compounding</option>
                  </select>
                  <small>
                    {positionSizing === "fixed"
                      ? "Uses the same position allocation for each trade."
                      : "Calculates position size using the available account balance."}
                  </small>
                </div>

                <div className="backtest-configurable-item">
                  <label htmlFor="position-allocation">
                    Position allocation (%)
                  </label>
                  <input
                    id="position-allocation"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={positionAllocation}
                    onChange={(e) => {
                      setPositionAllocation(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                  />
                  <small>
                    Percentage of available capital allocated per position.
                  </small>
                </div>

              </div>

              <div className="backtest-section-divider" />

              <div className="backtest-panel-heading">
                <div>
                  <h3>Trade assumptions</h3>
                  <p>These values are inherited from your global settings.</p>
                </div>
                <span className="backtest-source-tag">Global settings</span>
              </div>

              <div className="backtest-information-grid">

                <div className="backtest-information-item">
                  <span>Maker fee</span>
                  <strong>{settings.makerFee ?? 0}%</strong>
                </div>

                <div className="backtest-information-item">
                  <span>Taker fee</span>
                  <strong>{settings.takerFee ?? 0}%</strong>
                </div>

                <div className="backtest-information-item">
                  <span>Slippage</span>
                  <strong>{settings.slippage ?? 0}%</strong>
                </div>

                <div className="backtest-information-item">
                  <span>Starting capital</span>
                  <strong>
                    {formatCurrency(settings.initialCapital ?? 10000)}
                  </strong>
                </div>

                <div className="backtest-information-item">
                  <span>Execution</span>
                  <strong>Current candle close</strong>
                </div>

                <div className="backtest-information-item">
                  <span>Direction</span>
                  <strong>
                    {isPairsTrading ? "Hedged pairs" : "Single-entry"}
                  </strong>
                </div>

              </div>

              <div className="backtest-settings-note">
                <span>To change fees, slippage or starting capital, visit global settings.</span>
                <button
                  type="button"
                  onClick={() => navigate("/settings")}
                >
                  Edit settings
                </button>
              </div>

              <div className="backtest-section-divider" />

              <div className="backtest-panel-heading">
                <div>
                  <h3>Strategy and data overview</h3>
                  <p>Configuration inherited from the previous steps.</p>
                </div>
                <span className="backtest-source-tag">From configuration</span>
              </div>

              <div className="backtest-overview-grid">

                <div className="backtest-overview-item">
                  <span>Strategy principle</span>
                  <strong>
                    {selectedPrinciple?.name ||
                      ({
                        mean_reversion: "Mean Reversion",
                        trend_following: "Trend Following",
                        pairs_trading: "Pairs Trading",
                        rule_based: "Rule Based"
                      }[principle] || "Not selected")}
                  </strong>
                </div>

                <div className="backtest-overview-item">
                  <span>Market</span>
                  <strong>
                    {selectedCrypto?.symbol || "-"}
                    {isPairsTrading
                      ? ` / ${selectedCrypto2?.symbol || "-"}`
                      : ""}
                  </strong>
                </div>

                <div className="backtest-overview-item">
                  <span>Timeframe</span>
                  <strong>{timeframe || "-"}</strong>
                </div>

                <div className="backtest-overview-item">
                  <span>Selected features</span>
                  <strong>
                    {Object.values(parameterValues).filter(
                      value =>
                        value !== false &&
                        value !== null &&
                        value !== undefined
                    ).length}
                  </strong>
                </div>

              </div>

              <div className="backtest-data-split">

                <div className="backtest-data-split-heading">
                  <div>
                    <h4>Data split</h4>
                    <p>Historical data is divided into development and validation periods.</p>
                  </div>

                  <span className="backtest-data-range">
                    {computedDates
                      ? `${computedDates.trainStart} – ${computedDates.testEnd}`
                      : "Dataset unavailable"}
                  </span>
                </div>

                <div className="backtest-split-bar">
                  <div
                    className="backtest-split-in-sample"
                    style={{ width: `${trainSplit}%` }}
                  />
                  <div
                    className="backtest-split-out-sample"
                    style={{ width: `${100 - trainSplit}%` }}
                  />
                </div>

                <div className="backtest-split-legend">
                  <div>
                    <span className="backtest-split-dot in-sample" />
                    <span>In-Sample</span>
                    <strong>{trainSplit}%</strong>
                  </div>

                  <div>
                    <span className="backtest-split-dot out-sample" />
                    <span>Out-of-Sample</span>
                    <strong>{100 - trainSplit}%</strong>
                  </div>
                </div>
              </div>

              {error && errorContext === "backtest" && (
                <div className="workspace-context-error" role="alert" style={{
                  marginTop: "16px", padding: "12px 16px", borderRadius: "10px",
                  background: "#FFF4F2", border: "1px solid #F3C5BE",
                  color: "#9F3025", fontSize: "14px", lineHeight: 1.5
                }}>{error}</div>
              )}

              <div className="workspace-card-footer">
                <span>
                  {hasUnsavedChanges
                    ? "Save your strategy changes before running the backtest."
                    : !selectedStrategyId
                      ? "Save your strategy before running the backtest."
                      : "Your saved strategy is ready for evaluation."}
                </span>

                <button
                  className="button-amber"
                  onClick={handleRunBacktest}
                  disabled={loading || isSaving || !canPreview}
                >
                  {loading
                    ? "Running backtest..."
                    : isSaving
                      ? "Saving strategy..."
                      : hasUnsavedChanges
                        ? "Save strategy first"
                        : !selectedStrategyId
                          ? "Save strategy first"
                          : "Run Backtest"}
                </button>
              </div>

            </div>
          </section>

          <section
            id="step-review"
            className="workspace-section review-section"
          >
            <div className="workspace-section-heading">
              <div className="workspace-section-number pink">04</div>
              <div>
                <h2>Review & refine</h2>
                <p>
                  Compare returns and risk, inspect individual trades,
                  then refine your parameters and rerun.
                </p>
              </div>

              {loading ? (
                <span className="section-status status-success-pink">
                  Backtest running...
                </span>
              ) : combinedResult ? (
                <span className="section-status status-success-pink">
                  Results ready
                </span>
              ) : null}
            </div>

            {selectedStrategyId ? (
              <div className="workspace-card review-card" id="backtest-results-anchor">

                <div className="review-tabs">
                  <button
                    className={activeView === "overview" && combinedResult ? "active" : ""}
                    onClick={() => setActiveView("overview")}
                  >
                    Overview
                  </button>

                  <button
                    className={activeView === "metrics" ? "active" : ""}
                    onClick={() => setActiveView("metrics")}
                  >
                    Metrics
                  </button>

                  <button
                    className={activeView === "history" ? "active" : ""}
                    onClick={() => setActiveView("history")}
                  >
                    Backtest run history
                  </button>
                </div>

                {activeView === "overview" && (
                  combinedResult ? (
                    <>
                      {/* PERFORMANCE SUMMARY */}

                      <div className="review-metrics-grid">

                        <div className="review-metric">
                          <span>Total net profit</span>
                          <strong
                            className={
                              Number(combinedResult.metrics?.total_return || 0) >= 0
                                ? "text-positive"
                                : "text-negative"
                            }
                          >
                            {Number(combinedResult.metrics?.total_return || 0) >= 0
                              ? "+"
                              : ""}
                            {formatCurrency(combinedResult.metrics?.total_return)}
                          </strong>
                          <small>Strategy return</small>
                        </div>

                        <div className="review-metric">
                          <span>Max drawdown</span>
                          <strong className="text-negative">
                            -{Number(
                              combinedResult.metrics?.max_drawdown_percentage || 0
                            ).toFixed(2)}%
                          </strong>
                          <small>Maximum capital decline</small>
                        </div>

                        <div className="review-metric">
                          <span>Profit factor</span>
                          <strong>
                            {combinedResult.metrics?.profit_factor != null
                              ? Number(combinedResult.metrics.profit_factor).toFixed(2)
                              : "N/A"}
                          </strong>
                          <small>Gross profit / gross loss</small>
                        </div>

                        <div className="review-metric">
                          <span>Sharpe ratio</span>
                          <strong>
                            {Number(
                              combinedResult.metrics?.sharpe_ratio || 0
                            ).toFixed(2)}
                          </strong>
                          <small>Risk-adjusted return</small>
                        </div>

                      </div>

                      {/* EQUITY CURVE */}

                      <div
                        id="equity-curve-section"
                        className="review-chart-container"
                      >
                        <div className="workspace-card-heading">
                          <div>
                            <h3>Equity curve comparison</h3>
                            <p>
                              Strategy performance compared with buy and hold
                              over the same historical period.
                            </p>
                          </div>
                        </div>

                        <EquityCurve
                          data={combinedResult?.equity_curve}
                          splitDate={computedDates?.trainEnd}
                          symA={selectedCrypto?.symbol}
                          symB={selectedCrypto2?.symbol}
                          focusedTradeCycle={focusedTradeCycle}
                        />
                      </div>

                      {/* TRADE LOG */}

                      <div className="review-trade-log">
                        <TradeLogTable
                          trades={combinedResult?.trades}
                          title="Trade Log"
                          isPairs={isPairsTrading}
                          symA={selectedCrypto?.symbol || "Asset A"}
                          symB={selectedCrypto2?.symbol || "Asset B"}
                          onTradeClick={setFocusedTrade}
                          selectedTrade={focusedTrade}
                        />

                        {renderTradeDetails()}
                      </div>
                    </>
                  ) : (
                    <div className="workspace-empty">
                      <h3>No backtest results to display</h3>
                      <p>
                        Run a backtest or restore a previous run from the history tab.
                      </p>
                      <button
                        type="button"
                        className="button button-outline"
                        onClick={() => navigateToStep("step-backtest")}
                      >
                        Go to backtest
                      </button>
                    </div>
                  )
                )}

                {activeView === "metrics" && combinedResult && (
                  <div className="review-metrics-detail">

                    <div className="metrics-tabs">
                      <button
                        className={dataTab === "combined" ? "active" : ""}
                        onClick={() => setDataTab("combined")}
                      >
                        Combined 100%
                      </button>

                      <button
                        className={dataTab === "training" ? "active" : ""}
                        onClick={() => setDataTab("training")}
                      >
                        In-sample {trainSplit}%
                      </button>

                      <button
                        className={dataTab === "testing" ? "active" : ""}
                        onClick={() => setDataTab("testing")}
                      >
                        Out-of-sample {100 - trainSplit}%
                      </button>
                    </div>

                    <BacktestMetrics
                      metrics={
                        dataTab === "training"
                          ? trainResult?.metrics
                          : dataTab === "testing"
                            ? testResult?.metrics
                            : combinedResult?.metrics
                      }
                      trades={
                        dataTab === "training"
                          ? trainResult?.trades
                          : dataTab === "testing"
                            ? testResult?.trades
                            : combinedResult?.trades
                      }
                      bnhReturnPct={bnhReturnPct}
                      bnhReturnAbs={bnhReturnAbs}
                    />

                  </div>
                )}
                {activeView === "metrics" && !combinedResult && (
                  <div className="workspace-empty">
                    <h3>No metrics available</h3>
                    <p>Run a backtest or restore a previous run to view its metrics.</p>
                  </div>
                )}
                {activeView === "history" && (
                  <BacktestHistory
                    BASE_URL={BASE_URL}
                    strategies={savedStrategies}
                    onOpenStrategy={(strategyId) => {
                      navigate(`/workspace/edit?strategy_id=${strategyId}`);
                    }}
                    onRunBacktest={(strategyId) => {
                      navigate(`/workspace/edit?strategy_id=${strategyId}&run_backtest=true`);
                    }}
                    onViewResults={(backtestId, strategyId) => {
                      navigate(
                        `/workspace/edit?strategy_id=${strategyId}&backtest_id=${backtestId}`
                      );
                    }}
                  />
                )}

              </div>
            ) : (
              <div className="workspace-card review-empty">
                <div>
                  <h3>Your results will appear here.</h3>
                  <p>
                    Save your strategy, configure the backtest and run it
                    to see performance metrics, equity curves and individual
                    trades.
                  </p>
                </div>

                <button
                  className="button button-outline"
                  onClick={() => navigateToStep("step-backtest")}
                >
                  Go to backtest ↑
                </button>
              </div>
            )}
          </section>

          {/* ITERATION FOOTER */}

          <div className="review-iteration-footer">
            <div>
              <h3>Your next iteration starts here.</h3>
              <p>
                Review the results, adjust your parameters above,
                preview the signals and rerun the backtest.
              </p>
            </div>

            <div className="review-iteration-actions">
              <button
                className="button button-outline"
                onClick={() => navigateToStep("step-configure")}
              >
                Refine parameters
              </button>

              <button
                className="button-pink"
                onClick={handleSaveStrategy}
                disabled={isSaving || loading || !canPreview}
              >
                {isSaving ? "Saving..." : "Save Strategy"}
              </button>
            </div>
          </div>
          <div className="workspace-disclaimer">
            Historical research only. No live trading or execution.
            <span>Results do not guarantee future performance.</span>
          </div>

        </div>
      )}
    </>
  );
}