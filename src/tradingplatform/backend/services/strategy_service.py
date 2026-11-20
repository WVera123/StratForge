from datetime import date, datetime, timedelta
import pandas as pd
import numpy as np

from repositories.strategy_repo import StrategyRepository

from schemas.strategy import StrategyPrinciple

from strategies.strategy_factory import StrategyFactory

class StrategyService:

    STARTING_CAPITAL = 10_000.0

    def __init__(self):
        self.repository = StrategyRepository()

    def get_strategies(self):
        strategies = self.repository.get_strategies()
        result = []
        for strategy in strategies:
            try:
                validated = StrategyFactory.validate_parameters(strategy.principle, strategy.parameters)
                strategy.parameters = self._get_enabled_parameters(strategy.principle, validated)
            except Exception:
                pass
            result.append(strategy.to_dict())
        return result

    def get_strategy(self, strategy_id: int):
        strategy = self.repository.get_strategy_by_id(strategy_id)
        try:
            validated = StrategyFactory.validate_parameters(strategy.principle, strategy.parameters)
            strategy.parameters = self._get_enabled_parameters(strategy.principle, validated)
        except Exception:
            pass
        return strategy.to_dict()

    def get_feature_groups(self, principle: str):
        try:
            principle_enum = StrategyPrinciple(principle)
        except ValueError:
            raise ValueError(f"Unknown strategy principle: {principle}")

        schema = StrategyFactory.get_parameter_schema(principle_enum)
        return getattr(schema, "FEATURE_GROUPS", {})

    def get_parameters(self, principle: str):
        try:
            principle_enum = StrategyPrinciple(principle)
        except ValueError:
            raise ValueError(f"Unknown strategy principle: {principle}")

        schema = StrategyFactory.get_parameter_schema(principle_enum)
        feature_groups = getattr(schema, "FEATURE_GROUPS", {})

        param_to_feature = {}

        for f_key, f_data in feature_groups.items():
            if isinstance(f_data, list):
                label = f_key.replace("use_", "").replace("_", " ").title()
                params_list = f_data
            else:
                label = f_data.get("label", f_key.replace("use_", "").replace("_", " ").title())
                params_list = f_data.get("parameters", [])

            param_to_feature[f_key] = {
                "feature_key": f_key,
                "feature_label": label,
                "is_feature_toggle": True
            }

            for p_name in params_list:
                param_to_feature[p_name] = {
                    "feature_key": f_key,
                    "feature_label": label,
                    "is_feature_toggle": False
                }

        result = []
        for name, field in schema.model_fields.items():
            annotation = field.annotation

            if annotation is bool:
                field_type = "boolean"
            elif annotation is int:
                field_type = "integer"
            elif annotation is float:
                field_type = "number"
            else:
                field_type = "string"

            minimum = None
            maximum = None
            for item in field.metadata:
                if hasattr(item, "ge") and item.ge is not None:
                    minimum = item.ge
                if hasattr(item, "gt") and item.gt is not None:
                    minimum = item.gt
                if hasattr(item, "le") and item.le is not None:
                    maximum = item.le
                if hasattr(item, "lt") and item.lt is not None:
                    maximum = item.lt
                    
            meta = param_to_feature.get(name)
            result.append({
                "name": name,
                "label": name.replace("_", " ").title(),
                "type": field_type,
                "default": field.default,
                "description": field.description,
                "min": minimum,
                "max": maximum,
                "feature_key": meta["feature_key"] if meta else None,
                "feature_label": meta["feature_label"] if meta else None,
                "is_feature_toggle": meta["is_feature_toggle"] if meta else False
            })

        return result

    def _filter_trades(self, trades, start_date, end_date):
        if not trades:
            return []

        result = []
        start_timestamp = pd.Timestamp(start_date, tz="UTC") if start_date is not None else None
        
        if end_date is not None:
            if isinstance(end_date, str) and len(end_date) == 10:
                end_timestamp = pd.Timestamp(end_date, tz="UTC") + pd.Timedelta(days=1)
            elif isinstance(end_date, date) and not isinstance(end_date, datetime):
                end_timestamp = pd.Timestamp(end_date, tz="UTC") + pd.Timedelta(days=1)
            else:
                end_timestamp = pd.Timestamp(end_date, tz="UTC")
        else:
            end_timestamp = None

        for item in trades:
            timestamp = pd.Timestamp(item["timestamp"])
            if start_timestamp is not None and timestamp < start_timestamp:
                continue
            if end_timestamp is not None and timestamp >= end_timestamp:
                continue
            result.append(item)

        return result

    def get_max_lookback(self, parameters):
        return StrategyFactory.get_max_lookback(parameters)

    def _get_enabled_parameters(self, principle, parameters):
        return StrategyFactory.get_enabled_parameters(principle, parameters)

    def create_strategy(self, strategy):
        validated_parameters = StrategyFactory.validate_parameters(strategy.principle, strategy.parameters)
        strategy.parameters = self._get_enabled_parameters(strategy.principle, validated_parameters)

        created = self.repository.create_strategy(
            user_id=strategy.user_id,
            title=strategy.title,
            crypto1=strategy.crypto1,
            crypto2=strategy.crypto2,
            timeframe=strategy.timeframe,
            principle=strategy.principle.value,
            start_date=strategy.start_date,
            split=strategy.split,
            parameters=strategy.parameters
        )
        return created.to_dict() if hasattr(created, "to_dict") else created
        
    def delete_strategy(self, strategy_id: int):
        return self.repository.delete_strategy(strategy_id)
    
    def edit_strategy(self, strategy_id: int, strategy):
        validated_parameters = StrategyFactory.validate_parameters(strategy.principle, strategy.parameters)
        strategy.parameters = self._get_enabled_parameters(strategy.principle, validated_parameters)

        edited = self.repository.edit_strategy(
            strategy_id=strategy_id,
            user_id=strategy.user_id,
            title=strategy.title,
            crypto1=strategy.crypto1,
            crypto2=strategy.crypto2,
            timeframe=strategy.timeframe,
            principle=strategy.principle.value,
            start_date=strategy.start_date,
            split=strategy.split,
            parameters=strategy.parameters
        )

        return edited.to_dict() if hasattr(edited, "to_dict") else edited

    def _calculate_warmup_start(self, start_date, timeframe, lookback):
        if start_date is None:
            return None

        if isinstance(start_date, str):
            try:
                start_date = datetime.strptime(start_date, "%Y-%m-%d")
            except ValueError:
                start_date = pd.to_datetime(start_date).to_pydatetime()
        elif isinstance(start_date, date) and not isinstance(start_date, datetime):
            start_date = datetime.combine(start_date, datetime.min.time())

        warmup_candles = max(lookback * 2, 50)

        if timeframe == "1m":
            return start_date - timedelta(minutes=warmup_candles)
        if timeframe == "1h":
            return start_date - timedelta(hours=warmup_candles)
        if timeframe == "1d":
            return start_date - timedelta(days=warmup_candles)

        return start_date

    def _filter_requested_range(self, df, start_date, end_date):
        if df.empty:
            return df

        result = df.copy()
        result["timestamp"] = pd.to_datetime(result["timestamp"], utc=True)

        if start_date is not None:
            start_timestamp = pd.Timestamp(start_date, tz="UTC")
            result = result[result["timestamp"] >= start_timestamp]

        if end_date is not None:
            if isinstance(end_date, str) and len(end_date) == 10:
                end_timestamp = pd.Timestamp(end_date, tz="UTC") + pd.Timedelta(days=1)
            elif isinstance(end_date, date) and not isinstance(end_date, datetime):
                end_timestamp = pd.Timestamp(end_date, tz="UTC") + pd.Timedelta(days=1)
            else:
                end_timestamp = pd.Timestamp(end_date, tz="UTC")

            result = result[result["timestamp"] < end_timestamp]

        return result.reset_index(drop=True)