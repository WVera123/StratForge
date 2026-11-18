export function calculateBacktestMetrics(metrics, trades = [], bnhReturnPct = 0, bnhReturnAbs = 0) {
    if (!metrics) return null;

    // Fallback to flat property names if the nested ones are missing
    const totalReturn = metrics.total_return_percentage ?? metrics.total_return ?? 0;
    const excessReturn = totalReturn - bnhReturnPct;
    const maxDrawdown = metrics.max_drawdown_percentage ?? metrics.max_drawdown ?? 0;
    const winRate = metrics.win_rate ?? 0;

    let computedAvgWin = 0;
    let computedAvgLoss = 0;
    let computedAvgTradeReturn = 0;

    const exitTrades = trades.filter(t => t.action === 'sell' || t.action === 'exit');

    if (exitTrades.length > 0) {
        const wins = exitTrades.filter(t => Number(t.pnl) > 0);
        const losses = exitTrades.filter(t => Number(t.pnl) < 0);

        const totalWin = wins.reduce((sum, t) => sum + Number(t.pnl), 0);
        const totalLoss = losses.reduce((sum, t) => sum + Number(t.pnl), 0);

        computedAvgWin = wins.length > 0 ? totalWin / wins.length : 0;
        computedAvgLoss = losses.length > 0 ? totalLoss / losses.length : 0;

        let totalReturnPct = 0;
        exitTrades.forEach(t => {
            const pnl = Number(t.pnl);
            const equityBefore = Number(t.equity_after) - pnl;
            if (equityBefore > 0) {
                totalReturnPct += (pnl / equityBefore) * 100;
            }
        });
        computedAvgTradeReturn = totalReturnPct / exitTrades.length;
    }

    const finalAvgWin = metrics.avg_win ? metrics.avg_win : computedAvgWin;
    const finalAvgLoss = metrics.avg_loss ? metrics.avg_loss : computedAvgLoss;
    const finalAvgTradeRet = metrics.avg_trade_return_percentage ? metrics.avg_trade_return_percentage : computedAvgTradeReturn;

    const profitFactor = metrics.profit_factor != null
        ? Number(metrics.profit_factor).toFixed(2)
        : (metrics.number_of_trades > 0 && metrics.total_return > 0) ? "N/A" : "0.00";

    const sharpeRatio = metrics.sharpe_ratio != null
        ? Number(metrics.sharpe_ratio).toFixed(2)
        : (metrics.number_of_trades > 0 && metrics.total_return > 0) ? "N/A" : "0.00";

    const metricItems = [
        { label: "Total Return PCT", value: `${Number(totalReturn).toFixed(2)}%` },
        { label: "Total Return ABS", value: `$${(metrics.total_return_abs ?? metrics.total_return ?? 0).toFixed(2)}` },
        { label: "Total B&H Return PCT", value: `${Number(bnhReturnPct).toFixed(2)}%` },
        { label: "Total B&H Return ABS", value: `$${Number(bnhReturnAbs).toFixed(2)}` },
        { label: "Excess Return", value: `${excessReturn > 0 ? '+' : ''}${Number(excessReturn).toFixed(2)}%` },
        { label: "Max Drawdown", value: `${Number(maxDrawdown).toFixed(2)}%` },
        { label: "Profit Factor", value: profitFactor },
        { label: "Sharpe Ratio", value: sharpeRatio },
        { label: "Win Rate", value: `${Number(winRate).toFixed(2)}%` },
        { label: "Avg Trade Return", value: `${Number(finalAvgTradeRet).toFixed(2)}%` },
        { label: "Average Win", value: `$${Number(finalAvgWin).toFixed(2)}` },
        { label: "Average Loss", value: `-$${Math.abs(finalAvgLoss).toFixed(2)}` },
        { label: "Time in Market", value: `${Number(metrics.market_exposure_percentage ?? 0).toFixed(1)}%` },
        { label: "Fee & Slippage Drag", value: `-$${Number(metrics.total_fees ?? 0).toFixed(2)}` }
    ];

    const exitReasons = [
        { label: "Rule Exits", value: metrics.exit_reasons?.rule_sell || 0 },
        { label: "Target Reversions", value: metrics.exit_reasons?.target || 0 },
        { label: "Stop Loss Hits", value: metrics.exit_reasons?.stop || 0 },
        { label: "Time Limit Exits", value: metrics.exit_reasons?.time || 0 },
        { label: "System Force Closes", value: metrics.exit_reasons?.force_close || 0 }
    ];

    return { metricItems, exitReasons };
}