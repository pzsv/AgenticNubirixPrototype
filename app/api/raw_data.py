from fastapi import APIRouter, HTTPException
from app.schemas.raw_data import RawDataEntity, RawDataEntityCreate, RawDataEntityField, RawDataEntityFieldCreate
from app.services.storage import storage
from typing import List

router = APIRouter(prefix="/raw-data", tags=["Raw Data"])

@router.get("", response_model=List[RawDataEntity])
async def list_raw_data_entities():
    return storage.get_raw_data_entities()

@router.get("/{entity_id}", response_model=RawDataEntity)
async def get_raw_data_entity(entity_id: str):
    entity = storage.get_raw_data_entity_by_id(entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Raw Data Entity not found")
    return entity

@router.delete("/{entity_id}")
async def delete_raw_data_entity(entity_id: str):
    if storage.delete_raw_data_entity(entity_id):
        return {"message": "Raw Data Entity deleted"}
    raise HTTPException(status_code=404, detail="Raw Data Entity not found")

@router.get("/{entity_id}/fields", response_model=List[RawDataEntityField])
async def list_raw_data_entity_fields(entity_id: str):
    return storage.get_raw_data_entity_fields(entity_id)
