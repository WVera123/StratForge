from dataclasses import dataclass
from datetime import date, datetime
import json
from typing import Any

from schemas.strategy import StrategyPrinciple


@dataclass
class StrategyEntity:
    id: int
    user_id: int
    title: str
    principle: StrategyPrinciple
    crypto1: int
    crypto2: int | None
    timeframe: str
    start_date: date
    split: float
    parameters: dict[str, Any]
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @staticmethod
    def _parse_datetime(value):
        if value is None or isinstance(value, datetime):
            return value
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))

    @staticmethod
    def _parse_date(value):
        if value is None or isinstance(value, date):
            return value
        if isinstance(value, datetime):
            return value.date()
        return date.fromisoformat(str(value)[:10])

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        parameters = data.get("parameters") or {}
        if isinstance(parameters, str):
            parameters = json.loads(parameters)

        principle = data["principle"]
        if not isinstance(principle, StrategyPrinciple):
            principle = StrategyPrinciple(principle)

        return cls(
            id=int(data["id"]),
            user_id=int(data["user_id"]),
            title=data["title"],
            principle=principle,
            crypto1=int(data["crypto1"]),
            crypto2=int(data["crypto2"]) if data.get("crypto2") is not None else None,
            timeframe=data["timeframe"],
            start_date=cls._parse_date(data["start_date"]),
            split=float(data["split"]),
            parameters=parameters,
            created_at=cls._parse_datetime(data.get("created_at")),
            updated_at=cls._parse_datetime(data.get("updated_at")),
        )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "principle": self.principle.value,
            "crypto1": self.crypto1,
            "crypto2": self.crypto2,
            "timeframe": self.timeframe,
            "start_date": self.start_date,
            "split": self.split,
            "parameters": self.parameters,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
