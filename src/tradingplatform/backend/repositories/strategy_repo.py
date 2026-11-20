from datetime import date
import json
from sqlalchemy import text
from database import engine
import math

from domain_models.strategy_entity import StrategyEntity

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
            SELECT s.id, s.user_id, s.principle, p.title AS principle_title, s.title, s.instrument_id AS crypto1,
                   s.instrument2_id AS crypto2, s.timeframe, s.start_date, s.split, s.parameters,
                   s.created_at, s.updated_at
            FROM strategies s LEFT JOIN principles p ON p.key = s.principle
            ORDER BY s.title ASC, s.id ASC
        """)
        with engine.connect() as connection:
            result = connection.execute(query)
            return [StrategyEntity.from_dict(dict(row._mapping)) for row in result]

    def get_strategy_by_id(self, strategy_id: int):
        query = text("""
            SELECT s.id, s.user_id, s.principle, p.title AS principle_title, s.title, s.instrument_id AS crypto1,
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
        return StrategyEntity.from_dict(dict(row._mapping))