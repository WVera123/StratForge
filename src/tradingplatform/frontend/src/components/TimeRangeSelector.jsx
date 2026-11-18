function TimeRangeSelector({
  trainSplit,
  onSplitChange,
  datasetStartDate,
  onDatasetStartDateChange
}) {
  return (
    <div className="time-range-section">
      <div className="parameters-header">
        <h3>Data Range & Split</h3>

        <small>Configure dataset start and train/test split</small>
      </div>
      <div className="form-group">
        <label htmlFor="dataset-start-date">
          Dataset Start Date
        </label>
        <input
          id="dataset-start-date"
          type="date"
          value={datasetStartDate}
          onChange={(event) => onDatasetStartDateChange(event.target.value)}
        />
        <small>Ignore data before this date to avoid low-volume periods.</small>

        <label htmlFor="train-split-slider" style={{ marginTop: "10px", marginBottom: "0px" }}>
          Training Split (In-Sample): {trainSplit}%
        </label>

        <input
          id="train-split-slider"
          className="train-split-slider train-split-slider-purple"
          type="range"
          min="10"
          max="90"
          step="5"
          value={trainSplit}
          onChange={(event) => onSplitChange(Number(event.target.value))}
          style={{
            "--slider-progress": `${((trainSplit - 10) / 80) * 100}%`
          }}
        />

        <div className="data-split">
          <span>In-Sample: {trainSplit}%</span>
          <span>Out-of-Sample: {100 - trainSplit}%</span>
        </div>
      </div>
    </div>
  );
}

export default TimeRangeSelector;