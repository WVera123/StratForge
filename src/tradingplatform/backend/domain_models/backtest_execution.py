from dataclasses import dataclass, field
from datetime import date, datetime
import json
from typing import Any

from .trade import Trade


@dataclass
class BacktestExecution:
    id: int
    strategy_id: int
    created_at: datetime
    train_start_date: date
    train_end_date: date
    test_start_date: date
    test_end_date: date
    initial_capital: float
    metrics: dict[str, Any] = field(default_factory=dict)
    equity_curve: list[dict[str, Any]] = field(default_factory=list)
    trades: list[Trade] = field(default_factory=list)
    extra: dict[str, Any] = field(default_factory=dict)

    @staticmethod
    def _parse_json(value):
        if value is None:
            return {}
        if isinstance(value, str):
            return json.loads(value)
        return value

    @staticmethod
    def _parse_datetime(value):
        if value is None:
            return None
        if isinstance(value, datetime):
            return value
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))

    @staticmethod
    def _parse_date(value):
        if value is None:
            return None
        if isinstance(value, datetime):
            return value.date()
        if isinstance(value, date):
            return value
        return date.fromisoformat(str(value)[:10])

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        start_time = data.get("start_time")
        end_time = data.get("end_time")

        result_snapshot = cls._parse_json(data.get("result_snapshot"))
        strategy_snapshot = cls._parse_json(data.get("strategy_snapshot"))

        combined = result_snapshot.get("combined") or {}
        metrics = combined.get("metrics") or data.get("metrics") or {}
        equity_curve = combined.get("equity_curve") or data.get("equity_curve") or []

        trades = []
        raw_trades = data.get("trades") or combined.get("trades") or []
        for trade_data in raw_trades:
            trades.append(Trade.from_dict(trade_data, int(data["id"])))

        excluded = {
            "id", "strategy_id", "created_at",
            "initial_capital", "metrics", "equity_curve", "trades",
            "result_snapshot", "strategy_snapshot",
        }

        return cls(
            id=int(data["id"]),
            strategy_id=int(data["strategy_id"]),
            created_at=cls._parse_datetime(data.get("created_at")),
            train_start_date=cls._parse_date(data.get("train_start_date") or start_time),
            train_end_date=cls._parse_date(data.get("train_end_date") or start_time),
            test_start_date=cls._parse_date(data.get("test_start_date") or start_time),
            test_end_date=cls._parse_date(data.get("test_end_date") or end_time),
            initial_capital=float(data.get("initial_capital") or 0),
            metrics=metrics,
            equity_curve=equity_curve,
            trades=trades,
            extra={
                key: value for key, value in data.items()
                if key not in excluded
            } | {
                "result_snapshot": result_snapshot,
                "strategy_snapshot": strategy_snapshot,
            },
        )

    def to_dict(self):
        result = dict(self.extra)
        result.update({
            "id": self.id,
            "strategy_id": self.strategy_id,
            "created_at": self.created_at,
            "train_start_date": self.train_start_date,
            "train_end_date": self.train_end_date,
            "test_start_date": self.test_start_date,
            "test_end_date": self.test_end_date,
            "initial_capital": self.initial_capital,
            "metrics": self.metrics,
            "equity_curve": self.equity_curve,
            "trades": [trade.to_dict() for trade in self.trades],
        })
        return result
