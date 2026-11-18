import React from "react";

const formatMonthYear = (dateStr) => {
    if (!dateStr) return "";

    const [year, month] = dateStr.split("-").map(Number);

    if (!year || !month) return dateStr;

    return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
    });
};

const formatRuleTokens = (tokens) => {
    if (!Array.isArray(tokens) || tokens.length === 0) {
        return "No rules defined yet.";
    }

    return tokens.map((token) => {
        if (!token || typeof token !== "object") {
            return String(token ?? "");
        }

        const label = token.label || token.value || "";

        if (token.type === "operator" || token.type === "action") {
            const value = token.paramValue;

            if (value !== undefined && value !== null && value !== "") {
                const suffix =
                    token.value === "above" || token.value === "below"
                        ? ""
                        : "%";

                return `${label} ${value}${suffix}`;
            }
        }

        return label;
    }).join(" ");
};

export function getChartLegends(principle, values = {}) {
    const legends = [];

    legends.push({ label: "Price (Up)", color: "#16a34a" });
    legends.push({ label: "Price (Down)", color: "#dc2626" });

    if (values.use_bollinger || values.use_bollinger_breakout) {
        legends.push({
            label: "Bollinger Channel",
            color: "#2563eb",
            isArea: true
        });
        legends.push({ label: "BB Middle", color: "#64748b" });
    }

    if (values.use_moving_averages) {
        legends.push({ label: "Fast MA", color: "#22c55e" });
        legends.push({ label: "Slow MA", color: "#ef4444" });
    }

    if (values.use_triple_ma) {
        legends.push({ label: "Fast MA", color: "#22c55e" });
        legends.push({ label: "Med MA", color: "#eab308" });
        legends.push({ label: "Slow MA", color: "#ef4444" });
    }

    if (values.use_trend_filter) {
        legends.push({ label: "Macro Trend", color: "#000000" });
    }

    if (values.use_ma_exit) {
        legends.push({
            label: "MA Exit Line",
            color: "#e11d48",
            dashed: true
        });
    }

    if (values.use_vwap) {
        legends.push({ label: "VWAP", color: "#f59e0b" });
    }

    if (values.use_donchian) {
        legends.push({
            label: "Donchian Channel",
            color: "#64748b",
            isArea: true
        });
        legends.push({ label: "Donchian Mid", color: "#64748b" });
    }

    if (values.use_atr_breakout) {
        legends.push({
            label: "ATR Channel",
            color: "#f97316",
            isArea: true
        });
    }

    if (values.use_rsi) {
        legends.push({ label: "RSI Line", color: "#000000" });
        legends.push({
            label: "RSI Overbought",
            color: "#dc2626",
            dashed: true
        });
        legends.push({
            label: "RSI Oversold",
            color: "#16a34a",
            dashed: true
        });
    }

    if (values.use_zscore) {
        legends.push({ label: "Z-Score", color: "#000000" });

        if (values.zscore_long_entry !== undefined) {
            legends.push({
                label: "Z-Score Long",
                color: "#16a34a",
                dashed: true
            });
        }

        if (values.zscore_short_entry !== undefined) {
            legends.push({
                label: "Z-Score Short",
                color: "#dc2626",
                dashed: true
            });
        }

        if (values.zscore_exit !== undefined) {
            legends.push({
                label: "Z-Score Exit",
                color: "#6b7280",
                dashed: true
            });
        }
    }

    if (values.use_macd) {
        legends.push({ label: "MACD Line", color: "#000000" });
        legends.push({ label: "MACD Signal", color: "#dc2626" });
        legends.push({
            label: "MACD Hist (+)",
            color: "#16a34a",
            isArea: true
        });
        legends.push({
            label: "MACD Hist (-)",
            color: "#dc2626",
            isArea: true
        });
    }

    if (values.use_adx) {
        legends.push({ label: "ADX", color: "#000000" });
        legends.push({ label: "+DI", color: "#16a34a" });
        legends.push({ label: "-DI", color: "#dc2626" });
        legends.push({
            label: "ADX Threshold",
            color: "#6b7280",
            dashed: true
        });
    }

    if (values.use_correlation) {
        legends.push({
            label: "Rolling Correlation",
            color: "#000000"
        });
        legends.push({
            label: "Corr Threshold",
            color: "#6b7280",
            dashed: true
        });
    }

    if (principle === "pairs_trading") {
        legends.push({ label: "Asset A (Log)", color: "#2563eb" });
        legends.push({ label: "Asset B (Beta-Adj)", color: "#f59e0b" });
    }

    return legends;
}

export function ChartLegend({ principle, values = {} }) {
    const legends = getChartLegends(principle, values);

    return (
        <div className="preview-sidebar-legend">
            <h4>Chart legend</h4>

            {legends.length > 0 ? (
                <div className="legend-grid">
                    {legends.map((legend, index) => (
                        <div key={`${legend.label}-${index}`} className="legend-item">
                            <span
                                className="legend-color-box"
                                style={{
                                    height: legend.isArea
                                        ? "10px"
                                        : legend.dashed
                                            ? "0px"
                                            : "3px",
                                    backgroundColor:
                                        legend.isArea || !legend.dashed
                                            ? legend.color
                                            : "transparent",
                                    borderTop: legend.dashed
                                        ? `2px dashed ${legend.color}`
                                        : "none",
                                    opacity: legend.isArea ? 0.3 : 1,
                                    borderRadius: legend.isArea ? "2px" : "0px"
                                }}
                            />
                            <strong>{legend.label}</strong>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="muted-help">No active overlays.</p>
            )}
        </div>
    );
}

export default function StrategyLogicSummary({
    principle,
    parameters = [],
    values = {},
    crypto1,
    crypto2,
    currencies = [],
    startDate,
    endDate
}) {
    if (!principle) return null;

    const symbol = (id) =>
        currencies.find((c) => String(c.id) === String(id))?.symbol || id || "—";

    const entryConditions = [];

    if (principle === "rule_based") {
        entryConditions.push(
            `Custom Logic: ${formatRuleTokens(values.tokens)}`
        );
    } else {
        if (values.use_bollinger) {
            entryConditions.push(
                "BUY when price crosses below the lower Bollinger Band. SELL when price crosses above the upper band."
            );
        }

        if (values.use_bollinger_breakout) {
            entryConditions.push(
                "BUY when price breaks above upper Bollinger Band. SELL on lower breakout."
            );
        }

        if (values.use_moving_averages) {
            entryConditions.push(
                `BUY when short MA (${values.short_ma_period}) crosses above long MA (${values.long_ma_period}). SELL when short MA crosses below.`
            );
        }

        if (values.use_triple_ma) {
            entryConditions.push(
                `BUY on fast (${values.triple_ma_fast}), medium (${values.triple_ma_medium}), and slow (${values.triple_ma_slow}) bullish alignment. SELL on bearish alignment.`
            );
        }

        if (values.use_donchian) {
            entryConditions.push(
                "BUY when price breaks above Donchian channel. SELL on lower breakout."
            );
        }

        if (values.use_atr_breakout) {
            entryConditions.push(
                "BUY when price breaks upper ATR band. SELL on lower ATR breakout."
            );
        }

        if (values.use_vwap) {
            entryConditions.push(
                "BUY when price crosses below VWAP. SELL when crossing above VWAP."
            );
        }

        if (values.use_zscore) {
            entryConditions.push(
                `Spread Z-Score crosses long entry threshold (${values.zscore_long_entry}) or short entry threshold (${values.zscore_short_entry}).`
            );
        }
    }

    const internalFilters = [];

    if (values.use_rsi) {
        internalFilters.push(
            `RSI Filter: Requires RSI to be outside ${values.rsi_oversold} - ${values.rsi_overbought}.`
        );
    }

    if (values.use_adx) {
        internalFilters.push(
            `ADX Filter: Requires trend strength > ${values.adx_threshold}.`
        );
    }

    if (values.use_trend_filter) {
        internalFilters.push(
            `Macro Trend: Requires entry to match SMA (${values.trend_filter_period}) direction.`
        );
    }

    if (values.use_correlation) {
        internalFilters.push(
            `Correlation: Requires pair correlation > ${values.correlation_threshold}.`
        );
    }

    if (values.use_cointegration) {
        internalFilters.push(
            `Cointegration: Blocks trades if ADF p-value > ${values.cointegration_pvalue_threshold}.`
        );
    }

    const exitConditions = [];

    if (principle === "rule_based") {
        exitConditions.push(
            "Exits are determined by SELL actions in your custom rules."
        );
    } else {
        if (principle === "mean_reversion" && values.use_bollinger) {
            exitConditions.push(
                "Normal Exit: Price returns to the middle Bollinger Band."
            );
        }

        if (principle === "mean_reversion" && values.use_vwap) {
            exitConditions.push(
                "Normal Exit: Price returns to VWAP line."
            );
        }

        if (values.use_ma_exit) {
            exitConditions.push(
                "Normal Exit: Price crosses the moving average exit line."
            );
        }

        if (values.use_zscore) {
            exitConditions.push(
                `Normal Exit: Spread Z-score converges back toward exit threshold (${values.zscore_exit}).`
            );
        }

        if (values.use_stop_loss) {
            exitConditions.push(
                `Risk Exit: Stop-loss triggers at ${values.stop_loss_pct}% loss from entry price.`
            );
        }

        if (values.use_time_stop) {
            exitConditions.push(
                `Risk Exit: Time stop triggers after holding for ${values.time_stop_periods} consecutive periods.`
            );
        }

        if (values.use_zscore_stop_loss) {
            exitConditions.push(
                `Risk Exit: Spread diverges past Z-score stop threshold (${values.zscore_stop_loss}).`
            );
        }
    }

    return (
        <section className="strategy-logic-summary" aria-live="polite">
            <div className="logic-sections-grid">

                <div className="logic-section logic-section-filters">
                    <div className="logic-section-heading">
                        <span className="logic-section-indicator" />

                        <div>
                            <h4>Internal Filters & Constraints</h4>
                            <p>Conditions that control when trades are allowed.</p>
                        </div>

                        <span className="logic-section-count">
                            {internalFilters.length}
                        </span>
                    </div>

                    {internalFilters.length > 0 ? (
                        <ul className="logic-condition-list">
                            {internalFilters.map((condition, index) => (
                                <li key={index}>{condition}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="logic-empty-message">
                            No specific internal constraints enabled.
                        </p>
                    )}
                </div>

                <div className="logic-section logic-section-entry">
                    <div className="logic-section-heading">
                        <span className="logic-section-indicator" />

                        <div>
                            <h4>Core Entry Triggers</h4>
                            <p>Signals that initiate a new position.</p>
                        </div>

                        <span className="logic-section-count">
                            {entryConditions.length}
                        </span>
                    </div>

                    {entryConditions.length > 0 ? (
                        <ul className="logic-condition-list">
                            {entryConditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="logic-empty-message">
                            No specific entry condition triggers configured.
                        </p>
                    )}
                </div>

                <div className="logic-section logic-section-exit">
                    <div className="logic-section-heading">
                        <span className="logic-section-indicator" />

                        <div>
                            <h4>Core Exit Triggers</h4>
                            <p>Conditions that close or reverse positions.</p>
                        </div>

                        <span className="logic-section-count">
                            {exitConditions.length}
                        </span>
                    </div>

                    {exitConditions.length > 0 ? (
                        <ul className="logic-condition-list">
                            {exitConditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="logic-empty-message">
                            No specific exit conditions enabled. Opposing entry
                            signals might reverse position.
                        </p>
                    )}
                </div>

            </div>
        </section>
    );
}

export function DataRangeSummary({ startDate, endDate }) {
    const hasDateRange = Boolean(startDate && endDate);

    const dateRange = hasDateRange
        ? `${formatMonthYear(startDate)} — ${formatMonthYear(endDate)}`
        : "Waiting for data";

    return (
        <div className="logic-date-range">
            <div className="logic-date-content">
                <span className="logic-eyebrow">
                    {dateRange.toUpperCase()}
                </span>
            </div>
        </div>
    );
}