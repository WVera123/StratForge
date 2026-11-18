from pydantic import BaseModel


class Currency(BaseModel):
    id: int
    symbol: str
    base_asset: str
    quote_asset: str