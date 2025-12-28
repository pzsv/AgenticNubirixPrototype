from fastapi import APIRouter, HTTPException
from app.schemas.discovered_data import DiscoveredDataEntity, DiscoveredDataField
from app.services.storage import storage
from typing import List, Optional

router = APIRouter(prefix="/discovered-data", tags=["Discovered Data"])

@router.get("", response_model=List[DiscoveredDataEntity])
async def list_discovered_data_entities(data_source_id: Optional[str] = None):
    return storage.get_discovered_data_entities(data_source_id=data_source_id)

@router.get("/{entity_id}", response_model=DiscoveredDataEntity)
async def get_discovered_data_entity(entity_id: str):
    entity = storage.get_discovered_data_entity_by_id(entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Discovered Data Entity not found")
    return entity

@router.delete("/{entity_id}")
async def delete_discovered_data_entity(entity_id: str):
    if storage.delete_discovered_data_entity(entity_id):
        return {"message": "Discovered Data Entity deleted"}
    raise HTTPException(status_code=404, detail="Discovered Data Entity not found")

@router.get("/{entity_id}/fields", response_model=List[DiscoveredDataField])
async def list_discovered_data_entity_fields(entity_id: str):
    return storage.get_discovered_data_fields(entity_id)
