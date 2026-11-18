
import { useState } from "react";

const PRINCIPLE_DETAILS = {
  mean_reversion: {
    hypothesis: "Expects prices to revert toward a typical level.",
    approach:
      "Counter-trend approach; looks for reversals in range-bound markets."
  },
  trend_following: {
    hypothesis: "Expects established price movements to continue.",
    approach:
      "Directional approach; identifies and follows sustained upward or downward trends."
  },
  pairs_trading: {
    hypothesis:
      "Expects the price relationship between related assets to return to its historical equilibrium.",
    approach:
      "Relative-value approach; identifies temporary divergences between correlated assets."
  },
  rule_based: {
    hypothesis:
      "Expects specific market conditions to trigger predefined trading rules.",
    approach:
      "Systematic approach; executes trades based on the conditions configured in the rule builder."
  }
};

export default function PrincipleSelector({
  principles = [],
  value,
  onChange
}) {
  const [expandedPrinciples, setExpandedPrinciples] = useState([]);

  const availablePrinciples = principles.filter(
    (item) => PRINCIPLE_DETAILS[item.key]
  );

  // Select a principle without changing its expanded state.
  const handlePrincipleSelect = (key) => {
    onChange?.(key);
  };

  // Expand or collapse a principle without selecting it.
  const handlePrincipleExpand = (key) => {
    setExpandedPrinciples((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  return (
    <div className="form-group principle-selector-group">
      <label>Strategy Principle</label>

      <div className="principle-cards">
        {availablePrinciples.map((item) => {
          const selected = value === item.key;
          const expanded = expandedPrinciples.includes(item.key);
          const details = PRINCIPLE_DETAILS[item.key];

          return (
            <div
              key={item.key}
              className={`principle-card ${selected ? "selected" : ""} ${expanded ? "expanded" : ""
                }`}
            >
              <div className="principle-card-header">

                {/* Selecting the principle */}
                <button
                  type="button"
                  className={`principle-selection ${selected ? "is-selected" : ""
                    }`}
                  onClick={() => handlePrincipleSelect(item.key)}
                  aria-pressed={selected}
                >
                  <span className="principle-card-title">
                    {item.title}
                  </span>
                </button>

                {/* Expanding/collapsing without selecting */}
                <button
                  type="button"
                  className={`principle-expand-icon ${expanded ? "expanded" : ""
                    }`}
                  onClick={() => handlePrincipleExpand(item.key)}
                  aria-expanded={expanded}
                  aria-label={
                    expanded
                      ? `Collapse ${item.title} details`
                      : `Expand ${item.title} details`
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>

              {/* Hypothesis and Approach expand together */}
              {expanded && (
                <div className="principle-card-content">
                  <div className="principle-detail">
                    <span className="principle-detail-label">
                      Hypothesis
                    </span>
                    <p>{details.hypothesis}</p>
                  </div>

                  <div className="principle-detail">
                    <span className="principle-detail-label">
                      Approach
                    </span>
                    <p>{details.approach}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
