from datetime import date
import json
from sqlalchemy import text
from database import engine
import math

class StrategyRepository:
    def get_settings(self, user_id: int = 1):
        query = text("SELECT * FROM settings WHERE user_id = :user_id")
        with engine.connect() as connection:
            row = connection.execute(query, {"user_id": user_id}).mappings().first()
        return dict(row) if row else {}

    # 2. Scrub pandas NaN/Infinity values to safely insert into Postgres
    def _safe_float(self, value):
        if value is None:
            return None
        try:
            val = float(value)
            if math.isnan(val) or math.isinf(val):
                return None
            return val
        except (ValueError, TypeError):
            return None
        
    def save_backtest_execution(
        self, strategy_id: int, crypto1: int, crypto2: int | None, start_time: date,
        end_time: date, parameters: dict, trades: list, initial_capital: float,
        position_sizing: str, position_allocation: float, maker_fee: float,
        taker_fee: float, slippage_rate: float, result_snapshot: dict
    ):
        combined = result_snapshot.get("combined") or {}
        metrics = combined.get("metrics") or {}
        equity_curve = combined.get("equity_curve") or []

        final_capital = None
        if equity_curve:
            final_capital = equity_curve[-1].get("equity")

        if final_capital is None:
            final_capital = initial_capital + float(metrics.get("total_return") or 0)

        query_bt = text("""
            INSERT INTO backtests (
                strategy_id, instrument_id, instrument2_id, start_time, end_time,
                strategy_snapshot, created_at, initial_capital, final_capital,
                total_pnl, win_rate, max_drawdown, profit_factor, sharpe_ratio, trade_count,
                position_sizing, position_allocation, maker_fee, taker_fee,
                slippage_rate, result_snapshot
            )
            VALUES (
                :strategy_id, :crypto1, :crypto2, :start_time, :end_time,
                CAST(:parameters AS jsonb), NOW(), :initial_capital, :final_capital,
                :total_pnl, :win_rate, :max_drawdown, :profit_factor, :sharpe_ratio, :trade_count,
                :position_sizing, :position_allocation, :maker_fee, :taker_fee,
                :slippage_rate, CAST(:result_snapshot AS jsonb)
            )
            RETURNING id
        """)

        with engine.begin() as connection:
            res = connection.execute(query_bt, {
                "strategy_id": strategy_id,
                "crypto1": crypto1,
                "crypto2": crypto2,
                "start_time": start_time,
                "end_time": end_time,
                "parameters": json.dumps({
                    "parameters": parameters,
                    "position_sizing": position_sizing,
                    "position_allocation": position_allocation,
                    "initial_capital": initial_capital,
                    "maker_fee": maker_fee,
                    "taker_fee": taker_fee,
                    "slippage_rate": slippage_rate
                }, default=str),
                "initial_capital": initial_capital,
                "final_capital": final_capital,
                "total_pnl": metrics.get("total_return"),
                "win_rate": metrics.get("win_rate"),
                "max_drawdown": metrics.get("max_drawdown_percentage"),
                
                "profit_factor": self._safe_float(metrics.get("profit_factor")),
                "sharpe_ratio": self._safe_float(metrics.get("sharpe_ratio")),
                
                "trade_count": len(trades or []),
                "position_sizing": position_sizing,
                "position_allocation": position_allocation,
                "maker_fee": maker_fee,
                "taker_fee": taker_fee,
                "slippage_rate": slippage_rate,
                "result_snapshot": json.dumps(result_snapshot, default=str)
            })

            backtest_id = res.fetchone()[0]

            if trades:
                trade_records = [{
                    "backtest_id": backtest_id, "timestamp": trade["timestamp"],
                    "action": trade["action"], "price": trade["price"],
                    "quantity": trade.get("quantity"), "pnl": trade.get("pnl"),
                    "fees": trade.get("fees", 0), "equity_after": trade["equity_after"]
                } for trade in trades]

                query_trades = text("""
                    INSERT INTO backtest_trades (
                        backtest_id, timestamp, action, price, quantity, pnl, fees, equity_after
                    ) VALUES (
                        :backtest_id, :timestamp, :action, :price, :quantity, :pnl, :fees, :equity_after
                    )
                """)
                connection.execute(query_trades, trade_records)

        return backtest_id
    
    def get_backtest_history(self, strategy_id: int | None = None):
        query = text("""
            SELECT
                b.id,
                b.strategy_id,
                s.title AS strategy_title,
                b.instrument_id,
                i.symbol AS instrument_symbol,
                b.instrument2_id,
                i2.symbol AS instrument2_symbol,
                b.start_time,
                b.end_time,
                b.created_at,
                b.initial_capital,
                b.final_capital,
                b.total_pnl,
                b.win_rate,
                b.max_drawdown,
                b.profit_factor,
                b.sharpe_ratio,
                b.trade_count,
                b.position_sizing,
                b.position_allocation,
                b.maker_fee,
                b.taker_fee,
                b.slippage_rate
            FROM backtests b
            JOIN strategies s ON s.id = b.strategy_id
            JOIN instruments i ON i.id = b.instrument_id
            LEFT JOIN instruments i2 ON i2.id = b.instrument2_id
            WHERE (b.strategy_id = :strategy_id)
            ORDER BY b.created_at DESC, b.id DESC
        """)

        with engine.connect() as connection:
            rows = connection.execute(
                query,
                {"strategy_id": strategy_id}
            ).mappings().all()

        return [dict(row) for row in rows]


    def get_backtest_by_id(self, backtest_id: int):
        query = text("""
            SELECT
                b.id,
                b.strategy_id,
                s.title AS strategy_title,
                b.instrument_id,
                i.symbol AS instrument_symbol,
                b.instrument2_id,
                i2.symbol AS instrument2_symbol,
                b.start_time,
                b.end_time,
                b.created_at,
                b.initial_capital,
                b.final_capital,
                b.total_pnl,
                b.win_rate,
                b.max_drawdown,
                b.profit_factor,
                b.sharpe_ratio,
                b.trade_count,
                b.position_sizing,
                b.position_allocation,
                b.maker_fee,
                b.taker_fee,
                b.slippage_rate,
                b.strategy_snapshot,
                b.result_snapshot
            FROM backtests b
            JOIN strategies s ON s.id = b.strategy_id
            JOIN instruments i ON i.id = b.instrument_id
            LEFT JOIN instruments i2 ON i2.id = b.instrument2_id
            WHERE b.id = :backtest_id
        """)

        with engine.connect() as connection:
            row = connection.execute(
                query,
                {"backtest_id": backtest_id}
            ).mappings().first()

        return dict(row) if row else None

    def create_strategy(self, user_id: int, title: str, crypto1: int, crypto2: int | None, timeframe: str, principle: str, start_date: date, split: float, parameters: dict):
        query = text("""
            INSERT INTO strategies (
                user_id, title, instrument_id, instrument2_id, timeframe, principle, start_date, split, parameters
            ) VALUES (
                :user_id, :title, :crypto1, :crypto2, :timeframe, :principle, :start_date, :split, CAST(:parameters AS jsonb)
            ) RETURNING id
        """)
        with engine.begin() as connection:
            result = connection.execute(query, {
                "user_id": user_id, "title": title, "crypto1": crypto1, "crypto2": crypto2,
                "timeframe": timeframe, "principle": principle, "start_date": start_date,
                "split": split, "parameters": json.dumps(parameters)
            })
            row = result.fetchone()
        if row is None:
            raise ValueError(f"Failed to create strategy '{title}'.")
        return self.get_strategy_by_id(row.id)

    def delete_strategy(self, strategy_id: int):
        query = text("DELETE FROM backtests WHERE strategy_id = :strategy_id; DELETE FROM strategies WHERE id = :strategy_id RETURNING id")
        with engine.begin() as connection:
            result = connection.execute(query, {"strategy_id": strategy_id})
            row = result.fetchone()
        if row is None:
            raise ValueError(f"Strategy with id {strategy_id} was not found.")
        return {"id": row.id}
        
    def edit_strategy(self, strategy_id: int, user_id: int, title: str, crypto1: int, crypto2: int | None, timeframe: str, principle: str, start_date: date, split: float, parameters: dict):
        query = text("""
            UPDATE strategies SET
                user_id = :user_id, title = :title, instrument_id = :crypto1, instrument2_id = :crypto2,
                timeframe = :timeframe, principle = :principle, start_date = :start_date, split = :split,
                parameters = CAST(:parameters AS jsonb), updated_at = NOW()
            WHERE id = :strategy_id RETURNING id
        """)
        with engine.begin() as connection:
            result = connection.execute(query, {
                "strategy_id": strategy_id, "user_id": user_id, "title": title, "crypto1": crypto1,
                "crypto2": crypto2, "timeframe": timeframe, "principle": principle,
                "start_date": start_date, "split": split, "parameters": json.dumps(parameters)
            })
            row = result.fetchone()
        if row is None:
            raise ValueError(f"Strategy with id {strategy_id} was not found.")
        return self.get_strategy_by_id(strategy_id)

    def get_strategies(self):
        query = text("""
            SELECT s.id, s.user_id, s.principle, p.title AS title, s.title, s.instrument_id AS crypto1,
                   s.instrument2_id AS crypto2, s.timeframe, s.start_date, s.split, s.parameters,
                   s.created_at, s.updated_at
            FROM strategies s LEFT JOIN principles p ON p.key = s.principle
            ORDER BY s.title ASC, s.id ASC
        """)
        with engine.connect() as connection:
            result = connection.execute(query)
            return [dict(row._mapping) for row in result]

    def get_strategy_by_id(self, strategy_id: int):
        query = text("""
            SELECT s.id, s.user_id, s.principle, p.title AS title, s.title, s.instrument_id AS crypto1,
                   s.instrument2_id AS crypto2, s.timeframe, s.start_date, s.split, s.parameters,
                   s.created_at, s.updated_at
            FROM strategies s LEFT JOIN principles p ON p.key = s.principle
            WHERE s.id = :strategy_id
        """)
        with engine.connect() as connection:
            result = connection.execute(query, {"strategy_id": strategy_id})
            row = result.fetchone()
        if row is None:
            raise ValueError(f"Strategy with id {strategy_id} was not found.")
        return dict(row._mapping)