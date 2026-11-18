
import { useEffect, useMemo, useState } from "react";
import "../css/feature-library.css";

export const FEATURES = {
    use_bollinger: {
        title: "Bollinger Bands",
        category: "features",
        description: "Measures price relative to a rolling average and volatility envelope.",
        display: "Price-chart overlay with two bands.",
        params: ["bollinger_period", "bollinger_multiplier"],
        principles: ["mean_reversion"]
    },
    use_bollinger_breakout: {
        title: "Bollinger breakout",
        category: "features",
        description: "A band-based breakout feature for trend-following logic.",
        display: "Price-chart overlay with two bands.",
        params: ["bollinger_period", "bollinger_multiplier"],
        principles: ["trend_following"]
    },
    use_rsi: {
        title: "RSI filter",
        category: "features",
        description: "Momentum filter based on the Relative Strength Index.",
        display: "Plots a separate RSI chart.",
        params: ["rsi_period", "rsi_oversold", "rsi_overbought"],
        principles: ["mean_reversion", "trend_following"]
    },
    use_zscore: {
        title: "Z-score engine",
        category: "features",
        description: "Measures deviation from a rolling mean in standard-deviation units.",
        display: "Plots a separate chart with Z-score values.",
        params: ["zscore_period", "zscore_long_entry", "zscore_short_entry", "zscore_exit"],
        principles: ["mean_reversion", "pairs_trading"]
    },
    use_moving_averages: {
        title: "Moving-average crossover",
        category: "features",
        description: "Compares a short moving average with a longer moving average.",
        display: "Plotted if the chart returns the relevant series.",
        params: ["short_ma_period", "long_ma_period"],
        principles: ["trend_following"]
    },
    use_triple_ma: {
        title: "Triple moving averages",
        category: "features",
        description: "Describes trend alignment across three moving averages.",
        display: "Plotted if supported by chart data.",
        params: ["triple_ma_fast", "triple_ma_medium", "triple_ma_slow"],
        principles: ["trend_following"]
    },
    use_macd: {
        title: "MACD",
        category: "features",
        description: "Momentum and trend indicator based on moving-average differences.",
        display: "Internal unless a MACD pane is implemented.",
        params: ["macd_fast", "macd_slow", "macd_signal"],
        principles: ["trend_following", "mean_reversion"]
    },
    use_adx: {
        title: "ADX trend-strength filter",
        category: "features",
        description: "Measures trend strength, not direction by itself.",
        display: "Internal unless an ADX pane is implemented.",
        params: ["adx_period", "adx_threshold"],
        principles: ["trend_following"]
    },
    use_donchian: {
        title: "Donchian breakout",
        category: "features",
        description: "Uses the recent high/low range to identify breakouts.",
        display: "Plotted if Donchian channels are returned.",
        params: ["donchian_period"],
        principles: ["trend_following"]
    },
    use_atr_breakout: {
        title: "ATR breakout",
        category: "features",
        description: "Defines volatility-adjusted breakout levels.",
        display: "Internal or plotted depending on chart support.",
        params: ["atr_period", "atr_ma_period", "atr_multiplier_upper", "atr_multiplier_lower"],
        principles: ["trend_following"]
    },
    use_trend_filter: {
        title: "Trend filter",
        category: "features",
        description: "Adds a trend condition when supported by the strategy.",
        display: "Plots a trend line.",
        params: ["trend_filter_period"],
        principles: ["mean_reversion", "trend_following"]
    },
    use_vwap: {
        title: "VWAP",
        category: "features",
        description: "Use VWAP as an additional mean reference.",
        display: "Price overlay.",
        params: [],
        principles: ["mean_reversion"]
    },
    use_correlation: {
        title: "Correlation filter",
        category: "features",
        description: "Filters pair trades using rolling correlation.",
        display: "Internal unless the correlation pane is shown.",
        params: ["correlation_period", "correlation_threshold"],
        principles: ["pairs_trading"]
    },
    use_cointegration: {
        title: "Cointegration filter",
        category: "features",
        description: "Uses a p-value threshold to assess the pair relationship.",
        display: "Statistical filter, not a price overlay.",
        params: ["cointegration_pvalue_threshold"],
        principles: ["pairs_trading"]
    },

    use_ma_exit: {
        title: "Moving-average exit",
        category: "exit",
        description: "Configures an exit-related moving-average parameter.",
        display: "Plots signal lines if the MA line is crossed.",
        params: ["ma_exit_period"],
        principles: ["trend_following", "mean_reversion"]
    },
    use_time_stop: {
        title: "Time stop",
        category: "exit",
        description: "Limits holding duration when supported by the backend.",
        display: "Plots signal lines if time limits are reached.",
        params: ["time_stop_periods"],
        principles: ["mean_reversion", "trend_following", "pairs_trading"]
    },
    use_stop_loss: {
        title: "Stop-loss",
        category: "exit",
        description: "Configures a stop-loss rule when supported.",
        display: "Plots signal lines if stop events occur.",
        params: ["stop_loss_pct"],
        principles: ["mean_reversion", "trend_following"]
    },
    use_zscore_stop_loss: {
        title: "Z-score stop-loss",
        category: "exit",
        description: "Sets a Z-score stop threshold when supported.",
        display: "Logic only or shown on the Z-score pane.",
        params: ["zscore_stop_loss"],
        principles: ["pairs_trading"]
    }
};

export const LABELS = {
    bollinger_period: "Bollinger period",
    bollinger_multiplier: "Standard deviation multiplier",
    rsi_period: "RSI period",
    rsi_oversold: "RSI oversold threshold",
    rsi_overbought: "RSI overbought threshold",
    zscore_period: "Z-score lookback period",
    zscore_long_entry: "Long-entry Z-score",
    zscore_short_entry: "Short-entry Z-score",
    zscore_exit: "Z-score exit threshold",
    short_ma_period: "Short moving-average period",
    long_ma_period: "Long moving-average period",
    triple_ma_fast: "Fast moving-average period",
    triple_ma_medium: "Medium moving-average period",
    triple_ma_slow: "Slow moving-average period",
    macd_fast: "MACD fast period",
    macd_slow: "MACD slow period",
    macd_signal: "MACD signal period",
    adx_period: "ADX period",
    adx_threshold: "ADX threshold",
    donchian_period: "Donchian period",
    atr_period: "ATR period",
    atr_ma_period: "ATR average period",
    atr_multiplier_upper: "Upper ATR multiplier",
    atr_multiplier_lower: "Lower ATR multiplier",
    trend_filter_period: "Trend-filter period",
    ma_exit_period: "Moving-average exit period",
    time_stop_periods: "Maximum holding periods",
    stop_loss_pct: "Stop-loss (%)",
    zscore_stop_loss: "Z-score stop threshold",
    correlation_period: "Correlation lookback period",
    correlation_threshold: "Minimum correlation",
    cointegration_pvalue_threshold: "Maximum cointegration p-value"
};

export const DEFAULT_VALUES = {
    bollinger_period: 20,
    bollinger_multiplier: 2.0,
    rsi_period: 14,
    rsi_oversold: 30.0,
    rsi_overbought: 70.0,
    zscore_period: 50,
    zscore_long_entry: -2.0,
    zscore_short_entry: 2.0,
    zscore_exit: 0.0,
    short_ma_period: 50,
    long_ma_period: 200,
    triple_ma_fast: 10,
    triple_ma_medium: 20,
    triple_ma_slow: 50,
    macd_fast: 12,
    macd_slow: 26,
    macd_signal: 9,
    adx_period: 14,
    adx_threshold: 25.0,
    donchian_period: 20,
    atr_period: 20,
    atr_ma_period: 350,
    atr_multiplier_upper: 7.0,
    atr_multiplier_lower: 3.0,
    trend_filter_period: 200,
    ma_exit_period: 350,
    time_stop_periods: 10,
    stop_loss_pct: 2.0,
    zscore_stop_loss: 3.5,
    correlation_period: 50,
    correlation_threshold: 0.70,
    cointegration_pvalue_threshold: 0.05
};

function getParameterLabel(name, parameter) {
    return parameter?.label || LABELS[name] ||
        name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default function FeatureLibraryModal({
    open,
    onClose,
    onApply,
    principles = [],
    selectedPrinciple = "",
    values = {},
    parameters = []
}) {
    const [activePrinciple, setActivePrinciple] = useState(selectedPrinciple);
    const [selectedFeatures, setSelectedFeatures] = useState({});
    const [localValues, setLocalValues] = useState({});

    useEffect(() => {
        if (!open) return;

        setActivePrinciple(selectedPrinciple);

        const selected = {};
        Object.keys(FEATURES).forEach(key => {
            selected[key] = values[key] === true;
        });

        setSelectedFeatures(selected);
        setLocalValues({ ...values });
    }, [open, selectedPrinciple, values]);

    const availableFeatures = useMemo(() => {
        return Object.entries(FEATURES)
            .filter(([, feature]) => feature.principles.includes(activePrinciple))
            .map(([key, feature]) => ({
                key,
                ...feature
            }));
    }, [activePrinciple]);

    const featureGroups = useMemo(() => ({
        features: availableFeatures.filter(f => f.category === "features"),
        exit: availableFeatures.filter(f => f.category === "exit")
    }), [availableFeatures]);

    const selectedCount = Object.values(selectedFeatures).filter(Boolean).length;

    function toggleFeature(key, enabled) {
        setSelectedFeatures(previous => ({
            ...previous,
            [key]: enabled
        }));

        if (enabled) {
            const feature = FEATURES[key];

            setLocalValues(previous => {
                const updated = { ...previous };

                feature.params.forEach(name => {
                    if (updated[name] === undefined || updated[name] === "") {
                        updated[name] = DEFAULT_VALUES[name];
                    }
                });

                return updated;
            });
        }
    }

    function updateParameter(name, rawValue, parameter) {
        const type = parameter?.type ||
            (name.includes("pct") || name.includes("multiplier") ||
                name.includes("threshold") ? "number" : "integer");

        const value = rawValue === ""
            ? ""
            : type === "integer"
                ? Number.parseInt(rawValue, 10)
                : Number.parseFloat(rawValue);

        setLocalValues(previous => ({
            ...previous,
            [name]: value
        }));
    }

    function applyChanges() {
        onApply({
            selectedFeatures,
            parameterValues: localValues
        });

        onClose();
    }


    function renderFeature(feature) {
        const enabled = selectedFeatures[feature.key] === true;

        function handleKeyDown(event) {
            if (event.target !== event.currentTarget) return;

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleFeature(feature.key, !enabled);
            }
        }

        return (
            <article
                className={`library-feature-card ${enabled ? "active" : ""}`}
                key={feature.key}
                role="checkbox"
                aria-checked={enabled}
                aria-label={feature.title}
                tabIndex={0}
                onClick={() => toggleFeature(feature.key, !enabled)}
                onKeyDown={handleKeyDown}
            >
                <div className="library-feature-header">
                    <div className="library-feature-heading">
                        <span className="library-feature-title">
                            {feature.title}
                        </span>
                    </div>

                    <span className={`library-feature-status ${enabled ? "enabled" : ""}`}>
                        {enabled ? "Selected" : "Available"}
                    </span>
                </div>

                <p className="library-feature-description">
                    {feature.description}
                </p>

                {feature.params.length > 0 && (
                    <div
                        className="library-feature-parameters"
                        onClick={event => event.stopPropagation()}
                        onKeyDown={event => event.stopPropagation()}
                    >
                        {enabled ? (
                            feature.params.map(name => {
                                const parameter = parameters.find(
                                    p => p.name === name
                                );

                                const type = parameter?.type ||
                                    (name.includes("pct") ||
                                        name.includes("multiplier") ||
                                        name.includes("threshold")
                                        ? "number"
                                        : "integer");

                                return (
                                    <div className="library-parameter" key={name}>
                                        <label htmlFor={`library-param-${name}-${feature.key}`}>
                                            {getParameterLabel(name, parameter)}
                                        </label>

                                        <input
                                            id={`library-param-${name}-${feature.key}`}
                                            type="number"
                                            step={type === "integer" ? "1" : "0.01"}
                                            min={parameter?.min ?? undefined}
                                            max={parameter?.max ?? undefined}
                                            value={localValues[name] ?? ""}
                                            onChange={event =>
                                                updateParameter(
                                                    name,
                                                    event.target.value,
                                                    parameter
                                                )
                                            }
                                        />

                                        {parameter?.description && (
                                            <small>{parameter.description}</small>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <span className="library-parameter-hint">
                                Select this feature to configure its parameters.
                            </span>
                        )}
                    </div>
                )}

                {feature.params.length === 0 && (
                    <span className="library-parameter-hint">
                        No additional parameters.
                    </span>
                )}
            </article>
        );
    }

    if (!open) return null;

    return (
        <div
            className="feature-library-overlay"
            onMouseDown={event => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                className="feature-library-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="feature-library-title"
            >
                <header className="feature-library-header">
                    <div>
                        <span className="feature-library-eyebrow">
                            STRATEGY CONFIGURATION
                        </span>
                        <h2 id="feature-library-title">Select a feature</h2>
                        <p>
                            Browse available features and configure their parameters.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="feature-library-close"
                        onClick={onClose}
                        aria-label="Close feature library"
                    >
                        ×
                    </button>
                </header>

                <div className="feature-library-body">
                    <aside className="feature-library-sidebar">
                        <div className="library-section-heading">
                            <h3>Strategy principles</h3>
                            <span>{principles.length}</span>
                        </div>

                        <div className="library-principle-list">
                            {principles.map(item => (
                                <button
                                    type="button"
                                    key={item.id ?? item.key}
                                    className={`library-principle-option ${activePrinciple === item.key ? "active" : ""
                                        }`}
                                    onClick={() => setActivePrinciple(item.key)}
                                >
                                    <span>{item.title}</span>
                                    {activePrinciple === item.key && (
                                        <span className="library-principle-check">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className="feature-library-content">
                        <div className="library-content-heading">
                            <div>
                                <h3>
                                    {principles.find(p => p.key === activePrinciple)?.title ||
                                        "Available features"}
                                </h3>
                                <p>
                                    Choose the features you want to include in your strategy.
                                </p>
                            </div>
                            <span className="library-selected-count">
                                {selectedCount} selected
                            </span>
                        </div>

                        {featureGroups.features.length > 0 && (
                            <section className="library-feature-section">
                                <h4>Features & indicators</h4>
                                <div className="library-feature-list">
                                    {featureGroups.features.map(renderFeature)}
                                </div>
                            </section>
                        )}

                        {featureGroups.exit.length > 0 && (
                            <section className="library-feature-section">
                                <h4>Exit rules & risk management</h4>
                                <div className="library-feature-list">
                                    {featureGroups.exit.map(renderFeature)}
                                </div>
                            </section>
                        )}

                        {availableFeatures.length === 0 && (
                            <div className="library-empty">
                                <h4>No features available</h4>
                                <p>
                                    There are currently no features assigned to this principle.
                                </p>
                            </div>
                        )}
                    </main>
                </div>

                <footer className="feature-library-footer">
                    <p>
                        <span className="library-info-icon">i</span>
                        It is possible to mix features from different principles, but
                        choosing the default options is highly recommended.
                    </p>

                    <div className="feature-library-actions">
                        <button
                            type="button"
                            className="button button-purple"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="button button-primary"
                            onClick={applyChanges}
                        >
                            Apply {selectedCount > 0 ? `(${selectedCount})` : ""}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
