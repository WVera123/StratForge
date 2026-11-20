from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from services.backtest_service import BacktestService
from services.backtest_history_service import BacktestHistoryService
from schemas.strategy import StrategyPreviewRequest
from schemas.backtest import BacktestRequest

router = APIRouter()
backtest_service = BacktestService()
backtest_history_service = BacktestHistoryService()

@router.post("/backtests")
def run_backtest(request: BacktestRequest):
    try:
        return backtest_service.run_backtest(request)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@router.get("/backtests/history")
def get_backtest_history(strategy_id: Optional[int] = Query(default=None)):
    return backtest_history_service.get_backtest_history(strategy_id)

@router.get("/backtests/history/{backtest_id}")
def get_backtest_execution(backtest_id: int):
    result = backtest_history_service.get_backtest_execution(backtest_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Backtest run not found.")

    return result

@router.post("/strategies/preview")
def preview_strategy(request: StrategyPreviewRequest):
    try: 
        return backtest_service.preview_strategy(request)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

