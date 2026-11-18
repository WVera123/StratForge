from datetime import datetime
from typing import Any
from pydantic import BaseModel

class BacktestSaved(BaseModel):
    id: int
    strategy_id: int
    instrument_id: int
    instrument2_id: int | None = None
    start_time: datetime
    end_time: datetime
    strategy_snapshot: dict[str, Any]
    created_at: datetime