import React, { useState } from "react";

const docSections = [
  { id: "getting_started", title: "Getting Started", description: "Learn the basics of the StratForge platform." },
  { id: "strategy_lifecycle", title: "Strategy Lifecycle", description: "Understand how to build, test, and deploy." },
  { id: "sample_splitting", title: "Sample Splitting", description: "Learn about in-sample and out-of-sample data." }
];

const principleSections = [
  { id: "mean_reversion", title: "Mean Reversion", description: "Trading around historical price averages." },
  { id: "trend_following", title: "Trend Following", description: "Capturing sustained directional movements." },
  { id: "pairs_trading", title: "Pairs Trading", description: "Trading temporary deviations between assets." },
];

function WikiSection({ title, description, children }) {
  return (
    <section className="wiki-section">
      <div className="wiki-section-header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className="wiki-section-content">{children}</div>
    </section>
  );
}

function WikiFeature({ title, description, children }) {
  return (
    <article className="wiki-feature">
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      {children}
    </article>
  );
}

function WikiParameterList({ children }) {
  return <ul className="wiki-parameters">{children}</ul>;
}

function WikiPage() {
  const [activeSection, setActiveSection] = useState("getting_started");

  const allSections = [...docSections, ...principleSections];
  const activeSectionData = allSections.find(s => s.id === activeSection);

  return (
    <div className="wiki-page">
      <div className="wiki-header">
        <h1>Strategy Wiki</h1>
        <p>Learn how each trading principle works and understand the indicators, filters, and parameters used by the backtesting engine.</p>
      </div>

      <div className="wiki-layout">
        <aside className="wiki-sidebar">
          <div className="wiki-sidebar-header">
            <span>Documentation</span>
          </div>
          <nav className="wiki-nav">
            {docSections.map((section) => (
              <button
                key={section.id}
                className={`wiki-nav-item ${activeSection === section.id ? "active" : ""}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="wiki-nav-title">{section.title}</span>
              </button>
            ))}
          </nav>

          <div className="wiki-sidebar-header wiki-sidebar-header-mt">
            <span>Core Principles</span>
          </div>
          <nav className="wiki-nav">
            {principleSections.map((section) => (
              <button
                key={section.id}
                className={`wiki-nav-item ${activeSection === section.id ? "active" : ""}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="wiki-nav-title">{section.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="wiki-content">
          <div className="wiki-content-header">
            <h2>{activeSectionData?.title}</h2>
            <p>{activeSectionData?.description}</p>
          </div>


          {activeSection === "getting_started" && (
            <>
              <div className="wiki-introduction">
                <p>
                  StratForge is a platform for creating trading strategies and evaluating
                  their performance against historical cryptocurrency market data.
                  Configure a trading principle, select your market conditions, and run
                  a backtest to see how your strategy would have performed.
                </p>
              </div>

              <WikiSection title="Your First Backtest" description="Follow these steps to run your first strategy simulation.">
                <WikiFeature title="1. Choose a Trading Principle">
                  <p>
                    Select one of the available principles: Mean Reversion, Trend Following,
                    or Pairs Trading. Each principle provides a different approach to
                    identifying trading opportunities.
                  </p>
                </WikiFeature>

                <WikiFeature title="2. Configure Your Strategy">
                  <p>
                    Enable the indicators, filters, and exit conditions you want to use.
                    Adjust their parameters to define when the strategy should enter and
                    exit positions. Only enabled features are included in the strategy.
                  </p>
                </WikiFeature>

                <WikiFeature title="3. Configure the Backtest">
                  <WikiParameterList>
                    <li><strong>Asset</strong><span>Select the cryptocurrency or asset pair to test.</span></li>
                    <li><strong>Timeframe</strong><span>Choose the candle interval used by the strategy.</span></li>
                    <li><strong>Date Range</strong><span>Define the historical period to simulate.</span></li>
                    <li><strong>Starting Capital</strong><span>Set the initial capital used for the simulation.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="4. Run and Review">
                  <p>
                    Start the backtest to simulate your strategy over the selected
                    historical data. Once completed, review the performance metrics,
                    equity curve, and individual trades to understand the results.
                  </p>
                </WikiFeature>
              </WikiSection>

              <WikiSection title="Understanding the Results" description="The backtest provides several ways to evaluate performance.">
                <WikiParameterList>
                  <li><strong>Performance Metrics</strong><span>Summarize profitability and risk, including returns, drawdown, win rate, and profit factor.</span></li>
                  <li><strong>Equity Curve</strong><span>Shows how the strategy's account value changes throughout the backtest.</span></li>
                  <li><strong>Trade Log</strong><span>Provides details of individual trades, including entries, exits, and trade outcomes.</span></li>
                </WikiParameterList>
              </WikiSection>

              <div className="wiki-callout">
                <strong>Important</strong>
                <span>
                  A backtest evaluates a strategy using historical data. Positive
                  historical results do not guarantee future profitability.
                </span>
              </div>
            </>
          )}


          {activeSection === "strategy_lifecycle" && (
            <>
              <div className="wiki-introduction">
                <p>
                  Developing a trading strategy is an iterative process. A strategy
                  should be evaluated not only by its profitability, but also by its
                  consistency, risk exposure, and ability to perform under different
                  market conditions.
                </p>
              </div>

              <WikiSection title="The Development Cycle" description="A structured approach to developing and evaluating a trading strategy.">
                <WikiFeature title="1. Define the Strategy">
                  <p>
                    Start with a clear trading hypothesis. Decide what market behaviour
                    you want to capture and select the principle and indicators that
                    support that approach.
                  </p>
                </WikiFeature>

                <WikiFeature title="2. Configure and Inspect">
                  <p>
                    Enable the relevant features and adjust their parameters. Inspect
                    the strategy configuration to ensure that the selected conditions
                    represent the intended trading logic.
                  </p>
                </WikiFeature>

                <WikiFeature title="3. Evaluate Historical Performance">
                  <p>
                    Run a backtest using a defined asset, timeframe, date range, and
                    starting capital. Examine the results to identify strengths,
                    weaknesses, and periods of poor performance.
                  </p>
                </WikiFeature>

                <WikiFeature title="4. Refine the Strategy">
                  <p>
                    Use the results to identify potential improvements. Change parameters
                    or features deliberately, then run another backtest to determine
                    whether the change actually improves the strategy.
                  </p>
                </WikiFeature>

                <WikiFeature title="5. Validate the Results">
                  <p>
                    Evaluate the refined strategy on data that was not used during
                    development. This helps determine whether the observed performance
                    extends beyond the historical period used for experimentation.
                  </p>
                  <p className="wiki-note">
                    See Sample Splitting for an explanation of in-sample and
                    out-of-sample validation.
                  </p>
                </WikiFeature>
              </WikiSection>

              <WikiSection title="Evaluating a Strategy" description="Look beyond total return when deciding whether a strategy is effective.">
                <WikiFeature title="Profitability">
                  <p>
                    Total return and profit factor help assess how much the strategy
                    earns relative to its losses. A high return alone does not indicate
                    that a strategy is reliable.
                  </p>
                </WikiFeature>

                <WikiFeature title="Risk">
                  <p>
                    Maximum drawdown shows the largest decline from a previous equity
                    peak. It helps assess the losses and capital fluctuations a trader
                    would have experienced.
                  </p>
                </WikiFeature>

                <WikiFeature title="Consistency">
                  <p>
                    Examine the equity curve and trade log to understand when and how
                    the strategy generates its results. Check whether performance is
                    concentrated in a small number of trades or specific market periods.
                  </p>
                </WikiFeature>
              </WikiSection>

              <div className="wiki-callout">
                <strong>Reproducibility</strong>
                <span>
                  When comparing backtests, keep track of the strategy configuration,
                  asset, timeframe, date range, and starting capital. Change one aspect
                  at a time where possible, so you can identify what caused a difference
                  in performance.
                </span>
              </div>
            </>
          )}


          {activeSection === "sample_splitting" && (
            <>
              <div className="wiki-introduction">
                <p>
                  Sample splitting separates historical market data into two distinct
                  periods: In-Sample data for strategy development and
                  Out-of-Sample data for validation. This helps identify
                  overfitting and provides a more realistic indication of how a
                  strategy may perform on previously unseen data.
                </p>
              </div>

              <WikiSection title="Why Split Historical Data?" description="Understanding overfitting and the purpose of validation.">
                <WikiFeature title="The Problem: Overfitting">
                  <p>
                    Overfitting occurs when a strategy is too closely tailored to a
                    particular historical dataset. Its parameters may produce excellent
                    backtest results because they capture historical noise rather than
                    repeatable market behaviour.
                  </p>
                </WikiFeature>

                <WikiFeature title="The Solution: Unseen Data">
                  <p>
                    By reserving part of the historical data for testing, you can
                    evaluate the strategy on a period that was not used to select
                    its indicators or optimize its parameters.
                  </p>
                </WikiFeature>
              </WikiSection>

              <WikiSection title="How the Split Works" description="Historical data should be divided chronologically, not randomly.">
                <div className="wiki-example">
                  <div className="wiki-split-labels">
                    <span>Historical Data</span>
                    <span>Example: 70% / 30%</span>
                  </div>
                  <div className="wiki-split-bar">
                    <div className="wiki-split-training">
                      <strong>In-Sample</strong>
                      <span>70%</span>
                    </div>
                    <div className="wiki-split-testing">
                      <strong>Out-of-Sample</strong>
                      <span>30%</span>
                    </div>
                  </div>
                  <p className="wiki-note">
                    Earlier observations are used for development; later observations
                    are reserved for validation.
                  </p>
                </div>

                <WikiFeature title="In-Sample">
                  <p>
                    The portion of historical data used to develop the strategy and
                    select its parameters. You can experiment with different indicators
                    and configurations during this phase.
                  </p>
                </WikiFeature>

                <WikiFeature title="Out-of-Sample">
                  <p>
                    The reserved portion of historical data used to evaluate the
                    selected strategy. Its results provide an indication of whether
                    the strategy can perform beyond the data used during development.
                  </p>
                </WikiFeature>
              </WikiSection>

              <WikiSection title="Choosing a Split Ratio" description="The appropriate ratio depends on the amount of available historical data and the purpose of the test.">
                <div className="wiki-table-wrapper">
                  <table className="wiki-table">
                    <thead>
                      <tr>
                        <th>In-Sample</th>
                        <th>Out-of-Sample</th>
                        <th>Consideration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>70%</td>
                        <td>30%</td>
                        <td>Balanced allocation between development and validation.</td>
                      </tr>
                      <tr>
                        <td>80%</td>
                        <td>20%</td>
                        <td>More data available for strategy development.</td>
                      </tr>
                      <tr>
                        <td>60%</td>
                        <td>40%</td>
                        <td>Larger validation period, with less data for development.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="wiki-note">
                  These are illustrative ratios, not universal rules. The split should
                  leave enough data in both periods to produce meaningful results.
                </p>
              </WikiSection>

              <WikiSection title="Interpreting the Results" description="Compare the two periods to assess how well the strategy generalizes.">
                <WikiFeature title="Consistent Performance">
                  <p>
                    Similar performance across both periods can indicate that the
                    strategy is less dependent on the specific data used during
                    development.
                  </p>
                </WikiFeature>

                <WikiFeature title="Weaker Out-of-Sample Performance">
                  <p>
                    A significant decline in profitability or increase in drawdown
                    may indicate overfitting, changing market conditions, or a strategy
                    that is not robust.
                  </p>
                </WikiFeature>

                <WikiFeature title="Repeated Optimization">
                  <p>
                    Avoid repeatedly adjusting parameters based on out-of-sample
                    results. Once you use that data to make development decisions,
                    it is no longer a truly unseen validation period.
                  </p>
                </WikiFeature>
              </WikiSection>

              <div className="wiki-callout">
                <strong>Important</strong>
                <span>
                  Out-of-sample performance is not a guarantee of future results.
                  It is a validation method, not proof that a strategy will remain
                  profitable in live markets.
                </span>
              </div>
            </>
          )}


          {activeSection === "mean_reversion" && (
            <>
              <div className="wiki-introduction">
                <p><strong>Mean Reversion</strong> strategies operate on the assumption that an asset's price tends to return toward its historical average over time. These strategies attempt to capitalize on unusually large deviations by buying when an asset appears relatively cheap and selling when it appears relatively expensive.</p>
              </div>

              <WikiSection title="Entry Signals" description="Indicators used to identify potential deviations from the mean.">
                <div className="wiki-callout">
                  <strong>Multiple entry signals</strong>
                  <span>When multiple entry signals are enabled, the strategy can enter when any valid entry condition is triggered.</span>
                </div>

                <WikiFeature title="Bollinger Bands" description="Generates signals when price moves outside a statistical volatility band, anticipating a possible move back toward the centerline.">
                  <WikiParameterList>
                    <li><strong>Bollinger Period</strong><span>The lookback period used to calculate the Simple Moving Average centerline.</span></li>
                    <li><strong>Bollinger Multiplier</strong><span>The number of standard deviations used to construct the upper and lower bands.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="RSI (Relative Strength Index)" description="A momentum oscillator measuring the speed and magnitude of recent price movements on a scale from 0 to 100.">
                  <WikiParameterList>
                    <li><strong>RSI Period</strong><span>The lookback period used to calculate average gains and losses.</span></li>
                    <li><strong>RSI Oversold</strong><span>The lower threshold below which the asset is considered oversold (Long entry condition).</span></li>
                    <li><strong>RSI Overbought</strong><span>The upper threshold above which the asset is considered overbought (Short entry condition).</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Z-Score" description="Measures how many standard deviations the current price is from its historical mean.">
                  <WikiParameterList>
                    <li><strong>Z-Score Period</strong><span>The rolling window used to calculate the mean and standard deviation.</span></li>
                    <li><strong>Z-Score Long Entry</strong><span>The negative threshold that triggers a long signal when price is unusually low.</span></li>
                    <li><strong>Z-Score Short Entry</strong><span>The positive threshold that triggers a short signal when price is unusually high.</span></li>
                    <li><strong>Z-Score Exit</strong><span>The target Z-Score used to close the position as price returns toward the mean.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="VWAP" description="Uses Volume Weighted Average Price as a reference level. Large deviations from VWAP can indicate a potential reversion opportunity.">
                  <p className="wiki-note">VWAP does not require additional parameters and is anchored automatically based on the selected timeframe (e.g. Daily reset).</p>
                </WikiFeature>
              </WikiSection>

              <WikiSection title="Filters & Exits" description="Additional controls that restrict entries or close positions.">
                <WikiFeature title="Trend Filter" description="Prevents mean-reversion trades from being taken against a strong broader trend.">
                  <WikiParameterList>
                    <li><strong>Trend Filter Period</strong><span>The lookback period used to calculate the macro moving average.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Time Stop" description="Limits the amount of time a position can remain open to prevent capital lockup in stale trades.">
                  <WikiParameterList>
                    <li><strong>Time Stop Periods</strong><span>The maximum number of candles a position can remain open before being closed automatically.</span></li>
                  </WikiParameterList>
                </WikiFeature>
              </WikiSection>
            </>
          )}

          {activeSection === "trend_following" && (
            <>
              <div className="wiki-introduction">
                <p><strong>Trend Following</strong> strategies attempt to capture large, sustained directional price movements. Instead of predicting market tops and bottoms, these strategies wait for evidence that a trend has formed and attempt to remain in the position while that trend continues.</p>
              </div>

              <WikiSection title="Entry Signals" description="Breakouts and moving-average systems used to identify emerging trends.">
                <div className="wiki-callout">
                  <strong>Multiple entry signals</strong>
                  <span>When multiple entry signals are enabled, the strategy can enter when any valid entry condition is triggered.</span>
                </div>

                <WikiFeature title="Dual Moving Average" description="Enters when a faster moving average crosses a slower moving average, signaling a shift in momentum.">
                  <WikiParameterList>
                    <li><strong>Short MA Period</strong><span>The fast-reacting lookback window.</span></li>
                    <li><strong>Long MA Period</strong><span>The slower benchmark moving average.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Moving Average Exit" description="Uses a moving average as an independent exit condition to lock in profits when a trend bends.">
                  <WikiParameterList>
                    <li><strong>MA Exit Period</strong><span>Closes a position when price crosses back through this selected moving average.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Triple Moving Average" description="Requires three moving averages to align in the same directional order before confirming a trend (Fast > Medium > Slow for Longs).">
                  <WikiParameterList>
                    <li><strong>Triple MA Fast / Medium / Slow</strong><span>The three respective lookback windows used to determine trend alignment.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Donchian Trend Breakout" description="Enters when price breaks the highest high or lowest low of the selected historical lookback period.">
                  <WikiParameterList>
                    <li><strong>Donchian Period</strong><span>The number of periods used to determine the highest high and lowest low breakout levels.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Bollinger Channel Breakout" description="Uses standard deviation rather than absolute price to determine volatility-adjusted breakout levels.">
                  <WikiParameterList>
                    <li><strong>Bollinger Period</strong><span>Lookback period for the centerline and standard deviation calculation.</span></li>
                    <li><strong>Bollinger Multiplier</strong><span>Number of standard deviations used to set the breakout boundary threshold.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="ATR Channel Breakout" description="Creates a volatility-adjusted channel around a moving average and uses channel breaks as directional signals.">
                  <WikiParameterList>
                    <li><strong>ATR Period</strong><span>The window used to calculate Average True Range.</span></li>
                    <li><strong>ATR MA Period</strong><span>The moving-average window used as the centerline.</span></li>
                    <li><strong>ATR Multiplier Upper / Lower</strong><span>Determines how far the upper and lower channel bands are placed from the centerline.</span></li>
                  </WikiParameterList>
                </WikiFeature>
              </WikiSection>

              <WikiSection title="Confirmation Filters & Exits" description="Additional conditions used to confirm trends and manage positions.">
                <WikiFeature title="MACD Filter" description="Confirms that momentum agrees with the direction of the trend using the Moving Average Convergence Divergence indicator.">
                  <WikiParameterList>
                    <li><strong>MACD Fast / Slow / Signal</strong><span>The Exponential Moving Average periods used to calculate the MACD histogram and signal lines.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="ADX Filter" description="Measures trend strength and can filter out weak or sideways market conditions.">
                  <WikiParameterList>
                    <li><strong>ADX Period</strong><span>The lookback period for the Average Directional Index.</span></li>
                    <li><strong>ADX Threshold</strong><span>The minimum ADX value required for a directional trade to be allowed.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Macro Trend Filter" description="Restricts positions based on the direction of a longer-term moving average.">
                  <WikiParameterList>
                    <li><strong>Trend Filter Period</strong><span>The lookback period used for the macro moving average.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Time Exit / Stop" description="Closes an open position after a predefined number of candles.">
                  <WikiParameterList>
                    <li><strong>Time Stop Periods</strong><span>The maximum number of candles a position can remain open.</span></li>
                  </WikiParameterList>
                </WikiFeature>
              </WikiSection>
            </>
          )}

          {activeSection === "pairs_trading" && (
            <>
              <div className="wiki-introduction">
                <p><strong>Pairs Trading</strong>, also known as statistical arbitrage, involves trading two related assets when their historical price relationship temporarily deviates. The engine uses natural logarithm prices and Ordinary Least Squares (OLS) regression to calculate the Hedge Ratio and ensure scale-invariance across different cryptocurrencies.</p>
              </div>

              <WikiSection title="Spread & Signals" description="The core calculations used to identify deviations between the two assets.">
                <WikiFeature title="Spread Z-Score" description="Measures how far the current log-price spread is from its historical mean in standard-deviation units.">
                  <WikiParameterList>
                    <li><strong>Z-Score Period</strong><span>The rolling window used to calculate the spread mean and standard deviation.</span></li>
                    <li><strong>Z-Score Long Entry</strong><span>Negative threshold indicating that the spread has moved unusually low.</span></li>
                    <li><strong>Z-Score Short Entry</strong><span>Positive threshold indicating that the spread has moved unusually high.</span></li>
                    <li><strong>Z-Score Exit</strong><span>Target level used to close both legs as the spread normalizes (Target Reversion).</span></li>
                  </WikiParameterList>
                </WikiFeature>
              </WikiSection>

              <WikiSection title="Risk Management & Exits" description="Safeguards against structural divergence and capital lockup.">
                <WikiFeature title="Z-Score Stop Loss" description="Force-exits positions if the spread diverges beyond an extreme maximum threshold, protecting against broken correlations.">
                  <WikiParameterList>
                    <li><strong>Z-Score Stop Loss</strong><span>Absolute Z-Score limit. If the spread exceeds this threshold, the system logs a 'Stop Loss Hit' and exits.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Time Stop" description="Limits the amount of time a pairs position can remain open, freeing up margin if the pair fails to converge quickly.">
                  <WikiParameterList>
                    <li><strong>Time Stop Periods</strong><span>The maximum number of bars the strategy will hold the open legs before triggering a 'Time Limit Exit'.</span></li>
                  </WikiParameterList>
                </WikiFeature>
              </WikiSection>

              <WikiSection title="Statistical Filters" description="Conditions used to determine whether the pair is historically suitable for mean-reversion trading.">
                <WikiFeature title="Correlation Filter" description="Checks whether the two assets generally move in the same direction before allowing an entry.">
                  <WikiParameterList>
                    <li><strong>Correlation Period</strong><span>Lookback window used to calculate the rolling Pearson correlation coefficient.</span></li>
                    <li><strong>Correlation Threshold</strong><span>Minimum correlation required before trades are allowed.</span></li>
                  </WikiParameterList>
                </WikiFeature>

                <WikiFeature title="Cointegration Filter" description="Tests whether the long-term spread between the two assets is statistically stationary using the ADF test.">
                  <WikiParameterList>
                    <li><strong>Cointegration p-value Threshold</strong><span>Maximum p-value accepted from the Augmented Dickey-Fuller test (typically 0.05).</span></li>
                  </WikiParameterList>
                </WikiFeature>
              </WikiSection>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default WikiPage;