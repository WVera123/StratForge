import React from 'react';
import { calculateBacktestMetrics } from './../helpers/metricsHelper';

function BacktestMetrics({ metrics, trades = [], bnhReturnPct = 0, bnhReturnAbs = 0 }) {
    if (!metrics) return null;

    // Delegate all calculation and array structuring to the helper file
    const calculatedData = calculateBacktestMetrics(metrics, trades, bnhReturnPct, bnhReturnAbs);
    if (!calculatedData) return null;

    const { metricItems, exitReasons } = calculatedData;

    return (
        <div className="metrics-comparison">
            <div className="backtest-metrics-card">
                <div className="exit-reasons-header">
                    <h4>Performance Breakdown</h4>
                </div>

                <div className="metrics-list metrics-list-2col">
                    {metricItems.map((metric) => (
                        <div key={metric.label} className="metric-row">
                            <span>{metric.label}</span>
                            <strong className={
                                metric.value.includes('-') &&
                                    metric.label !== "Max Drawdown" &&
                                    metric.label !== "Fee & Slippage Drag"
                                    ? "text-negative"
                                    : metric.value.includes('+')
                                        ? "text-positive"
                                        : ""
                            }>
                                {metric.value}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>

            <div className="backtest-metrics-card">
                <div className="exit-reasons-header">
                    <h4>Exit Reasons Breakdown</h4>
                </div>

                <div className="metrics-list">
                    {exitReasons.map((metric) => (
                        <div key={metric.label} className="metric-row">
                            <span>{metric.label}</span>
                            <strong>{metric.value}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BacktestMetrics;