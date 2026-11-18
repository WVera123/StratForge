import numpy as np
import pandas as pd


class IndicatorService:
    
    @staticmethod
    def calculate_bollinger_bands(
        df: pd.DataFrame,
        period: int,
        std_multiplier: float
    ) -> pd.DataFrame:

        rolling_mean = (
            df["close"]
            .rolling(period)
            .mean()
        )

        rolling_std = (
            df["close"]
            .rolling(period)
            .std()
        )

        df["bb_middle"] = rolling_mean

        df["bb_upper"] = (
            rolling_mean
            + std_multiplier * rolling_std
        )

        df["bb_lower"] = (
            rolling_mean
            - std_multiplier * rolling_std
        )

        return df

    @staticmethod
    def calculate_rsi(
        df: pd.DataFrame,
        period: int
    ) -> pd.DataFrame:

        delta = df["close"].diff()

        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)

        avg_gain = gain.ewm(
            alpha=1 / period,
            adjust=False
        ).mean()

        avg_loss = loss.ewm(
            alpha=1 / period,
            adjust=False
        ).mean()

        rs = (
            avg_gain
            / avg_loss.replace(0, np.nan)
        )

        df["rsi"] = (
            100
            - (100 / (1 + rs))
        )

        return df

    @staticmethod
    def calculate_zscore(
        series: pd.Series,
        period: int
    ) -> pd.Series:

        mean = series.rolling(period).mean()

        std = series.rolling(period).std()

        return (
            (series - mean)
            / std.replace(0, np.nan)
        )

    @staticmethod
    def calculate_vwap(
        df: pd.DataFrame
    ) -> pd.DataFrame:

        typical_price = (
            df["high"]
            + df["low"]
            + df["close"]
        ) / 3

        tp_v = typical_price * df["volume"]

        if "timestamp" in df.columns:
            is_daily_or_higher = False
            if len(df) > 1:
                median_delta = df["timestamp"].diff().median()
                if pd.notna(median_delta) and median_delta >= pd.Timedelta(days=1):
                    is_daily_or_higher = True

            if is_daily_or_higher:
                reset_groups = df["timestamp"].dt.year
            else:
                reset_groups = df["timestamp"].dt.date

            cumulative_volume = df.groupby(reset_groups)["volume"].cumsum()
            cumulative_tp_v = tp_v.groupby(reset_groups).cumsum()

        else:
            cumulative_volume = df["volume"].cumsum()
            cumulative_tp_v = tp_v.cumsum()

        df["vwap"] = (
            cumulative_tp_v
            / cumulative_volume.replace(
                0,
                np.nan
            )
        )

        return df

    @staticmethod
    def calculate_mean_reversion_features(
        df: pd.DataFrame,
        parameters
    ) -> pd.DataFrame:

        df = df.copy()

        if getattr(parameters, "use_bollinger", False):
            df = IndicatorService.calculate_bollinger_bands(
                df,
                parameters.bollinger_period,
                parameters.bollinger_multiplier
            )

        if getattr(parameters, "use_rsi", False):
            df = IndicatorService.calculate_rsi(
                df,
                parameters.rsi_period
            )

        if getattr(parameters, "use_zscore", False):
            df["z_score"] = (
                IndicatorService.calculate_zscore(
                    df["close"],
                    parameters.zscore_period
                )
            )

        if getattr(parameters, "use_vwap", False):
            df = IndicatorService.calculate_vwap(df)

        return df

    @staticmethod
    def calculate_moving_averages(
        df: pd.DataFrame,
        short_period: int,
        long_period: int
    ) -> pd.DataFrame:

        df["short_ma"] = df["close"].rolling(short_period).mean()
        df["long_ma"] = df["close"].rolling(long_period).mean()
        return df

    @staticmethod
    def calculate_triple_ma(
        df: pd.DataFrame,
        fast_period: int,
        medium_period: int,
        slow_period: int
    ) -> pd.DataFrame:
        
        df["triple_ma_fast"] = df["close"].rolling(fast_period).mean()
        df["triple_ma_medium"] = df["close"].rolling(medium_period).mean()
        df["triple_ma_slow"] = df["close"].rolling(slow_period).mean()
        return df

    @staticmethod
    def calculate_trend_sma(
        df: pd.DataFrame,
        period: int
    ) -> pd.DataFrame:
        
        df["trend_sma"] = df["close"].rolling(period).mean()
        return df

    @staticmethod
    def calculate_atr_channels(
        df: pd.DataFrame,
        atr_period: int,
        ma_period: int,
        multiplier_upper: float,
        multiplier_lower: float
    ) -> pd.DataFrame:

        high = df["high"]
        low = df["low"]
        close = df["close"]
        prev_close = close.shift(1)

        tr1 = high - low
        tr2 = (high - prev_close).abs()
        tr3 = (low - prev_close).abs()

        true_range = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
        
        atr = true_range.rolling(atr_period).mean()
        sma = close.rolling(ma_period).mean()

        df["atr_upper"] = sma + (multiplier_upper * atr)
        df["atr_lower"] = sma - (multiplier_lower * atr)

        return df

    @staticmethod
    def calculate_macd(
        df: pd.DataFrame,
        fast: int,
        slow: int,
        signal: int
    ) -> pd.DataFrame:

        fast_ema = df["close"].ewm(span=fast, adjust=False).mean()
        slow_ema = df["close"].ewm(span=slow, adjust=False).mean()

        df["macd"] = fast_ema - slow_ema
        df["macd_signal"] = df["macd"].ewm(span=signal, adjust=False).mean()
        df["macd_histogram"] = df["macd"] - df["macd_signal"]

        return df

    @staticmethod
    def calculate_adx(
        df: pd.DataFrame,
        period: int
    ) -> pd.DataFrame:

        high = df["high"]
        low = df["low"]
        close = df["close"]

        previous_close = close.shift(1)

        tr1 = high - low
        tr2 = (high - previous_close).abs()
        tr3 = (low - previous_close).abs()

        true_range = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)

        up_move = high.diff()
        down_move = -low.diff()

        plus_dm = pd.Series(
            np.where((up_move > down_move) & (up_move > 0), up_move, 0),
            index=df.index
        )

        minus_dm = pd.Series(
            np.where((down_move > up_move) & (down_move > 0), down_move, 0),
            index=df.index
        )

        atr = true_range.ewm(alpha=1 / period, adjust=False).mean()

        plus_di = (100 * plus_dm.ewm(alpha=1 / period, adjust=False).mean() / atr.replace(0, np.nan))
        minus_di = (100 * minus_dm.ewm(alpha=1 / period, adjust=False).mean() / atr.replace(0, np.nan))

        denominator = (plus_di + minus_di).replace(0, np.nan)

        dx = (100 * (plus_di - minus_di).abs() / denominator)

        df["adx"] = dx.ewm(alpha=1 / period, adjust=False).mean()
        df["plus_di"] = plus_di
        df["minus_di"] = minus_di

        return df

    @staticmethod
    def calculate_donchian(
        df: pd.DataFrame,
        period: int
    ) -> pd.DataFrame:

        df["donchian_upper"] = df["high"].rolling(period).max().shift(1)
        df["donchian_lower"] = df["low"].rolling(period).min().shift(1)
        df["donchian_middle"] = (df["donchian_upper"] + df["donchian_lower"]) / 2

        return df

    @staticmethod
    def calculate_trend_features(
        df: pd.DataFrame,
        parameters
    ) -> pd.DataFrame:

        df = df.copy()

        if getattr(parameters, "use_moving_averages", False):
            df = IndicatorService.calculate_moving_averages(
                df, parameters.short_ma_period, parameters.long_ma_period
            )

        if getattr(parameters, "use_triple_ma", False):
            df = IndicatorService.calculate_triple_ma(
                df, parameters.triple_ma_fast, parameters.triple_ma_medium, parameters.triple_ma_slow
            )

        if getattr(parameters, "use_donchian", False):
            df = IndicatorService.calculate_donchian(
                df, parameters.donchian_period
            )

        if getattr(parameters, "use_bollinger_breakout", False):
            df = IndicatorService.calculate_bollinger_bands(
                df, parameters.bollinger_period, parameters.bollinger_multiplier
            )

        if getattr(parameters, "use_atr_breakout", False):
            df = IndicatorService.calculate_atr_channels(
                df, 
                parameters.atr_period, 
                parameters.atr_ma_period,
                parameters.atr_multiplier_upper,
                parameters.atr_multiplier_lower
            )

        if getattr(parameters, "use_macd", False):
            df = IndicatorService.calculate_macd(
                df, parameters.macd_fast, parameters.macd_slow, parameters.macd_signal
            )

        if getattr(parameters, "use_adx", False):
            df = IndicatorService.calculate_adx(
                df, parameters.adx_period
            )

        if getattr(parameters, "use_trend_filter", False):
            df = IndicatorService.calculate_trend_sma(
                df, parameters.trend_filter_period
            )

        if getattr(parameters, "use_ma_exit", False):
            df["ma_exit_line"] = df["close"].rolling(parameters.ma_exit_period).mean()

        return df

    @staticmethod
    def calculate_pairs_features(
        df: pd.DataFrame,
        parameters
    ) -> tuple[pd.DataFrame, float, float]:

        df = df.copy()

        price_a = df["close_a"].astype(float)
        price_b = df["close_b"].astype(float)

        log_a = np.log(price_a.replace(0, np.nan)).ffill()
        log_b = np.log(price_b.replace(0, np.nan)).ffill()

        valid_mask = log_a.notna() & log_b.notna()
        if valid_mask.sum() >= 10:
            beta, intercept = np.polyfit(log_b[valid_mask], log_a[valid_mask], 1)
        else:
            beta, intercept = 1.0, 0.0

        df["hedge_ratio"] = float(beta)
        df["intercept"] = float(intercept)

        df["spread"] = log_a - (intercept + beta * log_b)

        zscore_period = getattr(parameters, "zscore_period", 50)
        spread_mean = df["spread"].rolling(zscore_period).mean()
        spread_std = df["spread"].rolling(zscore_period).std()
        df["spread_mean"] = spread_mean
        df["spread_std"] = spread_std
        df["z_score"] = (df["spread"] - spread_mean) / spread_std.replace(0, np.nan)

        corr_period = getattr(parameters, "correlation_period", 50)
        df["rolling_correlation"] = price_a.rolling(corr_period).corr(price_b)

        # Output the exact log prices to accurately visually represent the statistical gap the algorithm sees
        df["normalized_a"] = log_a
        df["normalized_b"] = intercept + beta * log_b

        return df, float(beta), float(intercept)

    @staticmethod
    def calculate_cointegration_pvalue(
        df: pd.DataFrame
    ) -> float:

        try:
            from statsmodels.tsa.stattools import coint
        except Exception:
            return float("nan")

        clean = df[["close_a", "close_b"]].dropna()

        if len(clean) < 20:
            return float("nan")

        try:
            log_a = np.log(clean["close_a"].astype(float))
            log_b = np.log(clean["close_b"].astype(float))
            _, pvalue, _ = coint(log_a, log_b)
            return float(pvalue)
        except Exception:
            return float("nan")