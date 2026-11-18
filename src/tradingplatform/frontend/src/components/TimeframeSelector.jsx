function TimeframeSelector({
  value,
  onChange
}) {

  return (
    <div className="timeframe-section">
      <div className="form-group">

        <label htmlFor="timeframe">
          Candle Timeframe
        </label>

        <select
          id="timeframe"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option value="" disabled>
            Select timeframe
          </option>

          <option value="1m">
            1 minute
          </option>

          <option value="1h">
            1 hour
          </option>

          <option value="1d">
            1 day
          </option>

        </select>

      </div>
    </div>
  );
}


export default TimeframeSelector;