import numpy as np
import pandas as pd

from indicators.indicator_service import IndicatorService
from .base_strategy import BaseStrategy


class PairsTradingStrategy(BaseStrategy):

    def run(
        self,
        df: pd.DataFrame,
        parameters
    ) -> tuple[pd.DataFrame, float, float]:
        df, hedge_ratio, intercept = IndicatorService.calculate_pairs_features(
            df, parameters
        )

        signals = np.full(len(df), "hold", dtype=object)

        # 1. Cointegration Guardrail
        cointegration_ok = True
        if getattr(parameters, "use_cointegration", False):
            pvalue = IndicatorService.calculate_cointegration_pvalue(df)
            p_threshold = getattr(parameters, "cointegration_pvalue_threshold", 0.05)
            cointegration_ok = np.isnan(pvalue) or (pvalue <= p_threshold)

        if not cointegration_ok or not getattr(parameters, "use_zscore", False):
            df["signal"] = signals
            return df, hedge_ratio, intercept

        # 2. Extract series for execution
        z_scores = df["z_score"].to_numpy()
        correlations = (
            df["rolling_correlation"].to_numpy()
            if getattr(parameters, "use_correlation", False)
            else None
        )

        use_corr = getattr(parameters, "use_correlation", False)
        corr_thresh = getattr(parameters, "correlation_threshold", 0.70)

        long_entry = getattr(parameters, "zscore_long_entry", -2.0)
        short_entry = getattr(parameters, "zscore_short_entry", 2.0)
        exit_val = abs(getattr(parameters, "zscore_exit", 0.0))

        use_zscore_stop_loss = getattr(parameters, "use_zscore_stop_loss", False)
        stop_val = abs(getattr(parameters, "zscore_stop_loss", 3.5))

        use_time_stop = getattr(parameters, "use_time_stop", False)
        max_bars = getattr(parameters, "time_stop_periods", 40)

        position = 0
        bars_held = 0

        # 3. Sequential State Machine Engine
        for i in range(len(df)):
            z = z_scores[i]
            if np.isnan(z):
                continue

            corr_ok = True
            if use_corr and correlations is not None:
                corr_val = correlations[i]
                corr_ok = not np.isnan(corr_val) and (corr_val >= corr_thresh)

            # In Long Spread position (Long A, Short B)
            if position == 1:
                bars_held += 1
                exit_signal = None

                # Convergence exit
                if z >= -exit_val:
                    exit_signal = "exit_target"
                # Extreme divergence Stop-Loss
                elif use_zscore_stop_loss and (z <= -stop_val):
                    exit_signal = "exit_stop_loss"
                # Stale trade Time Stop
                elif use_time_stop and (bars_held >= max_bars):
                    exit_signal = "exit_time"

                if exit_signal:
                    signals[i] = exit_signal
                    position = 0
                    bars_held = 0

            # In Short Spread position (Short A, Long B)
            elif position == -1:
                bars_held += 1
                exit_signal = None

                # Convergence exit
                if z <= exit_val:
                    exit_signal = "exit_target"
                # Extreme divergence Stop-Loss
                elif use_zscore_stop_loss and (z >= stop_val):
                    exit_signal = "exit_stop_loss"
                # Stale trade Time Stop
                elif use_time_stop and (bars_held >= max_bars):
                    exit_signal = "exit_time"

                if exit_signal:
                    signals[i] = exit_signal
                    position = 0
                    bars_held = 0

            # Currently Flat -> Look for Opportunities
            else:
                if corr_ok:
                    if z <= long_entry:
                        signals[i] = "long"
                        position = 1
                        bars_held = 0
                    elif z >= short_entry:
                        signals[i] = "short"
                        position = -1
                        bars_held = 0

        df["signal"] = signals
        return df, hedge_ratio, intercept