from schemas.strategy import (
    StrategyPrinciple,
    MeanReversionParameters,
    TrendFollowingParameters,
    PairsTradingParameters,
    RuleBasedParameters,
)

from .mean_reversion import MeanReversionStrategy
from .trend_following import TrendFollowingStrategy
from .pairs_trading import PairsTradingStrategy
from .rule_based import RuleBasedStrategy


class StrategyFactory:
    PARAMETER_SCHEMAS = {
        StrategyPrinciple.MEAN_REVERSION: MeanReversionParameters,
        StrategyPrinciple.TREND_FOLLOWING: TrendFollowingParameters,
        StrategyPrinciple.PAIRS_TRADING: PairsTradingParameters,
        StrategyPrinciple.RULE_BASED: RuleBasedParameters,
    }

    STRATEGIES = {
        StrategyPrinciple.MEAN_REVERSION: MeanReversionStrategy,
        StrategyPrinciple.TREND_FOLLOWING: TrendFollowingStrategy,
        StrategyPrinciple.PAIRS_TRADING: PairsTradingStrategy,
        StrategyPrinciple.RULE_BASED: RuleBasedStrategy,
    }

    @classmethod
    def get_strategy(cls, principle: StrategyPrinciple):
        principle = cls.normalize_principle(principle)
        try:
            return cls.STRATEGIES[principle]()
        except KeyError:
            raise ValueError(f"Unsupported strategy principle: {principle}")

    @classmethod
    def get_parameter_schema(cls, principle: StrategyPrinciple):
        principle = cls.normalize_principle(principle)
        try:
            return cls.PARAMETER_SCHEMAS[principle]
        except KeyError:
            raise ValueError(f"Unsupported strategy principle: {principle}")

    @classmethod
    def validate_parameters(cls, principle: StrategyPrinciple, parameters: dict):
        schema = cls.get_parameter_schema(principle)
        return schema.model_validate(parameters)

    @staticmethod
    def normalize_principle(principle: StrategyPrinciple | str) -> StrategyPrinciple:
        if isinstance(principle, StrategyPrinciple):
            return principle
        try:
            return StrategyPrinciple(principle)
        except ValueError:
            raise ValueError(f"Unknown strategy principle: {principle}")

    @classmethod
    def get_enabled_parameters(cls, principle: StrategyPrinciple, parameters):
        values = parameters.model_dump() if hasattr(parameters, "model_dump") else parameters

        all_groups = {}
        for schema_class in cls.PARAMETER_SCHEMAS.values():
            all_groups.update(getattr(schema_class, "FEATURE_GROUPS", {}))

        enabled_parameters = {}

        def is_feature_enabled(feature):
            if not values.get(feature, False):
                return False

            for parent_feature, children in all_groups.items():
                if isinstance(children, dict):
                    child_list = children.get("parameters", [])
                else:
                    child_list = children

                if feature in child_list:
                    if not is_feature_enabled(parent_feature):
                        return False

            return True

        for feature, feature_config in all_groups.items():
            if feature in values and is_feature_enabled(feature):
                enabled_parameters[feature] = True
                children = (
                    feature_config.get("parameters", [])
                    if isinstance(feature_config, dict)
                    else feature_config
                )
                for child in children:
                    if child in values:
                        enabled_parameters[child] = values[child]

        controlled_parameters = set()
        for feature_config in all_groups.values():
            children = (
                feature_config.get("parameters", [])
                if isinstance(feature_config, dict)
                else feature_config
            )
            controlled_parameters.update(children)

        for name, value in values.items():
            if name not in controlled_parameters and not name.startswith("use_"):
                enabled_parameters[name] = value

        return enabled_parameters

    @classmethod
    def get_max_lookback(cls, parameters):
        values = parameters.model_dump() if hasattr(parameters, "model_dump") else parameters
        periods = []

        lookback_keys = [
            "bollinger_period", "rsi_period", "zscore_period", "trend_filter_period",
            "time_stop_periods", "short_ma_period", "long_ma_period", "triple_ma_fast",
            "triple_ma_medium", "triple_ma_slow", "macd_fast", "macd_slow", "macd_signal",
            "adx_period", "donchian_period", "atr_period", "atr_ma_period", "ma_exit_period",
            "correlation_period"
        ]

        for key in lookback_keys:
            if key in values and isinstance(values[key], (int, float)):
                periods.append(int(values[key]))
                
        if not periods:
            return 1

        return max(periods) if periods else 1
