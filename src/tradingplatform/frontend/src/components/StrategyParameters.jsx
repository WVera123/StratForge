
import { useState } from "react";
import FeatureLibraryModal, {
  FEATURES,
  DEFAULT_VALUES
} from "./FeatureLibraryModal";

export default function StrategyParameters({
  parameters = [],
  values = {},
  onChange,
  principle = "",
  principles = [],
  category = "features"
}) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Keep compatibility with the existing StrategyPage calls.
  // Both feature and exit rules are now managed by the same library.
  if (category === "advanced") return null;

  const selectedCount = Object.keys(FEATURES).filter(
    key => values[key] === true
  ).length;

  function isRuleBasedPrinciple(value) {
    return String(value ?? "")
      .toLowerCase()
      .replace(/[\s_-]+/g, "") === "rulebased";
  }

  const libraryPrinciples = principles.filter(item => {
    const key = typeof item === "string"
      ? item
      : (item?.key ?? item?.name ?? item?.title ?? "");
    const title = typeof item === "string" ? "" : (item?.title ?? "");

    return !isRuleBasedPrinciple(key) && !isRuleBasedPrinciple(title);
  });

  function handleApply({ selectedFeatures, parameterValues }) {
    // Update every known feature toggle.
    Object.keys(FEATURES).forEach(key => {
      onChange(key, selectedFeatures[key] === true);
    });

    // Apply all configured parameter values.
    // Unselected features retain their previous parameter values.
    Object.entries(parameterValues).forEach(([name, value]) => {
      if (value !== undefined && value !== values[name]) {
        onChange(name, value);
      }
    });

    // Ensure defaults exist for newly selected features.
    Object.entries(selectedFeatures).forEach(([key, enabled]) => {
      if (!enabled) return;

      FEATURES[key].params.forEach(name => {
        if (
          parameterValues[name] === undefined ||
          parameterValues[name] === ""
        ) {
          if (DEFAULT_VALUES[name] !== undefined) {
            onChange(name, DEFAULT_VALUES[name]);
          }
        }
      });
    });
  }

  return (
    <div className="strategy-feature-library">
      <div className="parameters-header">
        <h3>Feature library</h3>
        <small>
          Browse indicators, trading features and exit rules.
          Configure their parameters in one place.
        </small>

        <button
          type="button"
          className="button-purple feature-library-open-button"
          onClick={() => setIsLibraryOpen(true)}>Open feature library
        </button>
      </div>
      {selectedCount > 0 && (
        <div className="feature-library-selection-summary">
          <span className="feature-library-summary-dot" />
          {selectedCount} {selectedCount === 1 ? "feature" : "features"} selected
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
          >
            View selection
          </button>
        </div>
      )}

      <FeatureLibraryModal
        open={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onApply={handleApply}
        principles={libraryPrinciples}
        selectedPrinciple={principle}
        values={values}
        parameters={parameters}
      />
    </div>
  );
}