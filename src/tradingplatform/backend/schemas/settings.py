from pydantic import BaseModel, Field

class SettingsUpdate(BaseModel):
    initialCapital: float = Field(default=10000.0, ge=100.0)
    takerFee: float = Field(default=0.0, ge=0.0)
    makerFee: float = Field(default=0.0, ge=0.0)
    slippage: float = Field(default=0.0, ge=0.0)
    positionSizing: str = Field(default="fixed")
    positionAllocation: float = Field(default=100.0, ge=0.0, le=100.0)