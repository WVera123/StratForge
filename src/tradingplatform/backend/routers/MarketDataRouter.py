from fastapi import APIRouter, HTTPException

from services.market_data_service import MarketDataService
from schemas.currency import Currency
from schemas.market_data import MarketData

router = APIRouter()
market_data_service = MarketDataService()


@router.get("/currencies", response_model=list[Currency])
def get_currencies():
    return market_data_service.get_currencies()


@router.get("/market-data/{crypto}", response_model=list[MarketData])
def get_market_data(crypto: int, timeframe: str):
    try:
        return market_data_service.get_market_data_one_currency(
            crypto=crypto,
            timeframe=timeframe
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/market-data/{crypto}/range")
def get_market_data_range(crypto: int, timeframe: str):
    try:
        return market_data_service.get_market_data_range(
            crypto=crypto,
            timeframe=timeframe
        )
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))
