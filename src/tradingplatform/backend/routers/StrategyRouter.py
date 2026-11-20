from fastapi import APIRouter, HTTPException

from services.strategy_service import StrategyService
from schemas.strategy import Strategy, StrategyCreate, StrategyPreviewRequest

router = APIRouter()
strategy_service = StrategyService()


@router.get("/strategies/get")
def get_strategies():
    try:
        return strategy_service.get_strategies()
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/strategies/{strategy_id}")
def get_strategy(strategy_id: int):
    try:
        return strategy_service.get_strategy(strategy_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.post("/strategies/delete/{strategy_id}")
def delete_strategy(strategy_id: int):
    try:
        return strategy_service.delete_strategy(strategy_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/strategies/edit/{strategy_id}", response_model=Strategy)
def edit_strategy(strategy_id: int, strategy: StrategyCreate):
    try:
        return strategy_service.edit_strategy(strategy_id=strategy_id, strategy=strategy)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@router.get("/strategies/{principle}/parameters")
def get_strategy_parameters(principle: str):
    try:
        return strategy_service.get_parameters(principle)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/strategies/create", response_model=Strategy)
def create_strategy(strategy: StrategyCreate):
    try:
        return strategy_service.create_strategy(strategy)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/strategies/{principle}/parameter-groups")
def get_strategy_parameter_groups(principle: str):
    try:
        return strategy_service.get_feature_groups(principle)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
