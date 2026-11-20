from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass
class Trade:
    id: int | None
    backtest_id: int
    entry_timestamp: datetime | None
    exit_timestamp: datetime | None
    side: str | None
    entry_price: float | None
    exit_price: float | None
    quantity: float | None
    profit_loss: float | None

    @staticmethod
    def _parse_datetime(value):
        if value is None or isinstance(value, datetime):
            return value
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))

    @classmethod
    def from_dict(cls, data: dict[str, Any], backtest_id: int = 0):
        action = str(data.get("action", "")).lower()
        timestamp = cls._parse_datetime(data.get("timestamp") or data.get("entry_timestamp") or data.get("exit_timestamp"))

        entry_action = action in {"long", "short", "buy"}
        exit_action = action in {"exit", "sell", "closed"}

        if action in {"long", "buy"}:
            side = "long"
        elif action in {"short", "sell"}:
            side = "short"
        else:
            side = data.get("side")

        return cls(
            id=data.get("id"),
            backtest_id=int(data.get("backtest_id") or backtest_id),
            entry_timestamp=timestamp if entry_action else cls._parse_datetime(data.get("entry_timestamp")),
            exit_timestamp=timestamp if exit_action else cls._parse_datetime(data.get("exit_timestamp")),
            side=side,
            entry_price=float(data["entry_price"]) if data.get("entry_price") is not None else float(data["price"]) if entry_action and data.get("price") is not None else None,
            exit_price=float(data["exit_price"]) if data.get("exit_price") is not None else float(data["price"]) if exit_action and data.get("price") is not None else None,
            quantity=float(data["quantity"]) if data.get("quantity") is not None else None,
            profit_loss=float(data["profit_loss"]) if data.get("profit_loss") is not None else float(data["pnl"]) if data.get("pnl") is not None else None,
        )

    def to_dict(self):
        return {
            "id": self.id,
            "backtest_id": self.backtest_id,
            "entry_timestamp": self.entry_timestamp,
            "exit_timestamp": self.exit_timestamp,
            "side": self.side,
            "entry_price": self.entry_price,
            "exit_price": self.exit_price,
            "quantity": self.quantity,
            "profit_loss": self.profit_loss,
        }
