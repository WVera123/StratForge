from datetime import date, datetime, timedelta
import pandas as pd
import numpy as np
import json

from requests import request

from repositories.strategy_repo import StrategyRepository
from repositories.market_data_repo import MarketDataRepository

from schemas.strategy import (
    StrategyPrinciple,
    MeanReversionParameters,
    TrendFollowingParameters,
    PairsTradingParameters,
    RuleBasedParameters
)

from strategies.mean_reversion import MeanReversionStrategy
from strategies.trend_following import TrendFollowingStrategy
from strategies.pairs_trading import PairsTradingStrategy
from strategies.rule_based import RuleBasedStrategy
from indicators.indicator_service import IndicatorService

class StrategyService:

    STARTING_CAPITAL = 10_000.0

    PARAMETER_SCHEMAS = {
        StrategyPrinciple.MEAN_REVERSION: MeanReversionParameters,
        StrategyPrinciple.TREND_FOLLOWING: TrendFollowingParameters,
        StrategyPrinciple.PAIRS_TRADING: PairsTradingParameters,
        StrategyPrinciple.RULE_BASED: RuleBasedParameters
    }

    STRATEGIES = {
        StrategyPrinciple.MEAN_REVERSION: MeanReversionStrategy(),
        StrategyPrinciple.TREND_FOLLOWING: TrendFollowingStrategy(),
        StrategyPrinciple.PAIRS_TRADING: PairsTradingStrategy(),
        StrategyPrinciple.RULE_BASED: RuleBasedStrategy()
    }

    def __init__(self):
        self.repository = StrategyRepository()
        self.market_data_repository = MarketDataRepository()

    def get_strategies(self):
        strategies = self.repository.get_strategies()
        for strategy in strategies:
            try:
                principle = StrategyPrinciple(strategy["principle"])
                schema = self.PARAMETER_SCHEMAS[principle]
                validated = schema.model_validate(strategy["parameters"])
                strategy["parameters"] = self._get_enabled_parameters(principle, validated)
            except Exception:
                pass
        return strategies

    def get_strategy(self, strategy_id: int):
        strategy = self.repository.get_strategy_by_id(strategy_id)
        try:
            principle = StrategyPrinciple(strategy["principle"])
            schema = self.PARAMETER_SCHEMAS[principle]
            validated = schema.model_validate(strategy["parameters"])
            strategy["parameters"] = self._get_enabled_parameters(principle, validated)
        except Exception:
            pass
        return strategy

    def get_feature_groups(self, principle: str):
        try:
            principle_enum = StrategyPrinciple(principle)
        except ValueError:
            raise ValueError(f"Unknown strategy principle: {principle}")

        schema = self.PARAMETER_SCHEMAS[principle_enum]
        return getattr(schema, "FEATURE_GROUPS", {})

    def get_parameters(self, principle: str):
        try:
            principle_enum = StrategyPrinciple(principle)
        except ValueError:
            raise ValueError(f"Unknown strategy principle: {principle}")

        schema = self.PARAMETER_SCHEMAS[principle_enum]
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

    def _get_enabled_parameters(self, principle, parameters):
        values = parameters.model_dump() if hasattr(parameters, "model_dump") else parameters
        
        all_groups = {}
        for schema_class in self.PARAMETER_SCHEMAS.values():
            all_groups.update(getattr(schema_class, "FEATURE_GROUPS", {}))
            
        enabled_parameters = {}

        def is_feature_enabled(feat):
            if not values.get(feat, False):
                return False
            for parent_feat, children in all_groups.items():
                if isinstance(children, dict):
                    child_list = children.get("parameters", [])
                else:
                    child_list = children
                if feat in child_list:
                    if not is_feature_enabled(parent_feat):
                        return False
            return True

        for feature, feature_cfg in all_groups.items():
            if feature in values and is_feature_enabled(feature):
                enabled_parameters[feature] = True
                children = feature_cfg.get("parameters", []) if isinstance(feature_cfg, dict) else feature_cfg
                for child in children:
                    if child in values:
                        enabled_parameters[child] = values[child]

        controlled_parameters = set()
        for feature_cfg in all_groups.values():
            children = feature_cfg.get("parameters", []) if isinstance(feature_cfg, dict) else feature_cfg
            controlled_parameters.update(children)

        for name, value in values.items():
            if name not in controlled_parameters and not name.startswith("use_"):
                enabled_parameters[name] = value

        return enabled_parameters
    
    def create_strategy(self, strategy):
        schema = self.PARAMETER_SCHEMAS[strategy.principle]
        validated_parameters = schema.model_validate(strategy.parameters)
        strategy.parameters = self._get_enabled_parameters(strategy.principle, validated_parameters)

        return self.repository.create_strategy(
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
        
    def delete_strategy(self, strategy_id: int):
        return self.repository.delete_strategy(strategy_id)
    
    def edit_strategy(self, strategy_id: int, strategy):
        schema = self.PARAMETER_SCHEMAS[strategy.principle]
        validated_parameters = schema.model_validate(strategy.parameters)
        strategy.parameters = self._get_enabled_parameters(strategy.principle, validated_parameters)

        return self.repository.edit_strategy(
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

    def _get_max_lookback(self, parameters):
        values = parameters.model_dump()
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

        return max(periods)
    
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

    def _calculate_single_asset_equity_curve(
        self,
        df,
        position_sizing="fixed",
        position_allocation=1.0,
        initial_capital=10000.0,
        maker_fee=0.0,
        taker_fee=0.0,
        slippage_rate=0.0
    ):
        if df.empty:
            return [], [], 0

        result = df.copy()
        result["timestamp"] = pd.to_datetime(result["timestamp"], utc=True)
        result["close"] = pd.to_numeric(result["close"], errors="coerce")
        result = result.dropna(subset=["timestamp", "close"])
        result = result.sort_values("timestamp").reset_index(drop=True)

        if result.empty:
            return [], [], 0

        records = result.to_dict(orient="records")

        equity = float(initial_capital)
        position = 0
        equity_curve = []
        trades = []
        entry_equity = equity
        active_bars = 0
        current_qty = 0.0

        total_cost = float(maker_fee + taker_fee + slippage_rate)

        first_timestamp = records[0]["timestamp"]
        equity_curve.append({
            "timestamp": first_timestamp.isoformat(),
            "equity": float(equity),
            "price": float(records[0]["close"])
        })

        for i in range(len(records) - 1):
            row = records[i]
            next_row = records[i + 1]

            signal = row.get("signal", "hold")
            current_position = position
            current_exit_reason = "target"

            if signal == "long":
                position = 1
            elif signal == "short":
                position = -1
            elif isinstance(signal, str) and signal.startswith("exit"):
                position = 0
                if "_" in signal:
                    current_exit_reason = signal.split("_", 1)[1]

            if position != 0:
                active_bars += 1

            if position != current_position:
                trade_price = float(row["close"])
                base_val = equity if position_sizing == "compounding" else initial_capital
                trade_value = base_val * float(position_allocation)

                if current_position != 0:
                    fee_paid = trade_value * total_cost if total_cost > 0 else 0.0
                    equity -= fee_paid
                    pnl = equity - entry_equity

                    trades.append({
                        "timestamp": row["timestamp"].isoformat(),
                        "action": "exit",
                        "exit_reason": current_exit_reason,
                        "price": trade_price,
                        "quantity": current_qty,
                        "pnl": float(pnl),
                        "fees": float(fee_paid),
                        "equity_after": float(equity)
                    })
                    current_qty = 0.0

                if position != 0:
                    fee_paid = trade_value * total_cost if total_cost > 0 else 0.0
                    equity -= fee_paid
                    entry_equity = equity
                    
                    current_qty = float(trade_value / trade_price) if trade_price > 0 else 0.0
                    if position == -1:
                        current_qty = -current_qty
                        
                    action_str = "long" if position == 1 else "short"

                    exposure_value = abs(current_qty) * trade_price
                    position_percentage = (exposure_value / equity) * 100 if equity > 0 else 0.0
                    
                    trades.append({
                        "timestamp": row["timestamp"].isoformat(),
                        "action": action_str,
                        "price": trade_price,
                        "quantity": current_qty,
                        "pnl": 0.0,
                        "fees": float(fee_paid),
                        "equity_after": float(equity),
                        "position_percentage": float(position_percentage)
                    })

            current_price = float(row["close"])
            next_price = float(next_row["close"])

            price_return = (next_price / current_price) - 1.0 if current_price > 0 else 0.0
            strategy_return = position * price_return * float(position_allocation)
            
            if position_sizing == "compounding":
                equity *= (1.0 + strategy_return)
            else:
                equity += (initial_capital * strategy_return)

            equity_curve.append({
                "timestamp": next_row["timestamp"].isoformat(),
                "equity": float(equity),
                "price": float(next_price)
            })

        if position != 0:
            trade_price = float(records[-1]["close"])
            trade_value = equity if position_sizing == "compounding" else initial_capital
            fee_paid = trade_value * total_cost if total_cost > 0 else 0.0
            equity -= fee_paid
            pnl = equity - entry_equity
            trades.append({
                "timestamp": records[-1]["timestamp"].isoformat(),
                "action": "exit",
                "exit_reason": "force_close",
                "price": trade_price,
                "quantity": current_qty,
                "pnl": float(pnl),
                "fees": float(fee_paid),
                "equity_after": float(equity),
                "position_percentage": 0.0
            })

        return equity_curve, trades, active_bars

    def _calculate_pairs_equity_curve(
        self,
        df,
        hedge_ratio,
        position_sizing="fixed",
        position_allocation=1.0,
        initial_capital=10000.0,
        maker_fee=0.0,
        taker_fee=0.0,
        slippage_rate=0.0
    ):
        if df.empty:
            return [], [], 0

        result = df.copy()
        result["timestamp"] = pd.to_datetime(result["timestamp"], utc=True)
        result["close_a"] = pd.to_numeric(result["close_a"], errors="coerce")
        result["close_b"] = pd.to_numeric(result["close_b"], errors="coerce")
        result = result.dropna(subset=["timestamp", "close_a", "close_b"])
        result = result.sort_values("timestamp").reset_index(drop=True)

        if result.empty:
            return [], [], 0

        records = result.to_dict(orient="records")

        beta = float(hedge_ratio if hedge_ratio is not None else 1.0)
        equity = float(initial_capital)
        position = 0
        equity_curve = []
        trades = []
        entry_equity = equity
        active_bars = 0
        current_qty_a = 0.0
        current_qty_b = 0.0

        total_cost = float((maker_fee + taker_fee + slippage_rate) * 2)

        equity_curve.append({
            "timestamp": records[0]["timestamp"].isoformat(),
            "equity": float(equity),
            "price_a": float(records[0]["close_a"]),
            "price_b": float(records[0]["close_b"])
        })

        for i in range(len(records) - 1):
            row = records[i]
            next_row = records[i + 1]

            signal = row.get("signal", "hold")
            current_position = position
            current_exit_reason = "target"

            if signal == "long":
                position = 1
            elif signal == "short":
                position = -1
            elif isinstance(signal, str) and signal.startswith("exit"):
                position = 0
                if "_" in signal:
                    current_exit_reason = signal.split("_", 1)[1]

            if position != 0:
                active_bars += 1

            if position != current_position:
                price_a = float(row["close_a"])
                price_b = float(row["close_b"])
                base_val = equity if position_sizing == "compounding" else initial_capital
                trade_value = base_val * float(position_allocation)

                if current_position != 0:
                    fee_paid = trade_value * total_cost if total_cost > 0 else 0.0
                    equity -= fee_paid
                    pnl = equity - entry_equity

                    trades.append({
                        "timestamp": row["timestamp"].isoformat(),
                        "action": "exit",
                        "exit_reason": current_exit_reason,
                        "price": price_a,
                        "quantity": current_qty_a,
                        "price_b": price_b,
                        "quantity_b": current_qty_b,
                        "pnl": float(pnl),
                        "fees": float(fee_paid),
                        "equity_after": float(equity)
                    })
                    current_qty_a = 0.0
                    current_qty_b = 0.0

                if position != 0:
                    fee_paid = trade_value * total_cost if total_cost > 0 else 0.0
                    equity -= fee_paid
                    entry_equity = equity
                    
                    exposure_factor = 1.0 + abs(beta)
                    alloc_a = trade_value * (1.0 / exposure_factor)
                    alloc_b = trade_value * (abs(beta) / exposure_factor)

                    qty_a_mag = float(alloc_a / price_a) if price_a > 0 else 0.0
                    qty_b_mag = float(alloc_b / price_b) if price_b > 0 else 0.0

                    if position == 1:
                        current_qty_a = qty_a_mag
                        current_qty_b = -qty_b_mag
                    else:
                        current_qty_a = -qty_a_mag
                        current_qty_b = qty_b_mag

                    action_str = "long" if position == 1 else "short"
                    
                    total_exposure_value = (abs(current_qty_a) * price_a) + (abs(current_qty_b) * price_b)
                    position_percentage = (total_exposure_value / equity) * 100 if equity > 0 else 0.0
                    
                    trades.append({
                        "timestamp": row["timestamp"].isoformat(),
                        "action": action_str,
                        "price": price_a,
                        "quantity": current_qty_a,
                        "price_b": price_b,
                        "quantity_b": current_qty_b,
                        "pnl": 0.0,
                        "fees": float(fee_paid),
                        "equity_after": float(equity),
                        "position_percentage": float(position_percentage)
                    })

            price_a = float(row["close_a"])
            next_price_a = float(next_row["close_a"])
            return_a = (next_price_a / price_a) - 1.0 if price_a != 0 else 0.0

            price_b = float(row["close_b"])
            next_price_b = float(next_row["close_b"])
            return_b = (next_price_b / price_b) - 1.0 if price_b != 0 else 0.0

            spread_return = return_a - (beta * return_b)
            total_exposure = 1.0 + abs(beta)

            if total_exposure != 0:
                spread_return /= total_exposure

            strategy_return = position * spread_return * float(position_allocation)
            
            if position_sizing == "compounding":
                equity *= (1.0 + strategy_return)
            else:
                equity += (initial_capital * strategy_return)

            equity_curve.append({
                "timestamp": next_row["timestamp"].isoformat(),
                "equity": float(equity),
                "price_a": float(next_price_a),
                "price_b": float(next_price_b)
            })

        if position != 0:
            price_a = float(records[-1]["close_a"])
            price_b = float(records[-1]["close_b"])
            trade_value = equity if position_sizing == "compounding" else initial_capital
            fee_paid = trade_value * total_cost if total_cost > 0 else 0.0
            equity -= fee_paid
            pnl = equity - entry_equity
            trades.append({
                "timestamp": records[-1]["timestamp"].isoformat(),
                "action": "exit",
                "exit_reason": "force_close",
                "price": price_a,
                "quantity": current_qty_a,
                "price_b": price_b,
                "quantity_b": current_qty_b,
                "pnl": float(pnl),
                "fees": float(fee_paid),
                "equity_after": float(equity),
                "position_percentage": 0.0
            })

        return equity_curve, trades, active_bars
    
    def _calculate_rule_based_equity_curve(
        self,
        df,
        initial_capital=10000.0,
        position_allocation=1.0,
        position_sizing="fixed",
        maker_fee=0.0,
        taker_fee=0.0,
        slippage_rate=0.0
    ):
        if df.empty:
            return [], [], 0

        result = df.copy()
        result["timestamp"] = pd.to_datetime(
            result["timestamp"], utc=True, errors="coerce"
        )
        result["close"] = pd.to_numeric(result["close"], errors="coerce")

        result = (
            result.dropna(subset=["timestamp", "close"])
            .sort_values("timestamp")
            .reset_index(drop=True)
        )

        if result.empty:
            return [], [], 0

        records = result.to_dict(orient="records")

        cash = float(initial_capital)
        quantity = 0.0
        entry_cost_total = 0.0

        equity_curve = []
        trades = []
        sell_signal_handled = False

        total_cost = max(0.0, float(maker_fee) + float(taker_fee) + float(slippage_rate))
        allocation = max(0.0, min(1.0, float(position_allocation)))

        sizing_mode = str(position_sizing or "fixed").lower()
        if sizing_mode not in {"fixed", "compounding"}:
            sizing_mode = "fixed"

        quantity_epsilon = 1e-12

        def calculate_equity(price):
            return cash + quantity * price

        def calculate_position_percentage(price):
            equity = calculate_equity(price)
            if equity <= 0 or quantity <= 0:
                return 0.0
            return (quantity * price / equity) * 100.0

        def add_equity_point(timestamp, price):
            equity_curve.append({
                "timestamp": timestamp.isoformat(),
                "equity": float(calculate_equity(price)),
                "position_percentage": float(calculate_position_percentage(price)),
                "position_active": bool(quantity > quantity_epsilon),
                "price": float(price)
            })

        add_equity_point(records[0]["timestamp"], float(records[0]["close"]))

        for i in range(len(records) - 1):
            row = records[i]
            next_row = records[i + 1]

            price = float(row["close"])
            signal = str(row.get("signal", "hold")).strip().lower()

            if signal != "sell":
                sell_signal_handled = False

            if (signal == "buy" and price > 0 and cash > 0 and quantity <= quantity_epsilon):
                quantity = 0.0
                entry_cost_total = 0.0

                sizing_base = cash if sizing_mode == "compounding" else float(initial_capital)
                requested_value = sizing_base * allocation
                max_value = cash / (1.0 + total_cost)
                trade_value = min(requested_value, max_value)

                if trade_value > 0:
                    fee = trade_value * total_cost
                    total_spend = trade_value + fee
                    bought_quantity = trade_value / price

                    if bought_quantity > 0:
                        cash -= total_spend
                        quantity = bought_quantity
                        entry_cost_total = total_spend

                        equity_after = calculate_equity(price)
                        position_percentage = calculate_position_percentage(price)

                        trades.append({
                            "timestamp": row["timestamp"].isoformat(),
                            "action": "buy",
                            "price": float(price),
                            "quantity": float(bought_quantity),
                            "value": float(trade_value),
                            "percentage": 100.0,
                            "fees": float(fee),
                            "pnl": 0.0,
                            "position_percentage": float(position_percentage),
                            "equity_after": float(equity_after),
                            "position_status": "Active",
                            "exit_reason": None,
                        })

            elif (signal == "sell" and not sell_signal_handled and price > 0 and quantity > quantity_epsilon):
                quantity_before = quantity
                entry_cost_before = entry_cost_total
                sell_quantity = quantity_before

                if sell_quantity > 0:
                    gross_value = sell_quantity * price
                    fee = gross_value * total_cost
                    net_value = gross_value - fee

                    sold_fraction = sell_quantity / quantity_before
                    cost_basis = entry_cost_before * sold_fraction
                    realized_pnl = net_value - cost_basis

                    cash += net_value
                    quantity = quantity_before - sell_quantity
                    entry_cost_total = entry_cost_before - cost_basis

                    if quantity <= quantity_epsilon or sell_quantity >= quantity_before:
                        quantity = 0.0
                        entry_cost_total = 0.0

                    equity_after = calculate_equity(price)
                    position_percentage = calculate_position_percentage(price)
                    is_flat = quantity == 0.0

                    trades.append({
                        "timestamp": row["timestamp"].isoformat(),
                        "action": "sell",
                        "price": float(price),
                        "quantity": float(sell_quantity),
                        "quantity_before": float(quantity_before),
                        "value": float(gross_value),
                        "percentage": 100.0,
                        "fees": float(fee),
                        "pnl": float(realized_pnl),
                        "position_percentage": float(position_percentage),
                        "equity_after": float(equity_after),
                        "position_status": "Flat (Cash)" if is_flat else "Active",
                        "exit_reason": "rule",
                    })
                    sell_signal_handled = True

            next_price = float(next_row["close"])
            add_equity_point(next_row["timestamp"], next_price)

        if quantity > quantity_epsilon:
            final_price = float(records[-1]["close"])
            final_quantity = quantity

            gross_value = final_quantity * final_price
            fee = gross_value * total_cost
            net_value = gross_value - fee

            cost_basis = entry_cost_total
            realized_pnl = net_value - cost_basis

            cash += net_value
            quantity = 0.0
            entry_cost_total = 0.0

            trades.append({
                "timestamp": records[-1]["timestamp"].isoformat(),
                "action": "sell",
                "price": float(final_price),
                "quantity": float(final_quantity),
                "quantity_before": float(final_quantity),
                "value": float(gross_value),
                "percentage": 100.0,
                "fees": float(fee),
                "pnl": float(realized_pnl),
                "position_percentage": 0.0,
                "equity_after": float(cash),
                "position_status": "Flat (Cash)",
                "exit_reason": "force_close",
            })

            if equity_curve:
                equity_curve[-1]["equity"] = float(cash)
                equity_curve[-1]["position_percentage"] = 0.0
                equity_curve[-1]["position_active"] = False

        active_bars = sum(1 for point in equity_curve if point.get("position_active", False))
        return equity_curve, trades, active_bars

    def _filter_equity_curve(self, equity_curve, start_date, end_date):
        if not equity_curve:
            return []

        result = []
        start_timestamp = None
        end_timestamp = None

        if start_date is not None:
            start_timestamp = pd.Timestamp(start_date, tz="UTC")

        if end_date is not None:
            if isinstance(end_date, str) and len(end_date) == 10:
                end_timestamp = pd.Timestamp(end_date, tz="UTC") + pd.Timedelta(days=1)
            elif isinstance(end_date, date) and not isinstance(end_date, datetime):
                end_timestamp = pd.Timestamp(end_date, tz="UTC") + pd.Timedelta(days=1)
            else:
                end_timestamp = pd.Timestamp(end_date, tz="UTC")

        for item in equity_curve:
            timestamp = pd.Timestamp(item["timestamp"])
            if start_timestamp is not None and timestamp < start_timestamp:
                continue
            if end_timestamp is not None and timestamp >= end_timestamp:
                continue
            result.append(item)

        return result

    def _calculate_equity_metrics(self, equity_curve, trades=None, initial_capital=10000.0, active_bars=0):
        if trades is None:
            trades = []

        total_bars = max(len(equity_curve), 1)
        if equity_curve and any(
            "position_active" in point
            for point in equity_curve
        ):
            active_curve_bars = sum(
                1
                for point in equity_curve
                if point.get("position_active", False)
            )

            market_exposure_pct = (active_curve_bars/ total_bars) * 100.0
        else:
            market_exposure_pct = (active_bars/ total_bars) * 100.0

        market_exposure_pct = min(
            100.0,
            max(0.0, market_exposure_pct)
        )

        if not equity_curve:
            return {
                "starting_capital": float(initial_capital),
                "ending_capital": float(initial_capital),
                "total_return": 0.0,
                "total_return_percentage": 0.0,
                "max_drawdown_percentage": 0.0,
                "sharpe_ratio": 0.0,
                "win_rate": 0.0,
                "profit_factor": 0.0,
                "number_of_trades": 0,
                "market_exposure_percentage": 0.0,
                "avg_trade_duration": 0.0,
                "total_fees": 0.0,
                "win_loss_ratio": 0.0,
                "exit_reasons": {}
            }

        equity_values = pd.Series([item["equity"] for item in equity_curve], dtype=float)

        starting_capital = float(equity_curve[0]["equity"])
        ending_capital = float(equity_curve[-1]["equity"])
        total_return = ending_capital - starting_capital
        
        total_return_percentage = 0.0
        if starting_capital != 0:
            total_return_percentage = (total_return / starting_capital) * 100.0

        running_max = equity_values.cummax()
        drawdown = (equity_values - running_max) / running_max
        max_drawdown_percentage = abs(float(drawdown.min())) * 100.0

        sharpe = 0.0
        win_rate = 0.0
        profit_factor = 0.0
        avg_trade_duration = 0.0
        win_loss_ratio = 0.0

        rule_based_trades = [
            t
            for t in trades
            if t.get("action") in {"buy", "sell"}
        ]

        if rule_based_trades:
            closed_trades = [
                t
                for t in rule_based_trades
                if t.get("action") == "sell"
                and t.get("pnl") is not None
            ]
        else:
            closed_trades = [
                t
                for t in trades
                if t.get("action") == "exit"
            ]

        num_trades = len(closed_trades)

        total_fees = sum(t.get("fees", 0.0) for t in trades)

        exit_reasons = {}
        for t in closed_trades:
            reason = t.get("exit_reason", "target")
            exit_reasons[reason] = exit_reasons.get(reason, 0) + 1

        if len(equity_values) > 1:
            ret = equity_values.pct_change().dropna()
            std = ret.std()
            if std != 0: 
                sharpe = float((ret.mean() / std) * np.sqrt(365))

        if num_trades > 0:
            winning_trades = [t for t in closed_trades if t.get("pnl", 0) > 0]
            losing_trades = [t for t in closed_trades if t.get("pnl", 0) < 0]
            win_rate = (len(winning_trades) / num_trades) * 100.0
            
            gross_profit = sum(t.get("pnl", 0) for t in winning_trades)
            gross_loss = abs(sum(t.get("pnl", 0) for t in losing_trades))
            
            if gross_loss > 0:
                profit_factor = float(gross_profit / gross_loss)
            elif gross_profit > 0:
                profit_factor = None

            avg_win = gross_profit / len(winning_trades) if len(winning_trades) > 0 else 0.0
            avg_loss = gross_loss / len(losing_trades) if len(losing_trades) > 0 else 0.0
            if avg_loss > 0:
                win_loss_ratio = avg_win / avg_loss

            if num_trades > 0:
                durations = []

                entry_timestamp = None

                for trade in trades:
                    action = trade.get("action")

                    if action == "buy":
                        entry_timestamp = pd.Timestamp(
                            trade["timestamp"]
                        )

                    elif (
                        action == "sell"
                        and entry_timestamp is not None
                    ):
                        exit_timestamp = pd.Timestamp(
                            trade["timestamp"]
                        )

                        duration = (
                            exit_timestamp
                            - entry_timestamp
                        ).total_seconds()

                        if duration >= 0:
                            durations.append(
                                duration / 3600.0
                            )

                        # Only reset after a complete exit.
                        if trade.get("exit_reason") != "partial_sell":
                            entry_timestamp = None

                if durations:
                    avg_trade_duration = (
                        sum(durations) / len(durations)
                    )

        return {
            "starting_capital": starting_capital,
            "ending_capital": ending_capital,
            "total_return": float(total_return),
            "total_return_percentage": float(total_return_percentage),
            "max_drawdown_percentage": float(max_drawdown_percentage),
            "sharpe_ratio": sharpe,
            "win_rate": win_rate,
            "profit_factor": profit_factor,
            "number_of_trades": num_trades,
            "market_exposure_percentage": float(market_exposure_pct),
            "avg_trade_duration": float(avg_trade_duration),
            "total_fees": float(total_fees),
            "win_loss_ratio": float(win_loss_ratio),
            "exit_reasons": exit_reasons
        }

    def preview_strategy(self, request):
        principle = request.principle

        if (
            request.start_date is not None
            and request.end_date is not None
            and request.start_date > request.end_date
        ):
            raise ValueError("start_date must be before or equal to end_date.")

        if principle == StrategyPrinciple.PAIRS_TRADING:
            if request.crypto2 is None:
                raise ValueError("Pairs Trading requires two cryptocurrencies.")
            if request.crypto1 == request.crypto2:
                raise ValueError("Pairs Trading requires two different cryptocurrencies.")

        schema = self.PARAMETER_SCHEMAS[principle]
        parameters = schema.model_validate(request.parameters)
        max_lookback = self._get_max_lookback(parameters)
        
        user_settings = self.repository.get_settings(user_id=1) or {}
        
        position_sizing = getattr(request, "position_sizing", "fixed")
        position_allocation = float(getattr(request, "position_allocation", 1.0))
        initial_capital = float(getattr(request, "initial_capital", self.STARTING_CAPITAL))
        maker_fee = float(user_settings.get("maker_fee", 0.0)) / 100.0
        taker_fee = float(user_settings.get("taker_fee", 0.0)) / 100.0
        slippage_rate = float(user_settings.get("slippage", 0.0)) / 100.0
        
        if request.timeframe == "1m" and request.start_date and request.end_date:
            end_ts = pd.to_datetime(request.end_date, utc=True)
            start_ts = pd.to_datetime(request.start_date, utc=True)
            if (end_ts - start_ts).total_seconds() / 60 > 10080:
                request.start_date = (end_ts - pd.Timedelta(minutes=10080)).to_pydatetime().replace(tzinfo=None)
        
        calculation_start_date = self._calculate_warmup_start(
            start_date=request.start_date,
            timeframe=request.timeframe,
            lookback=max_lookback
        )

        if principle in {StrategyPrinciple.MEAN_REVERSION, StrategyPrinciple.TREND_FOLLOWING, StrategyPrinciple.RULE_BASED}:
            raw_data = self.market_data_repository.get_market_data_one_currency(
                crypto=request.crypto1,
                timeframe=request.timeframe,
                start_date=calculation_start_date,
                end_date=request.end_date,
            )

            if not raw_data:
                raise ValueError("No market data found.")

            df = pd.DataFrame(raw_data)
            df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
            numeric_columns = ["open", "high", "low", "close", "volume"]

            for column in numeric_columns:
                df[column] = pd.to_numeric(df[column], errors="coerce")

            df = df.dropna(subset=numeric_columns)

            if df.empty:
                raise ValueError("No valid market data found.")

            strategy = self.STRATEGIES[principle]
            result = strategy.run(df, parameters)
            result = self._filter_requested_range(result, request.start_date, request.end_date)

            if principle == StrategyPrinciple.RULE_BASED:
                equity_curve, trades, active_bars = (
                    self._calculate_rule_based_equity_curve(
                        result,
                        initial_capital=initial_capital,
                        position_allocation=position_allocation,
                        position_sizing=position_sizing,
                        maker_fee=maker_fee,
                        taker_fee=taker_fee,
                        slippage_rate=slippage_rate
                    )
                )
            else:
                equity_curve, trades, active_bars = (
                    self._calculate_single_asset_equity_curve(
                        result,
                        position_sizing=position_sizing,
                        position_allocation=position_allocation,
                        initial_capital=initial_capital,
                        maker_fee=maker_fee,
                        taker_fee=taker_fee,
                        slippage_rate=slippage_rate
                    )
                )
            
            if result.empty:
                raise ValueError("No market data found in the requested date range.")

            return self._format_single_asset_result(
                result, request, parameters, equity_curve, trades, initial_capital=initial_capital, active_bars=active_bars
            )

        if principle == StrategyPrinciple.PAIRS_TRADING:
            data_a, data_b = self.market_data_repository.get_pair_market_data(
                crypto1=request.crypto1,
                crypto2=request.crypto2,
                timeframe=request.timeframe,
                start_date=calculation_start_date,
                end_date=request.end_date,
            )

            if not data_a or not data_b:
                raise ValueError("Market data is missing for one or both assets.")

            df_a = pd.DataFrame(data_a)
            df_b = pd.DataFrame(data_b)

            df_a["timestamp"] = pd.to_datetime(df_a["timestamp"], utc=True)
            df_b["timestamp"] = pd.to_datetime(df_b["timestamp"], utc=True)

            df = pd.merge(
                df_a[["timestamp", "close"]],
                df_b[["timestamp", "close"]],
                on="timestamp", how="inner", suffixes=("_a", "_b")
            )
            df = df.dropna()

            if len(df) < 20:
                raise ValueError("Not enough overlapping market data between the two pairs.")

            strategy = self.STRATEGIES[principle]
            result, hedge_ratio, intercept = strategy.run(df, parameters)
            result = self._filter_requested_range(result, request.start_date, request.end_date)
            
            cointegration_pvalue = None
            if getattr(parameters, "use_cointegration", False):
                cointegration_pvalue = IndicatorService.calculate_cointegration_pvalue(result)

            equity_curve, trades, active_bars = self._calculate_pairs_equity_curve(
                result,
                hedge_ratio,
                position_sizing=position_sizing,
                position_allocation=position_allocation,
                initial_capital=initial_capital,
                maker_fee=maker_fee,
                taker_fee=taker_fee,
                slippage_rate=slippage_rate
            )
            
            if result.empty:
                raise ValueError("No market data found in the requested date range.")

            return self._format_pair_result(
                result, request, parameters, hedge_ratio, intercept, cointegration_pvalue, equity_curve, trades, initial_capital=initial_capital, active_bars=active_bars
            )

        raise ValueError(f"Unsupported principle: {principle}")

    def _calculate_signal_metrics(self, df):
        if df is None or df.empty:
            return {
                "total_signals": 0,
                "buy_count": 0,
                "sell_count": 0,
                "buy_signal_frequency": 0.0,
                "sell_signal_frequency": 0.0,
                "buy_percentage": 0.0,
                "sell_percentage": 0.0
            }

        if "signal" not in df.columns:
            return {
                "total_signals": 0,
                "buy_count": 0,
                "sell_count": 0,
                "buy_signal_frequency": 0.0,
                "sell_signal_frequency": 0.0,
                "buy_percentage": 0.0,
                "sell_percentage": 0.0
            }

        signals = (
            df["signal"]
            .fillna("hold")
            .astype(str)
            .str.strip()
            .str.lower()
        )

        buy_mask = signals == "buy"
        sell_mask = signals == "sell"

        buy_count = int(buy_mask.sum())
        sell_count = int(sell_mask.sum())

        total_signals = buy_count + sell_count

        if total_signals > 0:
            buy_signal_frequency = (
                buy_count / total_signals
            ) * 100.0

            sell_signal_frequency = (
                sell_count / total_signals
            ) * 100.0
        else:
            buy_signal_frequency = 0.0
            sell_signal_frequency = 0.0

        # Order size is fixed by the execution rules: every BUY uses the
        # configured allocation, and every SELL closes the full position.
        buy_percentage = 100.0 if buy_count > 0 else 0.0
        sell_percentage = 100.0 if sell_count > 0 else 0.0

        return {
            "total_signals": total_signals,

            "buy_count": buy_count,

            "sell_count": sell_count,

            "buy_signal_frequency": float(
                buy_signal_frequency
            ),

            "sell_signal_frequency": float(
                sell_signal_frequency
            ),

            "buy_percentage": float(
                buy_percentage
            ),

            "sell_percentage": float(
                sell_percentage
            )
        }

    def _format_single_asset_result(self, df, request, parameters, equity_curve, trades=None, is_backtest=False, initial_capital=10000.0, active_bars=0):
        equity_metrics = self._calculate_equity_metrics(equity_curve, trades, initial_capital=initial_capital, active_bars=active_bars)
        signal_metrics = self._calculate_signal_metrics(df)

        if is_backtest:
            data = []
            if len(equity_curve) > 2000:
                step = max(1, len(equity_curve) // 2000)
                sampled_curve = equity_curve[::step]
                if sampled_curve[-1]["timestamp"] != equity_curve[-1]["timestamp"]:
                    sampled_curve.append(equity_curve[-1])
                equity_curve = sampled_curve
        else:
            columns_to_keep = ["timestamp", "open", "high", "low", "close", "volume", "signal"]
            if "trend" in df.columns:
                columns_to_keep.append("trend")
                
            # Allow any requested indicators to be passed back to the frontend
            possible_indicators = [
                "bb_middle", "bb_upper", "bb_lower", "rsi", "z_score", "vwap", 
                "trend_sma", "short_ma", "long_ma", "triple_ma_fast", "triple_ma_medium", 
                "triple_ma_slow", "macd", "macd_signal", "macd_histogram", "adx", 
                "plus_di", "minus_di", "donchian_upper", "donchian_lower", "donchian_middle", 
                "atr_upper", "atr_lower", "ma_exit_line"
            ]
            for col in possible_indicators:
                if col in df.columns:
                    columns_to_keep.append(col)

            export_cols = [c for c in columns_to_keep if c in df.columns]
            export_df = df[export_cols].copy()
            export_df["timestamp"] = export_df["timestamp"].apply(lambda x: x.isoformat())
            export_df = export_df.replace({np.nan: None})
            data = export_df.to_dict(orient="records")

        return {
            "principle": request.principle.value if hasattr(request.principle, "value") else request.principle,
            "crypto1": request.crypto1,
            "crypto2": getattr(request, "crypto2", None),
            "timeframe": request.timeframe,
            "start_date": request.start_date.isoformat() if request.start_date is not None else None,
            "end_date": request.end_date.isoformat() if request.end_date is not None else None,
            "parameters": self._get_enabled_parameters(request.principle, parameters),
            "metrics": {
                **equity_metrics,
                **signal_metrics
            },
            "data": data,
            "equity_curve": equity_curve,
            "trades": trades or []
        }
        
    def _format_pair_result(self, df, request, parameters, hedge_ratio, intercept, cointegration_pvalue, equity_curve, trades=None, is_backtest=False, initial_capital=10000.0, active_bars=0):
        equity_metrics = self._calculate_equity_metrics(equity_curve, trades, initial_capital=initial_capital, active_bars=active_bars)

        if is_backtest:
            data = []
            if len(equity_curve) > 2000:
                step = max(1, len(equity_curve) // 2000)
                sampled_curve = equity_curve[::step]
                if sampled_curve[-1]["timestamp"] != equity_curve[-1]["timestamp"]:
                    sampled_curve.append(equity_curve[-1])
                equity_curve = sampled_curve
        else:
            use_zscore = getattr(parameters, "use_zscore", False)
            use_stop = getattr(parameters, "use_stop_loss", False)

            export_df = df.copy()
            export_df["timestamp"] = export_df["timestamp"].apply(lambda x: x.isoformat())

            if use_zscore and "z_score" in export_df.columns:
                export_df["upper_band"] = getattr(parameters, "zscore_short_entry", None)
                export_df["lower_band"] = getattr(parameters, "zscore_long_entry", None)
                export_df["exit_band"] = getattr(parameters, "zscore_exit", None)
            else:
                export_df["upper_band"] = None
                export_df["lower_band"] = None
                export_df["exit_band"] = None

            if use_stop and hasattr(parameters, "zscore_stop_loss"):
                export_df["stop_upper"] = float(getattr(parameters, "zscore_stop_loss", 3.5))
                export_df["stop_lower"] = -float(getattr(parameters, "zscore_stop_loss", 3.5))
            else:
                export_df["stop_upper"] = None
                export_df["stop_lower"] = None

            for col in ["spread", "normalized_a", "normalized_b", "z_score", "rolling_correlation"]:
                if col not in export_df.columns:
                    export_df[col] = None

            columns_to_keep = [
                "timestamp", "close_a", "close_b", "normalized_a", "normalized_b", 
                "spread", "z_score", "rolling_correlation", 
                "upper_band", "lower_band", "exit_band", "stop_upper", "stop_lower", "signal"
            ]

            export_df = export_df[columns_to_keep]
            export_df = export_df.replace({np.nan: None})
            data = export_df.to_dict(orient="records")

        latest_correlation = None
        if getattr(parameters, "use_correlation", False) and len(df) > 0 and "rolling_correlation" in df.columns:
            val = df["rolling_correlation"].iloc[-1]
            if pd.notna(val):
                latest_correlation = float(val)

        return {
            "principle": request.principle.value if hasattr(request.principle, "value") else request.principle,
            "crypto1": request.crypto1,
            "crypto2": request.crypto2,
            "timeframe": request.timeframe,
            "start_date": request.start_date.isoformat() if request.start_date is not None else None,
            "end_date": request.end_date.isoformat() if request.end_date is not None else None,
            "parameters": self._get_enabled_parameters(request.principle, parameters),
            "metrics": {
                "hedge_ratio": float(hedge_ratio) if hedge_ratio is not None else None,
                "intercept": float(intercept) if intercept is not None else None,
                "rolling_correlation": latest_correlation,
                "cointegration_pvalue": float(cointegration_pvalue) if cointegration_pvalue is not None else None,
                **equity_metrics
            },
            "data": data,
            "equity_curve": equity_curve,
            "trades": trades or []
        }
        
    def run_backtest(self, request):
        saved_strategy = self.repository.get_strategy_by_id(request.strategy_id)

        if not saved_strategy:
            raise ValueError("Strategy not found.")

        principle = StrategyPrinciple(saved_strategy["principle"])
        schema = self.PARAMETER_SCHEMAS[principle]
        parameters = schema.model_validate(saved_strategy["parameters"])

        crypto1 = saved_strategy.get("crypto1")
        crypto2 = saved_strategy.get("crypto2")
        timeframe = saved_strategy.get("timeframe")

        if request.train_start_date >= request.train_end_date:
            raise ValueError(
                "Training start date must be before training end date."
            )

        if request.test_start_date >= request.test_end_date:
            raise ValueError(
                "Testing start date must be before testing end date."
            )

        if request.train_end_date > request.test_start_date:
            raise ValueError(
                "Training and testing periods may not overlap."
            )

        if principle == StrategyPrinciple.PAIRS_TRADING:
            if crypto2 is None:
                raise ValueError(
                    "Pairs Trading requires two cryptocurrencies."
                )

            if crypto1 == crypto2:
                raise ValueError(
                    "Pairs Trading requires two different cryptocurrencies."
                )
        user_settings = self.repository.get_settings(user_id=1) or {}
        
        position_sizing = getattr(request, "position_sizing", "fixed")
        position_allocation = float(getattr(request, "position_allocation", 1.0))
        initial_capital = float(getattr(request, "initial_capital", self.STARTING_CAPITAL))
        maker_fee = float(user_settings.get("maker_fee", 0.0)) / 100.0
        taker_fee = float(user_settings.get("taker_fee", 0.0)) / 100.0
        slippage_rate = float(user_settings.get("slippage", 0.0)) / 100.0

        train_result = self._run_backtest_period(
            principle=principle,
            parameters=parameters,
            crypto1=crypto1,
            crypto2=crypto2,
            timeframe=timeframe,
            start_date=request.train_start_date,
            end_date=request.train_end_date,
            position_sizing=position_sizing,
            position_allocation=position_allocation,
            initial_capital=initial_capital,
            maker_fee=maker_fee,
            taker_fee=taker_fee,
            slippage_rate=slippage_rate
        )
        
        test_result = self._run_backtest_period(
            principle=principle,
            parameters=parameters,
            crypto1=crypto1,
            crypto2=crypto2,
            timeframe=timeframe,
            start_date=request.test_start_date,
            end_date=request.test_end_date,
            position_sizing=position_sizing,
            position_allocation=position_allocation,
            initial_capital=initial_capital,
            maker_fee=maker_fee,
            taker_fee=taker_fee,
            slippage_rate=slippage_rate
        )

        combined_result = self._run_backtest_period(
            principle=principle,
            parameters=parameters,
            crypto1=crypto1,
            crypto2=crypto2,
            timeframe=timeframe,
            start_date=request.train_start_date,
            end_date=request.test_end_date,
            position_sizing=position_sizing,
            position_allocation=position_allocation,
            initial_capital=initial_capital,
            maker_fee=maker_fee,
            taker_fee=taker_fee,
            slippage_rate=slippage_rate
        )

        result_snapshot = {
            "training": train_result,
            "testing": test_result,
            "combined": combined_result
        }

        all_trades = combined_result.get("trades") or []

        backtest_id = self.repository.save_backtest_execution(
            strategy_id=request.strategy_id,
            crypto1=crypto1,
            crypto2=crypto2,
            start_time=request.train_start_date,
            end_time=request.test_end_date,
            parameters=self._get_enabled_parameters(
                principle,
                parameters
            ),
            trades=all_trades,
            initial_capital=initial_capital,
            position_sizing=position_sizing,
            position_allocation=position_allocation,
            maker_fee=maker_fee,
            taker_fee=taker_fee,
            slippage_rate=slippage_rate,
            result_snapshot=result_snapshot
        )

        return {
            "backtest_id": backtest_id,
            "strategy": {
                "id": saved_strategy["id"],
                "title": saved_strategy["title"],
                "principle": saved_strategy["principle"],
                "principle_title": saved_strategy.get(
                    "principle_title",
                    saved_strategy["principle"]
                )
            },
            "parameters": self._get_enabled_parameters(
                principle,
                parameters
            ),
            "settings": {
                "initial_capital": initial_capital,
                "position_sizing": position_sizing,
                "position_allocation": position_allocation,
                "maker_fee": maker_fee,
                "taker_fee": taker_fee,
                "slippage_rate": slippage_rate
            },
            "training": train_result,
            "testing": test_result,
            "combined": combined_result
        }
    
    def _run_backtest_period(
        self,
        principle,
        parameters,
        crypto1,
        crypto2,
        timeframe,
        start_date,
        end_date,
        position_sizing="fixed",
        position_allocation=1.0,
        initial_capital=10000.0,
        maker_fee=0.0,
        taker_fee=0.0,
        slippage_rate=0.0
    ):
        max_lookback = self._get_max_lookback(parameters)
        calculation_start_date = self._calculate_warmup_start(
            start_date=start_date,
            timeframe=timeframe,
            lookback=max_lookback
        )

        if principle in {StrategyPrinciple.MEAN_REVERSION, StrategyPrinciple.TREND_FOLLOWING}:
            raw_data = self.market_data_repository.get_market_data_one_currency(
                crypto=crypto1,
                timeframe=timeframe,
                start_date=calculation_start_date,
                end_date=end_date
            )

            if not raw_data:
                raise ValueError("No market data found.")

            df = pd.DataFrame(raw_data)
            df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
            numeric_columns = ["open", "high", "low", "close", "volume"]

            for column in numeric_columns:
                df[column] = pd.to_numeric(df[column], errors="coerce")

            df = df.dropna(subset=numeric_columns)

            if df.empty:
                raise ValueError("No valid market data found.")

            strategy = self.STRATEGIES[principle]
            result = strategy.run(df, parameters)
            result = self._filter_requested_range(result, start_date, end_date)
            
            equity_curve, trades, active_bars = self._calculate_single_asset_equity_curve(
                result,
                position_sizing=position_sizing,
                position_allocation=position_allocation,
                initial_capital=initial_capital,
                maker_fee=maker_fee,
                taker_fee=taker_fee,
                slippage_rate=slippage_rate
            )
            
            return self._format_single_asset_result(
                result,
                type("BacktestPeriod", (), {
                    "principle": principle, "crypto1": crypto1, "crypto2": crypto2,
                    "timeframe": timeframe, "start_date": start_date, "end_date": end_date
                })(),
                parameters, equity_curve, trades, is_backtest=True, initial_capital=initial_capital, active_bars=active_bars
            )

        if principle == StrategyPrinciple.PAIRS_TRADING:
            data_a, data_b = self.market_data_repository.get_pair_market_data(
                crypto1=crypto1,
                crypto2=crypto2,
                timeframe=timeframe,
                start_date=calculation_start_date,
                end_date=end_date
            )

            if not data_a or not data_b:
                raise ValueError("Market data is missing for one or both assets.")

            df_a = pd.DataFrame(data_a)
            df_b = pd.DataFrame(data_b)

            df_a["timestamp"] = pd.to_datetime(df_a["timestamp"], utc=True)
            df_b["timestamp"] = pd.to_datetime(df_b["timestamp"], utc=True)

            df = pd.merge(
                df_a[["timestamp", "close"]],
                df_b[["timestamp", "close"]],
                on="timestamp", how="inner", suffixes=("_a", "_b")
            )
            df = df.dropna()

            if len(df) < 20:
                raise ValueError("Not enough overlapping market data between the two pairs.")

            strategy = self.STRATEGIES[principle]
            result, hedge_ratio, intercept = strategy.run(df, parameters)
            result = self._filter_requested_range(result, start_date, end_date)
            
            cointegration_pvalue = None
            if getattr(parameters, "use_cointegration", False):
                cointegration_pvalue = IndicatorService.calculate_cointegration_pvalue(result)

            equity_curve, trades, active_bars = self._calculate_pairs_equity_curve(
                result,
                hedge_ratio,
                position_sizing=position_sizing,
                position_allocation=position_allocation,
                initial_capital=initial_capital,
                maker_fee=maker_fee,
                taker_fee=taker_fee,
                slippage_rate=slippage_rate
            )
            
            period_request = type("BacktestPeriod", (), {
                "principle": principle, "crypto1": crypto1, "crypto2": crypto2,
                "timeframe": timeframe, "start_date": start_date, "end_date": end_date
            })()

            return self._format_pair_result(
                result, period_request, parameters, hedge_ratio, intercept,
                cointegration_pvalue, equity_curve, trades, is_backtest=True, initial_capital=initial_capital, active_bars=active_bars
            )
    
        if principle == StrategyPrinciple.RULE_BASED:

            raw_data = self.market_data_repository.get_market_data_one_currency(
                crypto=crypto1,
                timeframe=timeframe,
                start_date=calculation_start_date,
                end_date=end_date
            )

            if not raw_data:
                raise ValueError("No market data found.")

            df = pd.DataFrame(raw_data)

            df["timestamp"] = pd.to_datetime(
                df["timestamp"],
                utc=True
            )

            numeric_columns = [
                "open",
                "high",
                "low",
                "close",
                "volume"
            ]

            for column in numeric_columns:
                df[column] = pd.to_numeric(
                    df[column],
                    errors="coerce"
                )

            df = df.dropna(
                subset=numeric_columns
            )

            if df.empty:
                raise ValueError(
                    "No valid market data found."
                )

            strategy = self.STRATEGIES[principle]

            result = strategy.run(df,parameters)
            
            result = self._filter_requested_range(result,start_date,end_date)

            equity_curve, trades, active_bars = (
                self._calculate_rule_based_equity_curve(
                    result,
                    initial_capital=initial_capital,
                    position_allocation=position_allocation,
                    position_sizing=position_sizing,
                    maker_fee=maker_fee,
                    taker_fee=taker_fee,
                    slippage_rate=slippage_rate
                )
            )

            return self._format_single_asset_result(
                result,
                type(
                    "BacktestPeriod",
                    (),
                    {
                        "principle": principle,
                        "crypto1": crypto1,
                        "crypto2": crypto2,
                        "timeframe": timeframe,
                        "start_date": start_date,
                        "end_date": end_date
                    }
                )(),
                parameters,
                equity_curve,
                trades,
                is_backtest=True,
                initial_capital=initial_capital,
                active_bars=active_bars
            )
            
        raise ValueError(f"Unsupported principle: {principle}")
    
    def get_backtest_history(self, strategy_id: int | None = None):
        return self.repository.get_backtest_history(strategy_id)


    def get_backtest_execution(self, backtest_id: int):
        backtest = self.repository.get_backtest_by_id(backtest_id)

        if not backtest:
            return None

        snapshot = backtest.get("result_snapshot")

        if isinstance(snapshot, str):
            snapshot = json.loads(snapshot)

        backtest["result_snapshot"] = snapshot or {}

        strategy_snapshot = backtest.get("strategy_snapshot")

        if isinstance(strategy_snapshot, str):
            strategy_snapshot = json.loads(strategy_snapshot)

        backtest["strategy_snapshot"] = strategy_snapshot or {}

        return backtest