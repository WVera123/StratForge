function StrategySummary({ result, currencies, principle }) {
  if (!result) {
    return (
      <div className="preview-summary-empty">
        Generate a preview to see the strategy details.
      </div>
    );
  }

  const crypto1 = currencies.find(
    (currency) => String(currency.id) === String(result.crypto1)
  );

  const crypto2 = currencies.find(
    (currency) => String(currency.id) === String(result.crypto2)
  );

  function formatNumber(value, digits = 4) {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return Number(value).toFixed(digits);
  }

  const isPairsTrading =
    result.principle === "pairs_trading" ||
    principle?.key === "pairs_trading";

  const useCorrelation = result.parameters?.use_correlation === true;
  const useCointegration = result.parameters?.use_cointegration === true;

  return (
    <div className="preview-summary-content">
      <div className="preview-summary-item">
        <span>Strategy</span>
        <strong>{principle?.title || principle?.name || result.principle}</strong>
      </div>

      <div className="preview-summary-item">
        <span>Timeframe</span>
        <strong>{result.timeframe || "-"}</strong>
      </div>

      <div className="preview-summary-item">
        <span>Cryptocurrencies</span>
        <strong>
          {crypto1?.symbol || result.crypto1}
          {isPairsTrading && ` / ${crypto2?.symbol || result.crypto2}`}
        </strong>
      </div>

      <div className="preview-summary-item">
        <span>Trades</span>
        <strong>{result.metrics?.number_of_trades ?? 0}</strong>
      </div>

      {isPairsTrading && (
        <div className="preview-summary-extra">
          <div className="preview-summary-item">
            <span>Hedge ratio</span>
            <strong>{formatNumber(result.metrics?.hedge_ratio)}</strong>
          </div>

          <div className="preview-summary-item">
            <span>Intercept</span>
            <strong>{formatNumber(result.metrics?.intercept)}</strong>
          </div>

          {useCorrelation && (
            <div className="preview-summary-item">
              <span>Rolling correlation</span>
              <strong>
                {formatNumber(result.metrics?.rolling_correlation)}
              </strong>
            </div>
          )}

          {useCointegration && (
            <div className="preview-summary-item">
              <span>Cointegration p-value</span>
              <strong>
                {formatNumber(result.metrics?.cointegration_pvalue)}
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StrategySummary;