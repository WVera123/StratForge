from datetime import date
from pydantic import BaseModel, Field

class BacktestRequest(BaseModel):
    strategy_id: int = Field(..., gt=0)
    crypto1: int = Field(..., gt=0)
    crypto2: int | None = Field(default=None, gt=0)
    timeframe: str = Field(..., pattern=r"^(1m|1h|1d)$")
    train_start_date: date
    train_end_date: date
    test_start_date: date
    test_end_date: date
    position_sizing: str = Field(default="fixed")
    position_allocation: float = Field(default=1.0, ge=0.0, le=1.0)
    initial_capital: float = Field(default=10000.0, gt=0)
    fee_rate: float = Field(default=0.0, ge=0.0)
    slippage_rate: float = Field(default=0.0, ge=0.0)