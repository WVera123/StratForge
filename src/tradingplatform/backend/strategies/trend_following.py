import pandas as pd
import numpy as np

from indicators.indicator_service import IndicatorService
from .base_strategy import BaseStrategy


class TrendFollowingStrategy(BaseStrategy):

    def run(
        self,
        df: pd.DataFrame,
        parameters
    ) -> pd.DataFrame:

        df = IndicatorService.calculate_trend_features(df, parameters)
        try:
            # Cross-principle indicator injection
            df = IndicatorService.calculate_mean_reversion_features(df, parameters)
        except Exception:
            pass

        df["signal"] = "hold"
        df["trend"] = "neutral"

        long_signal = pd.Series(False, index=df.index)
        short_signal = pd.Series(False, index=df.index)

        if getattr(parameters, "use_moving_averages", False) and "short_ma" in df.columns:
            df.loc[df["short_ma"] > df["long_ma"], "trend"] = "uptrend"
            df.loc[df["short_ma"] < df["long_ma"], "trend"] = "downtrend"

            bullish_cross = (df["short_ma"] > df["long_ma"]) & (df["short_ma"].shift(1) <= df["long_ma"].shift(1))
            bearish_cross = (df["short_ma"] < df["long_ma"]) & (df["short_ma"].shift(1) >= df["long_ma"].shift(1))
            
            long_signal |= bullish_cross
            short_signal |= bearish_cross

        if getattr(parameters, "use_triple_ma", False) and "triple_ma_fast" in df.columns:
            bullish_triple = (df["triple_ma_fast"] > df["triple_ma_medium"]) & (df["triple_ma_medium"] > df["triple_ma_slow"])
            prev_bullish = (df["triple_ma_fast"].shift(1) > df["triple_ma_medium"].shift(1)) & (df["triple_ma_medium"].shift(1) > df["triple_ma_slow"].shift(1))
            
            bearish_triple = (df["triple_ma_fast"] < df["triple_ma_medium"]) & (df["triple_ma_medium"] < df["triple_ma_slow"])
            prev_bearish = (df["triple_ma_fast"].shift(1) < df["triple_ma_medium"].shift(1)) & (df["triple_ma_medium"].shift(1) < df["triple_ma_slow"].shift(1))

            long_signal |= (bullish_triple & ~prev_bullish)
            short_signal |= (bearish_triple & ~prev_bearish)

        if getattr(parameters, "use_donchian", False) and "donchian_upper" in df.columns:
            donchian_bullish = (df["close"] > df["donchian_upper"])
            prev_donchian_bullish = (df["close"].shift(1) > df["donchian_upper"].shift(1))
            
            donchian_bearish = (df["close"] < df["donchian_lower"])
            prev_donchian_bearish = (df["close"].shift(1) < df["donchian_lower"].shift(1))

            long_signal |= (donchian_bullish & ~prev_donchian_bullish)
            short_signal |= (donchian_bearish & ~prev_donchian_bearish)

        if getattr(parameters, "use_bollinger_breakout", False) and "bb_upper" in df.columns:
            bb_upper_prev = df["bb_upper"].shift(1)
            bb_lower_prev = df["bb_lower"].shift(1)

            bb_bullish = (df["close"] > bb_upper_prev)
            prev_bb_bullish = (df["close"].shift(1) > df["bb_upper"].shift(2))
            
            bb_bearish = (df["close"] < bb_lower_prev)
            prev_bb_bearish = (df["close"].shift(1) < df["bb_lower"].shift(2))

            long_signal |= (bb_bullish & ~prev_bb_bullish)
            short_signal |= (bb_bearish & ~prev_bb_bearish)

        if getattr(parameters, "use_atr_breakout", False) and "atr_upper" in df.columns:
            atr_upper_prev = df["atr_upper"].shift(1)
            atr_lower_prev = df["atr_lower"].shift(1)

            atr_bullish = (df["close"] > atr_upper_prev)
            prev_atr_bullish = (df["close"].shift(1) > df["atr_upper"].shift(2))
            
            atr_bearish = (df["close"] < atr_lower_prev)
            prev_atr_bearish = (df["close"].shift(1) < df["atr_lower"].shift(2))

            long_signal |= (atr_bullish & ~prev_atr_bullish)
            short_signal |= (atr_bearish & ~prev_atr_bearish)

        # Base Filters
        if getattr(parameters, "use_adx", False) and "adx" in df.columns:
            adx_ok = (df["adx"] >= getattr(parameters, "adx_threshold", 25.0))
            long_signal &= adx_ok
            short_signal &= adx_ok

        if getattr(parameters, "use_macd", False) and "macd" in df.columns:
            macd_bullish = (df["macd"] > df["macd_signal"])
            macd_bearish = (df["macd"] < df["macd_signal"])
            long_signal &= macd_bullish
            short_signal &= macd_bearish
            
        if getattr(parameters, "use_trend_filter", False) and "trend_sma" in df.columns:
            macro_bullish = (df["close"] > df["trend_sma"])
            macro_bearish = (df["close"] < df["trend_sma"])
            long_signal &= macro_bullish
            short_signal &= macro_bearish
            
        # Cross-Principle Feature Injections Filters
        if getattr(parameters, "use_rsi", False) and "rsi" in df.columns:
            long_signal &= (df["rsi"] < getattr(parameters, "rsi_oversold", 30))
            short_signal &= (df["rsi"] > getattr(parameters, "rsi_overbought", 70))
            
        if getattr(parameters, "use_zscore", False) and "z_score" in df.columns:
            long_signal &= (df["z_score"] <= getattr(parameters, "zscore_long_entry", -2.0))
            short_signal &= (df["z_score"] >= getattr(parameters, "zscore_short_entry", 2.0))

        if getattr(parameters, "use_vwap", False) and "vwap" in df.columns:
            long_signal &= (df["close"] < df["vwap"])
            short_signal &= (df["close"] > df["vwap"])

        long_entries = long_signal.to_numpy()
        short_entries = short_signal.to_numpy()
        signals = np.full(len(df), "hold", dtype=object)

        use_stop_loss = getattr(parameters, "use_stop_loss", False)
        stop_loss_pct = getattr(parameters, "stop_loss_pct", 2.0) / 100.0
        use_time_stop = getattr(parameters, "use_time_stop", False)
        
        use_ma_exit = getattr(parameters, "use_ma_exit", False)
        ma_exit_line = df["ma_exit_line"].to_numpy() if "ma_exit_line" in df.columns else None
        
        use_zscore_exit = getattr(parameters, "use_zscore", False)
        z_scores = df["z_score"].to_numpy() if "z_score" in df.columns else None
        
        use_vwap_exit = getattr(parameters, "use_vwap", False)
        vwaps = df["vwap"].to_numpy() if "vwap" in df.columns else None
        
        use_bollinger_exit = getattr(parameters, "use_bollinger", False)
        bb_middle = df["bb_middle"].to_numpy() if "bb_middle" in df.columns else None

        closes = df["close"].to_numpy()
        lows = df["low"].to_numpy()
        highs = df["high"].to_numpy()
        
        current_pos = 0
        bars_held = 0
        entry_price = 0.0
        time_stop_limit = getattr(parameters, "time_stop_periods", 10)
        
        for i in range(1, len(df)):
            if current_pos == 1:
                bars_held += 1
                exit_triggered = None
                
                if use_stop_loss and lows[i] <= entry_price * (1.0 - stop_loss_pct):
                    exit_triggered = "exit_stop_loss"
                elif use_ma_exit and ma_exit_line is not None and pd.notna(ma_exit_line[i]) and pd.notna(ma_exit_line[i-1]):
                    if closes[i] < ma_exit_line[i] and closes[i-1] >= ma_exit_line[i-1]:
                        exit_triggered = "exit_target"
                elif use_zscore_exit and z_scores is not None and pd.notna(z_scores[i]) and z_scores[i] >= getattr(parameters, "zscore_exit", 0.0):
                    exit_triggered = "exit_target"
                elif use_vwap_exit and vwaps is not None and pd.notna(vwaps[i]) and closes[i] >= vwaps[i]:
                    exit_triggered = "exit_target"
                elif use_bollinger_exit and bb_middle is not None and pd.notna(bb_middle[i]) and closes[i] >= bb_middle[i]:
                    exit_triggered = "exit_target"
                        
                if not exit_triggered and use_time_stop and bars_held >= time_stop_limit:
                    exit_triggered = "exit_time"
                    
                if short_entries[i]:
                    signals[i] = "short"
                    current_pos = -1
                    bars_held = 0
                    entry_price = closes[i]
                elif exit_triggered:
                    signals[i] = exit_triggered
                    current_pos = 0
                    bars_held = 0
                    
            elif current_pos == -1:
                bars_held += 1
                exit_triggered = None
                
                if use_stop_loss and highs[i] >= entry_price * (1.0 + stop_loss_pct):
                    exit_triggered = "exit_stop_loss"
                elif use_ma_exit and ma_exit_line is not None and pd.notna(ma_exit_line[i]) and pd.notna(ma_exit_line[i-1]):
                    if closes[i] > ma_exit_line[i] and closes[i-1] <= ma_exit_line[i-1]:
                        exit_triggered = "exit_target"
                elif use_zscore_exit and z_scores is not None and pd.notna(z_scores[i]) and z_scores[i] <= getattr(parameters, "zscore_exit", 0.0):
                    exit_triggered = "exit_target"
                elif use_vwap_exit and vwaps is not None and pd.notna(vwaps[i]) and closes[i] <= vwaps[i]:
                    exit_triggered = "exit_target"
                elif use_bollinger_exit and bb_middle is not None and pd.notna(bb_middle[i]) and closes[i] <= bb_middle[i]:
                    exit_triggered = "exit_target"
                        
                if not exit_triggered and use_time_stop and bars_held >= time_stop_limit:
                    exit_triggered = "exit_time"
                    
                if long_entries[i]:
                    signals[i] = "long"
                    current_pos = 1
                    bars_held = 0
                    entry_price = closes[i]
                elif exit_triggered:
                    signals[i] = exit_triggered
                    current_pos = 0
                    bars_held = 0
            
            else:
                if long_entries[i]:
                    signals[i] = "long"
                    current_pos = 1
                    bars_held = 0
                    entry_price = closes[i]
                elif short_entries[i]:
                    signals[i] = "short"
                    current_pos = -1
                    bars_held = 0
                    entry_price = closes[i]

        df["signal"] = signals
        return df