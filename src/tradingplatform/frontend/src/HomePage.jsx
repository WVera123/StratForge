
import { useEffect, useState } from "react";

function ArrowRightIcon() {
  return (
    <svg className="home-button-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="home-button-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function getStrategyTitle(strategy) {
  return strategy.title || strategy.name || `Strategy ${strategy.id}`;
}

function getCurrency(strategy) {
  return (
    strategy.symbol ||
    strategy.crypto_symbol ||
    strategy.pair ||
    strategy.currency ||
    (strategy.base_asset && strategy.quote_asset
      ? `${strategy.base_asset}/${strategy.quote_asset}`
      : null) ||
    "Not specified"
  );
}

function getEnabledFeatures(strategy) {
  const features =
    strategy.enabled_features ||
    strategy.enabledFeatures ||
    strategy.features ||
    strategy.parameters ||
    [];

  if (Array.isArray(features)) {
    return features
      .map((feature) => {
        if (typeof feature === "string") return feature;

        return (
          feature.label ||
          feature.title ||
          feature.name ||
          feature.key
        );
      })
      .filter(Boolean);
  }

  if (features && typeof features === "object") {
    return Object.entries(features)
      .filter(([, value]) => {
        if (typeof value === "boolean") return value;
        return value?.enabled === true;
      })
      .map(([key]) => key);
  }

  return [];
}

function getHistoricalWindow(strategy) {
  const start =
    strategy.start_date ||
    strategy.startDate ||
    strategy.historical_start ||
    strategy.dataset_start_date;

  const end =
    strategy.end_date ||
    strategy.endDate ||
    strategy.historical_end ||
    strategy.dataset_end_date;

  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;

  return "Not specified";
}

function getCurrencyLabel(currency) {
  if (!currency) return null;

  if (typeof currency === "string") return currency;

  if (currency.symbol) return currency.symbol;

  if (currency.base_asset && currency.quote_asset) {
    return `${currency.base_asset}/${currency.quote_asset}`;
  }

  return currency.base_asset || currency.quote_asset || null;
}

function getStrategyCurrency(strategy, currencies = []) {
  const embeddedCurrency =
    strategy.currency ||
    strategy.instrument ||
    strategy.crypto;

  const embeddedLabel = getCurrencyLabel(embeddedCurrency);

  if (embeddedLabel) return embeddedLabel;

  const currencyMap = new Map(
    currencies.map((currency) => [
      String(currency.id),
      getCurrencyLabel(currency)
    ])
  );

  const crypto1Id = strategy.crypto1 ?? strategy.crypto1_id;
  const crypto2Id = strategy.crypto2 ?? strategy.crypto2_id;

  const crypto1 =
    crypto1Id != null ? currencyMap.get(String(crypto1Id)) : null;

  const crypto2 =
    crypto2Id != null ? currencyMap.get(String(crypto2Id)) : null;

  if (crypto1 && crypto2) return `${crypto1} / ${crypto2}`;
  if (crypto1) return crypto1;
  if (crypto2) return crypto2;

  return (
    strategy.symbol ||
    strategy.crypto_symbol ||
    strategy.pair ||
    strategy.currency_symbol ||
    "Not specified"
  );
}

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m16.5 3.5 4 4L8 20l-5 1 1-5L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BacktestIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 19V5M3 19h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="m6 15 4-4 3 2 6-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6h3v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyStrategyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m12 3 9 5-9 5-9-5 9-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m3 12 9 5 9-5M3 16l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomePage({
  BASE_URL,
  strategies = [],
  currencies: suppliedCurrencies,
  strategiesLoading = false,
  strategiesError = "",
  onCreateStrategy,
  onEditExisting,
  onBacktestStrategy,
  onEditStrategy,
  onRunBacktest,
  onOpenWiki
}) {
  const [expandedStep, setExpandedStep] = useState(null);
  const [loadedCurrencies, setLoadedCurrencies] = useState([]);

  const currencies =
    suppliedCurrencies?.length > 0
      ? suppliedCurrencies
      : loadedCurrencies;

  // Load currencies when they are not supplied by the parent.
  useEffect(() => {
    if (!BASE_URL || suppliedCurrencies?.length > 0) return;

    let cancelled = false;

    async function loadCurrencies() {
      try {
        const response = await fetch(`${BASE_URL}/currencies`);

        if (!response.ok) {
          throw new Error("Could not load currencies.");
        }

        const body = await response.json();

        const currencyList = Array.isArray(body)
          ? body
          : body?.items || body?.currencies || [];

        if (!cancelled) {
          setLoadedCurrencies(currencyList);
        }
      } catch (error) {
        console.error("Could not load currencies:", error);
      }
    }

    loadCurrencies();

    return () => {
      cancelled = true;
    };
  }, [BASE_URL, suppliedCurrencies]);

  const workflowSteps = [
    {
      number: "01",
      title: "Create & configure",
      description: "Choose your principle, asset and indicators.",
      detail:
        "Define the strategy principle first, then select the features and parameters that belong to it."
    },
    {
      number: "02",
      title: "Preview signals",
      description: "Inspect price overlays and entry signals.",
      detail:
        "Review how your strategy behaves on historical price data before running a full backtest."
    },
    {
      number: "03",
      title: "Run backtest",
      description: "Test performance on historical data.",
      detail:
        "Evaluate historical results using your selected market, timeframe and trading settings."
    },
    {
      number: "04",
      title: "Review & refine",
      description: "Review risk, adjust parameters and rerun.",
      detail:
        "Inspect performance and risk metrics, refine your logic and run the workflow again."
    }
  ];

  function openWorkflowStep(step) {
    if (step === "learn") {
      onOpenWiki?.();
      return;
    }

    onCreateStrategy?.();
  }

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-copy">
          <h1>
            Build, test, and refine.
            <br />
            With precision.
          </h1>

          <p className="home-hero-description">
            StratForge is your workspace to build cryptocurrency trading
            strategies, test them on historical data, and refine the logic
            behind every decision.
          </p>

          <div className="home-hero-actions">
            <button
              className="home-button home-button-primary"
              onClick={onCreateStrategy}
            >
              Configure a strategy <ArrowRightIcon />
            </button>

            <button className="home-button" onClick={onOpenWiki}>
              Learn the workflow <BookIcon />
            </button>
          </div>

          <p className="home-hero-note">
            Research with historical data. No live trading or execution.
          </p>
        </div>

        <aside className="workflow-overview">
          <p className="workflow-overview-label">
            One connected workspace
          </p>

          <h2>
            From an idea to
            <br />
            an informed decision.
          </h2>

          <div className="workflow-overview-list">
            {workflowSteps.map((step, index) => (
              <div key={step.number}>
                <button
                  className="workflow-overview-step"
                  aria-expanded={expandedStep === index}
                  onClick={() =>
                    setExpandedStep(
                      expandedStep === index ? null : index
                    )
                  }
                >
                  <span className="workflow-overview-number">
                    {step.number}
                  </span>

                  <span className="workflow-overview-name">
                    {step.title}
                  </span>

                  <svg
                    className="workflow-overview-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="m7 10 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {expandedStep === index && (
                  <p className="workflow-overview-detail">
                    {step.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* QUICK ACTIONS */}
      <section className="home-section">
        <div className="home-section-heading">
          <h2>What would you like to do?</h2>
          <p>Start fresh or continue your research</p>
        </div>

        <div className="home-action-grid">
          <button
            className="home-action-card"
            onClick={onCreateStrategy}
          >
            <span className="home-action-icon purple" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>

            <h3>Create New Strategy</h3>
            <p>
              Choose a principle, asset and indicators to define your strategy.
            </p>
            <span className="home-action-link">
              Create strategy <span aria-hidden="true">→</span>
            </span>
          </button>

          <button
            className="home-action-card"
            onClick={onEditExisting}
            disabled={!strategies.length}
          >
            <span className="home-action-icon pink" aria-hidden="true">
              <EditIcon />
            </span>

            <h3>Edit Existing</h3>
            <p>
              Load a saved strategy and refine its logic and parameters.
            </p>
            <span className="home-action-link">
              Edit strategy <span aria-hidden="true">→</span>
            </span>
          </button>

          <button
            className="home-action-card"
            onClick={onBacktestStrategy}
            disabled={!strategies.length}
          >
            <span className="home-action-icon teal" aria-hidden="true">
              <BacktestIcon />
            </span>

            <h3>Backtest Strategy</h3>
            <p>
              Evaluate historical performance and understand strategy risk.
            </p>
            <span className="home-action-link">
              Run backtest <span aria-hidden="true">→</span>
            </span>
          </button>

          <button
            className="home-action-card"
            onClick={onOpenWiki}
          >
            <span className="home-action-icon amber" aria-hidden="true">
              <BookIcon />
            </span>

            <h3>Wiki / learn the workflow</h3>
            <p>
              Learn the steps, indicators and metrics before you begin.
            </p>
            <span className="home-action-link">
              Open Wiki <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </section>

      {/* WORKFLOW STEPS */}
      <section className="home-step-grid" aria-label="Guided workflow steps">
        {workflowSteps.map((step, index) => (
          <button
            className="home-step-card"
            key={step.number}
            onClick={() =>
              openWorkflowStep(index === 0 ? "create" : "workflow")
            }
          >
            <span className="home-step-number">{step.number}</span>

            <span className="home-step-content">
              <strong>{step.title}</strong>
              <span>{step.description}</span>
            </span>
          </button>
        ))}
      </section>

      {/* SAVED STRATEGIES */}
      <section className="research-section">
        <div className="home-section-heading">
          <div>
            <h2>Your strategies</h2>
            <p>
              Manage your configured strategies and continue your research.
            </p>
          </div>
        </div>

        {strategiesLoading ? (
          <div className="research-empty-card">
            <p>Loading your saved strategies...</p>
          </div>
        ) : strategiesError ? (
          <div className="research-empty-card" role="alert">
            <div className="research-empty-copy">
              <div>
                <h3>Could not load strategies</h3>
                <p>{strategiesError}</p>
              </div>
            </div>

            <button
              className="research-empty-action"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : strategies.length === 0 ? (
          <div className="research-empty-card">
            <div className="research-empty-copy">
              <span className="research-empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="m12 3 9 5-9 5-9-5 9-5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m3 12 9 5 9-5M3 16l9 5 9-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span>
                <h3>No strategies created yet</h3>
                <p>
                  Create and configure your first strategy. Your saved strategies
                  will appear here so you can edit or backtest them.
                </p>
              </span>
            </div>

            <button
              className="research-empty-action"
              onClick={onCreateStrategy}
            >
              Create a strategy <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <div className="saved-strategies-list">
            {strategies.map((strategy) => {
              const features = getEnabledFeatures(strategy);

              return (
                <article className="saved-strategy-card" key={strategy.id}>
                  <div className="saved-strategy-header">
                    <div className="saved-strategy-title">
                      <h3 title={getStrategyTitle(strategy)}>
                        {getStrategyTitle(strategy)}
                      </h3>

                      <span className="saved-strategy-principle">
                        {(strategy.principle || "Strategy").replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="saved-strategy-details">
                    <div className="saved-strategy-detail">
                      <span>Currency</span>
                      <strong>
                        {getStrategyCurrency(strategy, currencies)}
                      </strong>
                    </div>

                    <div className="saved-strategy-detail">
                      <span>Timeframe</span>
                      <strong>
                        {strategy.timeframe || "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div className="saved-strategy-actions">
                    <button
                      type="button"
                      className="saved-strategy-edit"
                      onClick={() => onEditStrategy(strategy.id)}
                    >
                      Edit strategy
                    </button>

                    <button
                      type="button"
                      className="saved-strategy-backtest"
                      onClick={() => onRunBacktest(strategy.id)}
                    >
                      Backtest strategy
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;