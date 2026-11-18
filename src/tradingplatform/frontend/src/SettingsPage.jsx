import { useEffect, useState } from "react";

function SettingsPage({ settings, onSaveSettings }) {
  const [formData, setFormData] = useState({
    initialCapital: settings.initialCapital ?? 10000,
    takerFee: settings.takerFee ?? 0,
    makerFee: settings.makerFee ?? 0,
    slippage: settings.slippage ?? 0,
    positionSizing: settings.positionSizing ?? "fixed",
    positionAllocation: settings.positionAllocation ?? 100
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      initialCapital: settings.initialCapital ?? 10000,
      takerFee: settings.takerFee ?? 0,
      makerFee: settings.makerFee ?? 0,
      slippage: settings.slippage ?? 0,
      positionSizing: settings.positionSizing ?? "fixed",
      positionAllocation: settings.positionAllocation ?? 100
    });
  }, [settings]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSaveSettings(formData);
    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = async () => {
    const defaults = {
      initialCapital: 10000,
      takerFee: 0,
      makerFee: 0,
      slippage: 0,
      positionSizing: "fixed",
      positionAllocation: 100
    };
    setFormData(defaults);
    await onSaveSettings(defaults);
    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="settings-page">
      <header className="settings-page-header">
        <h1>Platform Settings</h1>
        <p>Configure your global preferences and trading execution environment.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Backtest Environment</h2>
          </div>
          <div className="settings-grid">
            <div className="form-group">
              <p className="settings-eyebrow">Execution Fees</p>
              <label htmlFor="makerFee">Exchange Maker Fee (%)</label>
              <input id="makerFee" name="makerFee" type="number" step="0.001" min="0" value={formData.makerFee} onChange={handleChange} required />
            
              <label htmlFor="takerFee" style={{marginTop: '9px'}}>Exchange Taker Fee (%)</label>
              <input id="takerFee" name="takerFee" type="number" step="0.001" min="0" value={formData.takerFee} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <p className="settings-eyebrow">Slippage Control</p>
              <label htmlFor="slippage">Global Slippage Buffer (%)</label>
              <input id="slippage" name="slippage" type="number" step="0.001" min="0" value={formData.slippage} onChange={handleChange} required />
              <small>This buffer is automatically applied to every simulated order to account for order book depth and latency.</small>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Capital &amp; Position Sizing</h2>
          </div>
          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="initialCapital">Starting Capital ($)</label>
              <input id="initialCapital" name="initialCapital" type="number" step="100" min="100" value={formData.initialCapital} onChange={handleChange} required />
              <small>Initial portfolio balance for backtesting and preview calculations.</small>
            </div>
            <div className="form-group">
              <label htmlFor="positionSizing">Default Sizing Method</label>
              <select id="positionSizing" name="positionSizing" value={formData.positionSizing} onChange={handleChange}>
                <option value="fixed">Fixed</option>
                <option value="compounding">Compounding</option>
              </select>
              {formData.positionSizing === "compounding" && <small>Compounding will automatically reinvest profits back into the strategy, potentially increasing returns over time.</small>}
              {formData.positionSizing === "fixed" && <small>Fixed sizing will allocate a consistent amount of capital per trade, regardless of portfolio growth.</small>}
              <small>Can also be changed for an individual backtest run.</small>
            </div>
            <div className="form-group">
              <label htmlFor="positionAllocation">Position Allocation (%)</label>
              <input id="positionAllocation" name="positionAllocation" type="number" step="1" min="0" max="100" value={formData.positionAllocation} placeholder="e.g. 100" onChange={handleChange} required />
              <small>Percentage of capital or equity allocated per trade.</small>
            </div>
          </div>
        </section>

        <section className="settings-security-card">
          <h2>API Access &amp; Security</h2>
          <p>API keys are required for live data feeds and automated execution. Keys should be encrypted at rest and never transmitted in plain text.</p>
        </section>

        <div className="settings-actions">
          <button type="submit" className="button">Save Changes</button>
          <button type="button" className="button button-outline" onClick={handleReset}>Reset to Defaults</button>
          {savedSuccess && <span className="preview-status success-status">Settings saved successfully</span>}
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;