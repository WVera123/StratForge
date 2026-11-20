import pandas as pd
import numpy as np

from indicators.indicator_service import IndicatorService
from .base_strategy import BaseStrategy


class MeanReversionStrategy(BaseStrategy):

    def run(
        self,
        df: pd.DataFrame,
        parameters
    ) -> pd.DataFrame:

        df = IndicatorService.calculate_mean_reversion_features(df, parameters)
        try:
            # Inject trend-following features if an advanced user requests them
            df = IndicatorService.calculate_trend_features(df, parameters)
        except Exception:
            pass

        use_trend_filter = getattr(parameters, "use_trend_filter", False)
        trend_period = getattr(parameters, "trend_filter_period", 200)
        
        if use_trend_filter and "trend_sma" not in df.columns:
            df["trend_sma"] = df["close"].rolling(window=trend_period).mean()

        raw_long_entry = pd.Series(True, index=df.index)
        raw_short_entry = pd.Series(True, index=df.index)
        
        raw_long_exit = pd.Series(False, index=df.index)
        raw_short_exit = pd.Series(False, index=df.index)

        conditions_enabled = False

        if getattr(parameters, "use_bollinger", False) and "bb_lower" in df.columns:
            conditions_enabled = True
            raw_long_entry &= ((df["close"].shift(1) >= df["bb_lower"].shift(1)) & (df["close"] < df["bb_lower"]))
            raw_short_entry &= ((df["close"].shift(1) <= df["bb_upper"].shift(1)) & (df["close"] > df["bb_upper"]))
            raw_long_exit |= (df["close"] >= df["bb_middle"])
            raw_short_exit |= (df["close"] <= df["bb_middle"])

        if getattr(parameters, "use_rsi", False) and "rsi" in df.columns:
            conditions_enabled = True
            raw_long_entry &= (df["rsi"] < getattr(parameters, "rsi_oversold", 30))
            raw_short_entry &= (df["rsi"] > getattr(parameters, "rsi_overbought", 70))
            raw_long_exit |= (df["rsi"] >= 50)
            raw_short_exit |= (df["rsi"] <= 50)

        if getattr(parameters, "use_zscore", False) and "z_score" in df.columns:
            conditions_enabled = True
            raw_long_entry &= (df["z_score"] <= getattr(parameters, "zscore_long_entry", -2.0))
            raw_short_entry &= (df["z_score"] >= getattr(parameters, "zscore_short_entry", 2.0))
            raw_long_exit |= (df["z_score"] >= getattr(parameters, "zscore_exit", 0.0))
            raw_short_exit |= (df["z_score"] <= getattr(parameters, "zscore_exit", 0.0))

        if getattr(parameters, "use_vwap", False) and "vwap" in df.columns:
            conditions_enabled = True
            raw_long_entry &= (df["close"] < df["vwap"])
            raw_short_entry &= (df["close"] > df["vwap"])
            raw_long_exit |= (df["close"] >= df["vwap"])
            raw_short_exit |= (df["close"] <= df["vwap"])

        # Cross-principle filters mapping
        if getattr(parameters, "use_macd", False) and "macd" in df.columns:
            conditions_enabled = True
            raw_long_entry &= (df["macd"] > df["macd_signal"])
            raw_short_entry &= (df["macd"] < df["macd_signal"])

        if getattr(parameters, "use_adx", False) and "adx" in df.columns:
            conditions_enabled = True
            adx_thresh = getattr(parameters, "adx_threshold", 25.0)
            raw_long_entry &= (df["adx"] >= adx_thresh)
            raw_short_entry &= (df["adx"] >= adx_thresh)

        if getattr(parameters, "use_moving_averages", False) and "short_ma" in df.columns:
            conditions_enabled = True
            raw_long_entry &= (df["short_ma"] > df["long_ma"])
            raw_short_entry &= (df["short_ma"] < df["long_ma"])

        if use_trend_filter and "trend_sma" in df.columns:
            raw_long_entry &= (df["close"] > df["trend_sma"])
            raw_short_entry &= (df["close"] < df["trend_sma"])
        
        signals = np.full(len(df), "hold", dtype=object)
        
        if conditions_enabled:
            long_entries = raw_long_entry.to_numpy()
            short_entries = raw_short_entry.to_numpy()
            long_exits = raw_long_exit.to_numpy()
            short_exits = raw_short_exit.to_numpy()
            
            use_time_stop = getattr(parameters, "use_time_stop", False)
            max_periods = getattr(parameters, "time_stop_periods", 10)

            use_stop_loss = getattr(parameters, "use_stop_loss", False)
            stop_loss_pct = getattr(parameters, "stop_loss_pct", 2.0) / 100.0
            
            use_ma_exit = getattr(parameters, "use_ma_exit", False)
            ma_exit_line = df["ma_exit_line"].to_numpy() if "ma_exit_line" in df.columns else None

            position = 0
            periods_in_trade = 0
            entry_price = 0.0

            closes = df["close"].to_numpy()
            lows = df["low"].to_numpy()
            highs = df["high"].to_numpy()
            
            for i in range(1, len(df)):
                if position == 1:
                    periods_in_trade += 1
                    exit_reason = None
                    
                    if use_stop_loss and lows[i] <= entry_price * (1.0 - stop_loss_pct):
                        exit_reason = "exit_stop_loss"
                    elif long_exits[i]:
                        exit_reason = "exit_target"
                    elif use_ma_exit and ma_exit_line is not None and pd.notna(ma_exit_line[i]) and pd.notna(ma_exit_line[i-1]):
                        if closes[i] < ma_exit_line[i] and closes[i-1] >= ma_exit_line[i-1]:
                            exit_reason = "exit_target"
                    elif use_time_stop and periods_in_trade >= max_periods:
                        exit_reason = "exit_time"
                        
                    if exit_reason:
                        signals[i] = exit_reason
                        position = 0
                        periods_in_trade = 0
                        
                elif position == -1:
                    periods_in_trade += 1
                    exit_reason = None
                    
                    if use_stop_loss and highs[i] >= entry_price * (1.0 + stop_loss_pct):
                        exit_reason = "exit_stop_loss"
                    elif short_exits[i]:
                        exit_reason = "exit_target"
                    elif use_ma_exit and ma_exit_line is not None and pd.notna(ma_exit_line[i]) and pd.notna(ma_exit_line[i-1]):
                        if closes[i] > ma_exit_line[i] and closes[i-1] <= ma_exit_line[i-1]:
                            exit_reason = "exit_target"
                    elif use_time_stop and periods_in_trade >= max_periods:
                        exit_reason = "exit_time"
                        
                    if exit_reason:
                        signals[i] = exit_reason
                        position = 0
                        periods_in_trade = 0
                
                if position == 0:
                    if long_entries[i]:
                        signals[i] = "long"
                        position = 1
                        periods_in_trade = 0
                        entry_price = closes[i]
                    elif short_entries[i]:
                        signals[i] = "short"
                        position = -1
                        periods_in_trade = 0
                        entry_price = closes[i]
                        
        df["signal"] = signals
        return df