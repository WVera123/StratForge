from datetime import datetime

from pydantic import BaseModel


class MarketData(BaseModel):
    instrument_id: int
    timeframe: str
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float