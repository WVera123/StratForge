import { useState, useMemo, useEffect } from "react";

function TradeLogTable({ trades, title, isPairs, symA, symB, onTradeClick, selectedTrade }) {
    const [filter, setFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);

    const [hoveredRow, setHoveredRow] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [trades, filter, sortConfig]);

    if (!trades || trades.length === 0) {
        return <p className="empty-trades-message">No trades executed in {title}.</p>;
    }

    const formatExitReason = (reason) => {
        const mapping = { target: "Target Reversion", stop: "Stop Loss Hit", time: "Time Limit Reached", force_close: "System Force Close" };
        return mapping[reason] || reason;
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    const getSortClass = (key) => {
        if (sortConfig.key !== key || !sortConfig.direction) return "sortable-header";
        return sortConfig.direction === 'asc' ? "sortable-header sort-asc" : "sortable-header sort-desc";
    };

    const processedTrades = useMemo(() => {
        let filtered = trades.filter((t) => {
            if (filter === "buy") return t.action === "buy";
            if (filter === "sell") return t.action === "sell";
            if (filter === "exit") return t.action === "sell" || t.action === "exit";
            if (filter === "win") return Number(t.pnl || 0) > 0;
            if (filter === "loss") return Number(t.pnl || 0) < 0;
            return true;
        });

        if (sortConfig.key && sortConfig.direction) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'timestamp') {
                    aValue = new Date(a.timestamp).getTime();
                    bValue = new Date(b.timestamp).getTime();
                } else if (['price', 'quantity', 'quantity_b', 'fees', 'pnl', 'equity_after'].includes(sortConfig.key)) {
                    aValue = Number(aValue || 0);
                    bValue = Number(bValue || 0);
                } else {
                    aValue = String(aValue || '').toLowerCase();
                    bValue = String(bValue || '').toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [trades, filter, sortConfig]);

    const totalPages = Math.ceil(processedTrades.length / itemsPerPage);
    const currentTrades = processedTrades.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

    return (
        <div className="trade-log-card">
            <div className="trade-log-header-row">
                <h4>{title}</h4>
                <select className="trade-log-filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Trades</option>
                    <option value="buy">Buy Orders</option>
                    <option value="sell">Sell Orders</option>
                    <option value="exit">All Exits</option>
                    <option value="win">Winning Trades</option>
                    <option value="loss">Losing Trades</option>
                </select>
            </div>

            <div className="trade-log-table-container">
                {processedTrades.length === 0 ? (
                    <p className="empty-trades-message trade-log-empty-filtered">No trades match the selected filter.</p>
                ) : (
                    <>
                        <table className="trade-log-table">
                            <thead><tr>
                                <th className={`nowrap ${getSortClass('timestamp')}`} onClick={() => handleSort('timestamp')}>Date</th>
                                <th className={getSortClass('action')} onClick={() => handleSort('action')}>Action</th>
                                {isPairs ? (
                                    <>
                                        <th className={getSortClass('quantity')} onClick={() => handleSort('quantity')}>{symA} Holdings</th>
                                        <th className={getSortClass('quantity_b')} onClick={() => handleSort('quantity_b')}>{symB} Holdings</th>
                                    </>
                                ) : (
                                    <>
                                        <th className={getSortClass('price')} onClick={() => handleSort('price')}>Price</th>
                                        <th className={getSortClass('quantity')} onClick={() => handleSort('quantity')}>Holdings</th>
                                    </>
                                )}
                                <th className={getSortClass('fees')} onClick={() => handleSort('fees')}>Fees & Slip.</th>
                                <th className={getSortClass('pnl')} onClick={() => handleSort('pnl')}>PnL</th>
                                <th className={getSortClass('equity_after')} onClick={() => handleSort('equity_after')}>Equity After</th>
                                <th className={getSortClass('position_percentage')} onClick={() => handleSort('position_percentage')}>Current Position</th>
                            </tr></thead>
                            <tbody>
                                {currentTrades.map((t, idx) => {
                                    const isExit = t.action === 'sell' || t.action === 'exit';
                                    const rowActionClass = t.action === "buy" ? "buy" : t.action === "sell" ? "sell" : t.action === "long" ? "long" : t.action === "short" ? "short" : "exit";
                                    const pnlClass = t.pnl > 0 ? 'positive' : t.pnl < 0 ? 'negative' : '';
                                    const qtyAClass = Number(t.quantity) > 0 ? "positive" : Number(t.quantity) < 0 ? "negative" : "";
                                    const qtyBClass = Number(t.quantity_b) > 0 ? "positive" : Number(t.quantity_b) < 0 ? "negative" : "";
                                    return (
                                        <tr
                                            key={idx}
                                            className={`trade-row-${rowActionClass} ${selectedTrade === t ? 'selected-trade-row' : ''}`}
                                            onClick={() => onTradeClick && onTradeClick(t)}
                                            onMouseEnter={() => setHoveredRow(idx)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        >
                                            <td className="nowrap ">{new Date(t.timestamp).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                            <td className={`trade-action ${rowActionClass}`}>
                                                {t.action.toUpperCase()}
                                                {t.exit_reason && <small className="trade-log-reason">{formatExitReason(t.exit_reason)}</small>}
                                            </td>
                                            {isPairs ? (
                                                <>
                                                    <td><strong className={`trade-pnl ${qtyAClass}`}>{Number(t.quantity || 0) > 0 ? '+' : ''}{Number(t.quantity || 0).toFixed(4)}</strong> {symA}<small className="trade-log-meta">@ ${Number(t.price || 0).toFixed(4)}</small></td>
                                                    <td><strong className={`trade-pnl ${qtyBClass}`}>{Number(t.quantity_b || 0) > 0 ? '+' : ''}{Number(t.quantity_b || 0).toFixed(4)}</strong> {symB}<small className="trade-log-meta">@ ${Number(t.price_b || 0).toFixed(4)}</small></td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>${Number(t.price || 0).toFixed(4)}</td>
                                                    <td><strong className={`trade-pnl ${qtyAClass}`}>{Number(t.quantity || 0) > 0 ? '+' : ''}{Number(t.quantity || 0).toFixed(4)}</strong></td>
                                                </>
                                            )}
                                            <td>${Number(t.fees || 0).toFixed(2)}</td>
                                            <td className={`trade-pnl ${pnlClass}`}>{isExit ? `$${Number(t.pnl || 0).toFixed(2)}` : "-"}</td>
                                            <td>${Number(t.equity_after || 0).toFixed(2)}</td>
                                            <td>{t.position_percentage !== undefined && t.position_percentage > 0 ? (<span>{Number(t.position_percentage).toFixed(1)}%</span>) : (<span>0.0%</span>)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <div>
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, processedTrades.length)} of {processedTrades.length} trades
                                </div>
                                <div className="pagination-controls">
                                    <button
                                        className="button button-outline btn-small"
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    <span className="pagination-text">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="button button-outline btn-small"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default TradeLogTable;