from fastapi import APIRouter, HTTPException, Query
from app.schemas.data_dictionary import DataField, DataFieldCreate, StandardValue, StandardValueCreate
from app.services.storage import storage
from typing import List, Optional

router = APIRouter(prefix="/data-dictionary", tags=["Data Dictionary"])

@router.post("/fields", response_model=DataField)
async def create_field(field: DataFieldCreate):
    field_id = storage.add_data_field(field.model_dump())
    return (await list_fields(field_id=field_id))[0]

@router.get("/fields", response_model=List[DataField])
async def list_fields(
    entity: Optional[str] = None, 
    search: Optional[str] = None,
    field_id: Optional[str] = None
):
    fields = storage.get_data_fields()
    
    if field_id:
        fields = [f for f in fields if f["id"] == field_id]
        if not fields:
            raise HTTPException(status_code=404, detail="Field not found")
        return fields

    if entity:
        fields = [f for f in fields if f["entity"] == entity]
    
    if search:
        search = search.lower()
        filtered_fields = []
        for f in fields:
            # Check field name
            if search in f["name"].lower():
                filtered_fields.append(f)
                continue
            # Check entity name
            if search in f["entity"].lower():
                filtered_fields.append(f)
                continue
            # Check standard values
            sv_match = False
            for sv in f["standard_values"]:
                if search in sv["value"].lower():
                    sv_match = True
                    break
            if sv_match:
                filtered_fields.append(f)
        fields = filtered_fields
        
    return fields

@router.post("/standard-values", response_model=StandardValue)
async def create_standard_value(sv: StandardValueCreate):
    if not storage.get_data_field_by_id(sv.field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    sv_id = storage.add_standard_value(sv.model_dump())
    return storage.get_standard_value_by_id(sv_id)

@router.get("/entities", response_model=List[str])
async def list_entities():
    fields = storage.get_data_fields()
    entities = sorted(list(set(f["entity"] for f in fields)))
    return entities
