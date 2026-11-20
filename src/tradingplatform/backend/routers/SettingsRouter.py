from fastapi import APIRouter, HTTPException

from services.settings_service import SettingsService
from schemas.settings import SettingsUpdate

router = APIRouter()
settings_service = SettingsService()


@router.get("/settings")
def get_settings(user_id: int = 1):
    try:
        return settings_service.get_settings(user_id)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/settings")
def save_settings(settings: SettingsUpdate, user_id: int = 1):
    try:
        settings_data = settings.model_dump()
        return settings_service.save_settings(user_id, settings_data)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
