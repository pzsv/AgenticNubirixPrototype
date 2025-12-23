from fastapi import APIRouter, HTTPException, Query
from app.schemas.data_entities import DataEntity, DataEntityCreate, DataEntityField, DataEntityFieldCreate
from app.services.storage import storage
from typing import List, Optional

router = APIRouter(prefix="/data-entities", tags=["Data Entities"])

@router.get("", response_model=List[DataEntity])
async def list_entities():
    return storage.get_data_entities()

@router.post("", response_model=DataEntity)
async def create_entity(entity: DataEntityCreate):
    entity_id = storage.add_data_entity(entity.model_dump())
    return storage.get_data_entity_by_id(entity_id)

@router.get("/{entity_id}", response_model=DataEntity)
async def get_entity(entity_id: str):
    entity = storage.get_data_entity_by_id(entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity

@router.post("/{entity_id}")
async def update_entity(entity_id: str, updates: dict):
    if storage.update_data_entity(entity_id, updates):
        return {"message": "Entity updated"}
    raise HTTPException(status_code=404, detail="Entity not found")

@router.delete("/{entity_id}")
async def delete_entity(entity_id: str):
    if storage.delete_data_entity(entity_id):
        return {"message": "Entity deleted"}
    raise HTTPException(status_code=404, detail="Entity not found")

@router.get("/{entity_id}/fields", response_model=List[DataEntityField])
async def list_entity_fields(entity_id: str):
    return storage.get_data_entity_fields(entity_id)

@router.post("/{entity_id}/fields", response_model=DataEntityField)
async def create_entity_field(entity_id: str, field: DataEntityFieldCreate):
    if field.entity_id != entity_id:
        raise HTTPException(status_code=400, detail="Entity ID mismatch")
    field_id = storage.add_data_entity_field(field.model_dump())
    return storage.get_data_entity_field_by_id(field_id)

@router.post("/fields/{field_id}")
async def update_field(field_id: str, updates: dict):
    if storage.update_data_entity_field(field_id, updates):
        return {"message": "Field updated"}
    raise HTTPException(status_code=404, detail="Field not found")

@router.delete("/fields/{field_id}")
async def delete_field(field_id: str):
    if storage.delete_data_entity_field(field_id):
        return {"message": "Field deleted"}
    raise HTTPException(status_code=404, detail="Field not found")
