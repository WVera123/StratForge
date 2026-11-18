from datetime import date, datetime
from enum import Enum
from typing import Any, ClassVar

from pydantic import BaseModel, Field

class StrategyPrinciple(str, Enum):
    MEAN_REVERSION = "mean_reversion"
    TREND_FOLLOWING = "trend_following"
    PAIRS_TRADING = "pairs_trading"
    RULE_BASED = "rule_based"

class MeanReversionParameters(BaseModel):
    model_config = {"extra": "allow"}

    FEATURE_GROUPS: ClassVar[dict[str, dict[str, Any]]] = {
        "use_bollinger": {
            "label": "Bollinger Bands",
            "parameters": ["bollinger_period", "bollinger_multiplier"],
        },
        "use_rsi": {
            "label": "RSI",
            "parameters": ["rsi_period", "rsi_oversold", "rsi_overbought"],
        },
        "use_zscore": {
            "label": "Z-Score",
            "parameters": ["zscore_period", "zscore_long_entry", "zscore_short_entry", "zscore_exit"],
        },
        "use_vwap": {
            "label": "VWAP",
            "parameters": [],
        },
        "use_stop_loss": {
            "label": "Stop Loss",
            "parameters": ["stop_loss_pct"],
        },
        "use_time_stop": {
            "label": "Time Stop",
            "parameters": ["time_stop_periods"],
        },
        "use_trend_filter": {
            "label": "Trend Filter",
            "parameters": ["trend_filter_period"],
        }
    }

    use_bollinger: bool = Field(default=False, description="Use Bollinger Bands for mean-reversion signals.")
    bollinger_period: int = Field(default=20, ge=2, description="Lookback period in candles used for the Bollinger Bands.")
    bollinger_multiplier: float = Field(default=2.0, gt=0, description="Number of standard deviations for Bollinger Bands.")

    use_rsi: bool = Field(default=False, description="Use RSI as confirmation.")
    rsi_period: int = Field(default=14, ge=2, description="Lookback period in candles used to calculate RSI.")
    rsi_oversold: float = Field(default=30.0, ge=0, le=100, description="RSI oversold threshold.")
    rsi_overbought: float = Field(default=70.0, ge=0, le=100, description="RSI overbought threshold.")

    use_zscore: bool = Field(default=False, description="Use price Z-score as confirmation.")
    zscore_period: int = Field(default=20, ge=2, description="Lookback period in candles used to calculate the Z-score.")
    zscore_long_entry: float = Field(default=-2.0, lt=0, description="Z-score threshold for long entries.")
    zscore_short_entry: float = Field(default=2.0, gt=0, description="Z-score threshold for short entries.")
    zscore_exit: float = Field(default=0.0, description="Z-score level used as the mean-reversion exit.")

    use_vwap: bool = Field(default=False, description="Use VWAP as an additional mean reference.")
    use_stop_loss: bool = Field(default=False, description="Enable percentage stop loss.")
    stop_loss_pct: float = Field(default=2.0, gt=0, description="Stop loss percentage under/above entry price.")
    use_time_stop: bool = Field(default=False, description="Exit trades if they take too long.")
    time_stop_periods: int = Field(default=10, ge=1, description="Maximum number of candles to hold a position.")
    use_trend_filter: bool = Field(default=False, description="Filter trades against the macro trend.")
    trend_filter_period: int = Field(default=200, ge=10, description="Lookback period for the trend filter SMA.")


class TrendFollowingParameters(BaseModel):
    model_config = {"extra": "allow"}

    FEATURE_GROUPS: ClassVar[dict[str, dict[str, Any]]] = {
        "use_moving_averages": {
            "label": "Dual Moving Average",
            "parameters": ["short_ma_period", "long_ma_period"],
        },
        "use_triple_ma": {
            "label": "Triple Moving Average",
            "parameters": ["triple_ma_fast", "triple_ma_medium", "triple_ma_slow"],
        },
        "use_donchian": {
            "label": "Donchian Trend Breakout",
            "parameters": ["donchian_period"],
        },
        "use_bollinger_breakout": {
            "label": "Bollinger Channel Breakout",
            "parameters": ["bollinger_period", "bollinger_multiplier"],
        },
        "use_atr_breakout": {
            "label": "ATR Channel Breakout",
            "parameters": ["atr_period", "atr_ma_period", "atr_multiplier_upper", "atr_multiplier_lower"],
        },
        "use_ma_exit": {
            "label": "Moving Average Exit",
            "parameters": ["ma_exit_period"],
        },
        "use_stop_loss": {
            "label": "Stop Loss",
            "parameters": ["stop_loss_pct"],
        },
        "use_time_stop": {
            "label": "Time Stop",
            "parameters": ["time_stop_periods"],
        },
        "use_macd": {
            "label": "MACD Filter",
            "parameters": ["macd_fast", "macd_slow", "macd_signal"],
        },
        "use_adx": {
            "label": "ADX Filter",
            "parameters": ["adx_period", "adx_threshold"],
        },
        "use_trend_filter": {
            "label": "Macro Trend Filter",
            "parameters": ["trend_filter_period"],
        }
    }

    use_atr_breakout: bool = Field(default=False, description="Enter on breakout of ATR Volatility Channels.")
    atr_period: int = Field(default=20, ge=2, description="Lookback period for Average True Range.")
    atr_ma_period: int = Field(default=350, ge=2, description="Lookback period for the centerline Moving Average.")
    atr_multiplier_upper: float = Field(default=7.0, gt=0, description="Multiplier for the upper ATR band (Long entry).")
    atr_multiplier_lower: float = Field(default=3.0, gt=0, description="Multiplier for the lower ATR band (Short entry).")

    use_bollinger_breakout: bool = Field(default=False, description="Enter on breakout of Bollinger Bands.")
    bollinger_period: int = Field(default=20, ge=2, description="Lookback period for Bollinger Bands.")
    bollinger_multiplier: float = Field(default=2.0, gt=0, description="Standard deviation multiplier.")
    
    use_donchian: bool = Field(default=False, description="Enter on breakout of Donchian Channels.")
    donchian_period: int = Field(default=20, ge=2, description="Lookback period for Donchian Channels.")

    use_moving_averages: bool = Field(default=False, description="Use Dual Moving Average crossovers for trend signals.")
    short_ma_period: int = Field(default=50, ge=2, description="Short-term lookback period for the moving-average.")
    long_ma_period: int = Field(default=200, ge=3, description="Long-term lookback period for the moving-average.")

    use_triple_ma: bool = Field(default=False, description="Use Triple Moving Average alignment for trend signals.")
    triple_ma_fast: int = Field(default=10, ge=2, description="Fast MA period.")
    triple_ma_medium: int = Field(default=20, ge=3, description="Medium MA period.")
    triple_ma_slow: int = Field(default=50, ge=5, description="Slow MA period.")

    use_ma_exit: bool = Field(default=False, description="Exit positions when price crosses the Moving Average.")
    ma_exit_period: int = Field(default=350, ge=2, description="Moving average period used for exit signals.")

    use_stop_loss: bool = Field(default=False, description="Enable percentage stop loss.")
    stop_loss_pct: float = Field(default=2.0, gt=0, description="Stop loss percentage under/above entry price.")
    use_time_stop: bool = Field(default=False, description="Automatically exit positions after a specific duration.")
    time_stop_periods: int = Field(default=10, ge=1, description="Number of candles to hold before exiting.")

    use_macd: bool = Field(default=False, description="Filter signals using MACD.")
    macd_fast: int = Field(default=12, ge=2, description="Fast EMA period.")
    macd_slow: int = Field(default=26, ge=3, description="Slow EMA period.")
    macd_signal: int = Field(default=9, ge=2, description="Signal EMA period.")

    use_adx: bool = Field(default=False, description="Filter signals based on minimum trend strength.")
    adx_period: int = Field(default=14, ge=2, description="ADX lookback period.")
    adx_threshold: float = Field(default=25.0, ge=0, description="Minimum ADX required to take a trade.")

    use_trend_filter: bool = Field(default=False, description="Filter entries against a macro moving average.")
    trend_filter_period: int = Field(default=200, ge=10, description="Lookback period for the macro SMA.")


class PairsTradingParameters(BaseModel):
    model_config = {"extra": "allow"}

    FEATURE_GROUPS: ClassVar[dict[str, dict[str, Any]]] = {
        "use_zscore": {
            "label": "Spread Z-Score Engine",
            "parameters": ["zscore_period", "zscore_long_entry", "zscore_short_entry", "zscore_exit"],
        },
        "use_correlation": {
            "label": "Correlation Filter",
            "parameters": ["correlation_period", "correlation_threshold"],
        },
        "use_cointegration": {
            "label": "Cointegration Filter",
            "parameters": ["cointegration_pvalue_threshold"],
        },
        "use_zscore_stop_loss": {
            "label": "Z-Score Stop Loss",
            "parameters": ["zscore_stop_loss"],
        },
        "use_time_stop": {
            "label": "Time Stop",
            "parameters": ["time_stop_periods"],
        }
    }

    use_zscore: bool = Field(default=False, description="Generate entry and exit signals from normalized spread Z-score.")
    zscore_period: int = Field(default=50, ge=5, description="Lookback period to estimate the spread rolling mean and variance.")
    zscore_long_entry: float = Field(default=-2.0, lt=0, description="Z-score threshold triggering a long-spread position.")
    zscore_short_entry: float = Field(default=2.0, gt=0, description="Z-score threshold triggering a short-spread position.")
    zscore_exit: float = Field(default=0.0, description="Z-score convergence level where open positions take profit.")

    use_zscore_stop_loss: bool = Field(default=False, description="Force exit position if spread divergence exceeds maximum threshold.")
    zscore_stop_loss: float = Field(default=3.5, gt=0.5, description="Absolute Z-score divergence cutoff to cut losses.")

    use_time_stop: bool = Field(default=False, description="Force exit trades that do not converge within a given timeframe.")
    time_stop_periods: int = Field(default=40, ge=1, description="Maximum number of bars to keep an open pair position.")

    use_correlation: bool = Field(default=False, description="Require a minimum rolling correlation before opening trades.")
    correlation_period: int = Field(default=50, ge=5, description="Lookback window for the rolling Pearson correlation.")
    correlation_threshold: float = Field(default=0.70, ge=-1.0, le=1.0, description="Minimum correlation needed to validate trades.")

    use_cointegration: bool = Field(default=False, description="Require the pair residuals to be stationary via ADF test.")
    cointegration_pvalue_threshold: float = Field(default=0.05, gt=0.0, le=1.0, description="Maximum Augmented Dickey-Fuller p-value.")

class RuleBasedParameters(BaseModel):
    FEATURE_GROUPS: ClassVar[dict[str, dict[str, Any]]] = {}
    tokens: list[dict[str, Any]] = Field(default_factory=list, description="User-built rule tokens.")
    
class StrategyCreate(BaseModel):
    user_id: int
    title: str
    crypto1: int
    crypto2: int | None = None
    timeframe: str = Field(pattern=r"^(1m|1h|1d)$")
    principle: StrategyPrinciple
    start_date: date
    split: float
    parameters: dict[str, Any]

class Strategy(BaseModel):
    id: int
    user_id: int
    title: str
    principle: StrategyPrinciple
    start_date: date
    split: float
    parameters: dict[str, Any]
    created_at: datetime
    updated_at: datetime

class StrategyPreviewRequest(BaseModel):
    crypto1: int
    crypto2: int | None = None
    timeframe: str = Field(pattern=r"^(1m|1h|1d)$")
    start_date: date | None = None
    end_date: date | None = None
    principle: StrategyPrinciple
    parameters: dict[str, Any]
    initial_capital: float = Field(default=10000.0, gt=0)
    position_sizing: str = Field(default="fixed")
    position_allocation: float = Field(default=1.0, ge=0.0, le=1.0)
    fee_rate: float = Field(default=0.0, ge=0.0)
    slippage_rate: float = Field(default=0.0, ge=0.0)

class BacktestRequest(BaseModel):
    strategy_id: int = Field(..., gt=0)
    crypto1: int = Field(..., gt=0)
    crypto2: int | None = Field(default=None, gt=0)
    timeframe: str = Field(..., pattern=r"^(1m|1h|1d)$")
    train_start_date: date
    train_end_date: date
    test_start_date: date
    test_end_date: date
    position_sizing: str = Field(default="fixed")
    position_allocation: float = Field(default=1.0, ge=0.0, le=1.0)
    initial_capital: float = Field(default=10000.0, gt=0)
    fee_rate: float = Field(default=0.0, ge=0.0)
    slippage_rate: float = Field(default=0.0, ge=0.0)