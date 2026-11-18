import { useEffect, useMemo, useState } from "react";
import "./../css/strategy-workspace.css";

function formatPercent(value) {
    if (value == null || isNaN(value)) return "—";
    return `${Number(value).toFixed(2)}%`;
}

function formatNumber(value) {
    if (value == null || isNaN(value)) return "—";
    return Number(value).toFixed(2);
}

function formatCurrency(value) {
    if (value == null || isNaN(value)) return "—";
    const prefix = Number(value) >= 0 ? "+" : "";
    return `${prefix}$${Math.abs(Number(value)).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Retrieves data strictly from the flat DB rows
function getHelperMetrics(run) {
    if (!run) return null;
    return {
        totalReturn: formatCurrency(run.total_pnl),
        totalReturnNum: Number(run.total_pnl) || 0,
        maxDrawdown: formatPercent(run.max_drawdown),
        winRate: formatPercent(run.win_rate),
        profitFactor: formatNumber(run.profit_factor),
        sharpeRatio: formatNumber(run.sharpe_ratio),
        tradeCount: run.trade_count ?? 0
    };
}

function getPrincipleLabel(value) {
    const labels = {
        mean_reversion: "Mean Reversion",
        trend_following: "Trend Following",
        pairs_trading: "Pair Trading",
        rule_based: "Rule Based"
    };
    return labels[value] || value || "—";
}

function getStatus(run) {
    const raw = String(run?.status || run?.state || "completed").toLowerCase();
    if (["failed", "error"].includes(raw)) return "Failed";
    if (["running", "pending", "queued"].includes(raw)) return "Running";
    return "Completed";
}

function getRunLabel(run, index) {
    return run?.run_number
        ? `Run ${String(run.run_number).padStart(2, "0")}`
        : `Run ${String(index + 1).padStart(2, "0")}`;
}

function getLatestRun(runs) {
    if (!runs?.length) return null;
    return [...runs].sort((a, b) => {
        const aDate = new Date(a.created_at || 0).getTime();
        const bDate = new Date(b.created_at || 0).getTime();
        return bDate - aDate;
    })[0];
}

function getCurrencyLabel(currency) {
    if (!currency) return null;

    if (currency.symbol) {
        return currency.symbol;
    }

    if (currency.base_asset && currency.quote_asset) {
        return `${currency.base_asset}/${currency.quote_asset}`;
    }

    return currency.base_asset || currency.quote_asset || null;
}

function getStrategyCurrencyLabel(strategy, currencies) {
    const currencyMap = new Map(
        currencies.map(currency => [
            String(currency.id),
            getCurrencyLabel(currency)
        ])
    );

    const crypto1Id = strategy.crypto1 ?? strategy.crypto1_id;
    const crypto2Id = strategy.crypto2 ?? strategy.crypto2_id;

    const crypto1 = crypto1Id != null
        ? currencyMap.get(String(crypto1Id))
        : null;

    const crypto2 = crypto2Id != null
        ? currencyMap.get(String(crypto2Id))
        : null;

    if (crypto1 && crypto2) {
        return `${crypto1} / ${crypto2}`;
    }

    if (crypto1) {
        return crypto1;
    }

    if (crypto2) {
        return crypto2;
    }

    return strategy.symbol ||
        strategy.crypto_symbol ||
        strategy.pair ||
        "—";
}

export default function BacktestHistory({
    BASE_URL,
    strategies = [],
    onOpenStrategy,
    onRunBacktest,
    onViewResults
}) {
    const [currencies, setCurrencies] = useState([]);
    const [historyByStrategy, setHistoryByStrategy] = useState({});
    const [loadingByStrategy, setLoadingByStrategy] = useState({});
    const [expandedStrategyId, setExpandedStrategyId] = useState(null);
    const [search, setSearch] = useState("");
    const [principleFilter, setPrincipleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCurrencies() {
            try {
                const response = await fetch(`${BASE_URL}/currencies`);

                if (!response.ok) {
                    throw new Error("Could not load currencies.");
                }

                const body = await response.json();
                const currencyList = Array.isArray(body)
                    ? body
                    : body?.items || body?.currencies || [];

                setCurrencies(currencyList);
            } catch (err) {
                console.error("Error loading currencies:", err);
            }
        }

        if (BASE_URL) {
            loadCurrencies();
        }
    }, [BASE_URL]);

    async function loadHistory(strategyId, force = false) {
        if (!strategyId) return;
        if (!force && Object.prototype.hasOwnProperty.call(historyByStrategy, strategyId)) return;

        setLoadingByStrategy(previous => ({ ...previous, [strategyId]: true }));
        setError("");

        try {
            const response = await fetch(`${BASE_URL}/backtests/history?strategy_id=${encodeURIComponent(strategyId)}`);
            const body = await response.text();
            if (!response.ok) throw new Error(body || `Could not load history for strategy ${strategyId}.`);

            const parsed = body ? JSON.parse(body) : [];
            const runs = Array.isArray(parsed) ? parsed : (parsed?.items || parsed?.runs || []);

            setHistoryByStrategy(previous => ({ ...previous, [strategyId]: runs }));
        } catch (err) {
            setError(err.message || "Could not load backtest history.");
            setHistoryByStrategy(previous => ({ ...previous, [strategyId]: previous[strategyId] || [] }));
        } finally {
            setLoadingByStrategy(previous => ({ ...previous, [strategyId]: false }));
        }
    }

    useEffect(() => {
        if (!strategies.length) return;
        strategies.forEach(strategy => {
            loadHistory(strategy.id);
        });
        setExpandedStrategyId(previous => previous == null ? strategies[0].id : previous);
    }, [strategies]);

    const filteredStrategies = useMemo(() => {
        return strategies.filter(strategy => {
            const title = String(strategy.title || strategy.name || "").toLowerCase();
            const matchesSearch = title.includes(search.trim().toLowerCase());
            const matchesPrinciple = principleFilter === "all" || strategy.principle === principleFilter;
            const runs = historyByStrategy[strategy.id] || [];
            const hasCompleted = runs.some(run => getStatus(run) === "Completed");
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "completed" && hasCompleted) ||
                (statusFilter === "not_tested" && runs.length === 0) ||
                (statusFilter === "running" && runs.some(run => getStatus(run) === "Running"));

            return matchesSearch && matchesPrinciple && matchesStatus;
        });
    }, [strategies, historyByStrategy, search, principleFilter, statusFilter]);

    const testedStrategies = strategies.filter(strategy =>
        (historyByStrategy[strategy.id] || []).some(run => getStatus(run) === "Completed")
    ).length;

    function strategyRuns(strategy) {
        return historyByStrategy[strategy.id] || [];
    }

    function strategyLatestRun(strategy) {
        return getLatestRun(strategyRuns(strategy).filter(run => getStatus(run) === "Completed"));
    }

    return (
        <main className="history-page">
            <header className="history-page-heading">
                <div className="history-heading-text">
                    <h3>Strategy &amp; backtest history</h3>
                    <p>Compare saved strategies in a structured table, then drill into the selected strategy’s runs.</p>
                </div>
            </header>

            <section className="history-strategies-section">
                <div className="history-section-title">
                    <h4>Saved strategies ({strategies.length})</h4>
                    <span className="history-section-subtitle">
                        {testedStrategies} with completed backtests {" · "} {strategies.length - testedStrategies} not yet backtested
                    </span>
                </div>

                <div className="history-filters">
                    <label>
                        <span>Search strategies</span>
                        <input type="search" placeholder="Search by strategy name..." value={search} onChange={event => setSearch(event.target.value)} />
                    </label>
                    <label>
                        <span>Principle</span>
                        <select value={principleFilter} onChange={event => setPrincipleFilter(event.target.value)}>
                            <option value="all">All principles</option>
                            {[...new Set(strategies.map(strategy => strategy.principle).filter(Boolean))].map(value => (
                                <option key={value} value={value}>{getPrincipleLabel(value)}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Backtest status</span>
                        <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
                            <option value="all">All statuses</option>
                            <option value="completed">Completed backtests</option>
                            <option value="not_tested">Not yet backtested</option>
                            <option value="running">Running</option>
                        </select>
                    </label>
                </div>

                {error && <div className="history-error" role="alert">{error}</div>}

                <div className="history-table-wrap">
                    <table className="history-strategy-table">
                        <thead>
                            <tr>
                                <th>Strategy</th>
                                <th>Principle</th>
                                <th>Last backtest</th>
                                <th>Total return</th>
                                <th>Max drawdown</th>
                                <th>Win rate</th>
                                <th>Profit factor</th>
                                <th>Sharpe ratio</th>
                                <th>Backtest actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStrategies.map(strategy => {
                                const runs = strategyRuns(strategy);
                                const latest = strategyLatestRun(strategy);
                                const expanded = String(expandedStrategyId) === String(strategy.id);
                                const loading = Boolean(loadingByStrategy[strategy.id]);
                                const latestMetrics = latest ? getHelperMetrics(latest) : null;
                                const lastCompletedIndex = runs.findIndex(run => String(run.id) === String(latest?.id));

                                return (
                                    <tr key={strategy.id} className={expanded ? "strategy-row expanded" : "strategy-row"}>
                                        <td className="strategy-name-cell">
                                            <div className="strategy-title-text">{strategy.title || strategy.name || `Strategy ${strategy.id}`}</div>
                                            <div className="strategy-subtitle-text">
                                                {getStrategyCurrencyLabel(strategy, currencies)}
                                                {strategy.timeframe ? ` · ${strategy.timeframe}` : ""}
                                            </div>
                                            {expanded && <div className="strategy-selected-label">Selected · history below</div>}
                                            <div className="strategy-row-links">
                                                <button type="button" onClick={() => onOpenStrategy?.(strategy.id)}>Open strategy</button>
                                                <button type="button" onClick={() => onOpenStrategy?.(strategy.id)}>Edit</button>
                                            </div>
                                        </td>
                                        <td className="table-text-cell">{getPrincipleLabel(strategy.principle)}</td>
                                        <td className="table-text-cell">
                                            {latest ? (
                                                <>
                                                    <div className="bold-run-text">{getRunLabel(latest, Math.max(lastCompletedIndex, 0))} {" · Latest"}</div>
                                                    <div className="sub-run-text">{getStatus(latest)}</div>
                                                    <div className="sub-run-text">{runs.filter(run => getStatus(run) === "Completed").length} completed runs</div>
                                                </>
                                            ) : loading ? ("Loading...") : (
                                                <div>
                                                    <div className="bold-run-text">Not yet backtested</div>
                                                    <div className="sub-run-text">0 completed runs</div>
                                                </div>
                                            )}
                                        </td>
                                        <td className={`table-text-cell ${latestMetrics?.totalReturnNum >= 0 ? "metric-positive" : "metric-negative"}`}>
                                            {latestMetrics ? latestMetrics.totalReturn : "—"}
                                        </td>
                                        <td className="table-text-cell">{latestMetrics ? latestMetrics.maxDrawdown : "—"}</td>
                                        <td className="table-text-cell">{latestMetrics ? latestMetrics.winRate : "—"}</td>
                                        <td className="table-text-cell">{latestMetrics ? latestMetrics.profitFactor : "—"}</td>
                                        <td className="table-text-cell">{latestMetrics ? latestMetrics.sharpeRatio : "—"}</td>
                                        <td className="history-actions-cell">
                                            <div className="history-action-row">
                                                <button type="button" className="history-primary-button" onClick={() => onRunBacktest?.(strategy.id)}>
                                                    {latest ? "Run again" : "Run backtest"}
                                                </button>
                                                {latest && (
                                                    <button type="button" className="history-text-button" onClick={() => onViewResults?.(latest.id, strategy.id)}>
                                                        View results
                                                    </button>
                                                )}
                                            </div>
                                            {runs.length > 0 ? (
                                                <button type="button" className="history-expand-button" onClick={() => { setExpandedStrategyId(expanded ? null : strategy.id); if (!expanded) loadHistory(strategy.id); }}>
                                                    Past backtests ({runs.length})
                                                </button>
                                            ) : (
                                                <div className="history-no-results">No results available</div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredStrategies.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="history-no-matches">No strategies match these filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {expandedStrategyId != null && (() => {
                    const strategy = strategies.find(item => String(item.id) === String(expandedStrategyId));
                    if (!strategy) return null;

                    const runs = strategyRuns(strategy);
                    const sortedRuns = [...runs].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

                    return (
                        <section className="history-runs-panel">
                            <div className="history-runs-heading">
                                <h2>Previous backtests — {strategy.title || strategy.name}</h2>
                                <p>Selected strategy · {runs.filter(run => getStatus(run) === "Completed").length} completed runs.</p>
                            </div>
                            {loadingByStrategy[strategy.id] && runs.length === 0 ? (
                                <p className="history-inline-message">Loading previous backtests...</p>
                            ) : runs.length === 0 ? (
                                <p className="history-inline-message">No previous backtests are available for this strategy.</p>
                            ) : (
                                <div className="history-runs-table-wrap">
                                    <table className="history-runs-table">
                                        <thead>
                                            <tr>
                                                <th>Run / status</th>
                                                <th>Total return</th>
                                                <th>Max drawdown</th>
                                                <th>Win rate</th>
                                                <th>Profit factor</th>
                                                <th>Sharpe ratio</th>
                                                <th>Trades</th>
                                                <th>Result actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedRuns.map((run, index) => {
                                                const historicalMetrics = getHelperMetrics(run) || {};
                                                return (
                                                    <tr key={run.id ?? `${strategy.id}-${index}`}>
                                                        <td className="table-text-cell">
                                                            <div className="bold-run-text">{getRunLabel(run, runs.length - index - 1)} {" · "} {getStatus(run)}</div>
                                                            <div className="sub-run-text">{index === 0 ? "Latest" : "Earlier"}</div>
                                                        </td>
                                                        <td className={`table-text-cell ${historicalMetrics.totalReturnNum >= 0 ? "metric-positive" : "metric-negative"}`}>
                                                            {historicalMetrics.totalReturn ?? "—"}
                                                        </td>
                                                        <td className="table-text-cell">{historicalMetrics.maxDrawdown ?? "—"}</td>
                                                        <td className="table-text-cell">{historicalMetrics.winRate ?? "—"}</td>
                                                        <td className="table-text-cell">{historicalMetrics.profitFactor ?? "—"}</td>
                                                        <td className="table-text-cell">{historicalMetrics.sharpeRatio ?? "—"}</td>
                                                        <td className="table-text-cell">{historicalMetrics.tradeCount ?? "—"}</td>
                                                        <td className="history-run-actions">
                                                            <button type="button" onClick={() => onViewResults?.(run.id, strategy.id)}>Open results</button>
                                                            <button type="button" onClick={() => onRunBacktest?.(strategy.id)}>Rerun</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    );
                })()}
            </section>
            <footer className="history-page-footer">
                Performance shown is from each strategy’s latest completed run.
            </footer>
        </main>
    );
}