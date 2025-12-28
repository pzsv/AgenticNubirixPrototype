from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Response
from app.schemas.data_entities import DataEntity, DataEntityCreate, DataEntityField, DataEntityFieldCreate
from app.services.storage import storage
from typing import List, Optional
import pandas as pd
import io

router = APIRouter(prefix="/data-entities", tags=["Data Entities"])

@router.get("/download")
async def download_data_entities():
    entities = storage.get_data_entities()
    
    # Prepare Data Entities sheet
    entities_data = []
    for e in entities:
        key_field = next((f for f in e['fields'] if f['id'] == e['key_field_id']), None)
        entities_data.append({
            "Name": e['name'],
            "Key Field": key_field['name'] if key_field else ""
        })
    
    # Prepare Data Entity Fields sheet
    fields_data = []
    for e in entities:
        for f in e['fields']:
            fields_data.append({
                "Name": f['name'],
                "Data_Entity_Name": e['name'],
                "Anchor_Field": f['anchor']
            })
            
    df_entities = pd.DataFrame(entities_data)
    df_fields = pd.DataFrame(fields_data)
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df_entities.to_excel(writer, sheet_name='Data Entities', index=False)
        df_fields.to_excel(writer, sheet_name='Data Entity Fields', index=False)
    
    output.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename="data_entities.xlsx"'
    }
    return Response(content=output.getvalue(), headers=headers, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

@router.post("/upload")
async def upload_data_entities(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        df_entities = pd.read_excel(io.BytesIO(contents), sheet_name='Data Entities')
        df_fields = pd.read_excel(io.BytesIO(contents), sheet_name='Data Entity Fields')
        
        # Handle NaN values
        df_entities = df_entities.where(pd.notnull(df_entities), None)
        df_fields = df_fields.where(pd.notnull(df_fields), None)
        
        entities_data = df_entities.to_dict(orient='records')
        fields_data = df_fields.to_dict(orient='records')
        
        storage.override_data_entities(entities_data, fields_data)
        
        return {"message": "Data entities and fields successfully overridden"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
