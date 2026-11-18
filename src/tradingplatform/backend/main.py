from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from fastapi import HTTPException, Query

from services import (
    MarketDataService,
    PrincipleService,
    StrategyService,
    SettingsService
)

from schemas.currency import Currency
from schemas.market_data import MarketData
from schemas.strategy import (
    Strategy,
    StrategyCreate,
    StrategyPreviewRequest,
    BacktestRequest
)
from schemas.principle import Principle


app = FastAPI(
    title="Crypto Backtesting API"
)

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

market_data_service = MarketDataService()
principle_service = PrincipleService()
strategy_service = StrategyService()
settings_service = SettingsService()

@app.get("/")
def root():

    return {
        "message": "Crypto Backtesting API is running"
    }

@app.get(
    "/currencies",
    response_model=list[Currency]
)
def get_currencies():

    return market_data_service.get_currencies()

@app.get(
    "/market-data/{crypto}",
    response_model=list[MarketData]
)
def get_market_data(
    crypto: int,
    timeframe: str
):
    try:
        return market_data_service.get_market_data_one_currency(
            crypto=crypto,
            timeframe=timeframe
        )
    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@app.get(
    "/market-data/{crypto}/range"
)
def get_market_data_range(
    crypto: int,
    timeframe: str
):
    try:
        return market_data_service.get_market_data_range(
            crypto=crypto,
            timeframe=timeframe
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@app.get(
    "/principles",
    response_model=list[Principle]
)
def get_principles():

    return principle_service.get_principles()


@app.get(
    "/strategies/get"
)
def get_strategies():

    try:

        return strategy_service.get_strategies()

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@app.get(
    "/strategies/{strategy_id}"
)
def get_strategy(
    strategy_id: int
):

    try:

        return strategy_service.get_strategy(
            strategy_id
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@app.post(
    "/strategies/delete/{strategy_id}"
)
def delete_strategy(
    strategy_id: int
):

    try:

        return strategy_service.delete_strategy(
            strategy_id
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
        
@app.post(
    "/strategies/edit/{strategy_id}",
    response_model=Strategy
)
def edit_strategy(
    strategy_id: int,
    strategy: StrategyCreate,
):

    try:

        return strategy_service.edit_strategy(
            strategy_id=strategy_id,
            strategy=strategy
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.get(
    "/strategies/{principle}/parameters"
)
def get_strategy_parameters(
    principle: str
):

    try:

        return strategy_service.get_parameters(
            principle
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@app.post(
    "/strategies/create",
    response_model=Strategy
)
def create_strategy(
    strategy: StrategyCreate
):

    try:

        return strategy_service.create_strategy(
            strategy
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@app.post(
    "/strategies/preview"
)
def preview_strategy(
    request: StrategyPreviewRequest
):

    try:

        return strategy_service.preview_strategy(
            request
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.get(
    "/strategies/{principle}/parameter-groups"
)
def get_strategy_parameter_groups(
    principle: str
):

    try:

        return (
            strategy_service
            .get_feature_groups(
                principle
            )
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@app.post(
    "/backtests"
)
def run_backtest(
    request: BacktestRequest
):
    try:

        return strategy_service.run_backtest(
            request
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.get("/backtests/history")
def get_backtest_history(strategy_id: Optional[int] = Query(default=None)):
    return strategy_service.get_backtest_history(strategy_id)


@app.get("/backtests/history/{backtest_id}")
def get_backtest_execution(backtest_id: int):
    result = strategy_service.get_backtest_execution(backtest_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Backtest run not found."
        )

    return result

@app.get(
    "/settings"
)
def get_settings(user_id: int = 1):
    try:
        return settings_service.get_settings(user_id)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.post(
    "/settings"
)
def save_settings(settings: dict, user_id: int = 1):
    try:
        return settings_service.save_settings(user_id, settings)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )