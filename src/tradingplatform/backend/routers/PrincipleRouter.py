from fastapi import APIRouter

from services.principle_service import PrincipleService
from schemas.principle import Principle

router = APIRouter()
principle_service = PrincipleService()


@router.get("/principles", response_model=list[Principle])
def get_principles():
    return principle_service.get_principles()
