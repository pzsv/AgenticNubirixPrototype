from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.schemas.prepare import ConfigurationItem, ConfigurationItemCreate, CIType
from app.services.storage import storage
import pandas as pd
import io
import json
from datetime import datetime

router = APIRouter(prefix="/prepare", tags=["Prepare"])

@router.post("/items", response_model=ConfigurationItem)
async def create_ci(ci: ConfigurationItemCreate):
    ci_id = storage.add_ci(ci.model_dump())
    return storage.get_ci_by_id(ci_id)

@router.get("/items", response_model=list[ConfigurationItem])
async def list_cis():
    return storage.get_cis()

@router.get("/datasets")
async def list_datasets():
    return storage.get_datasets()

@router.get("/field-mappings")
async def list_field_mappings():
    return storage.get_field_mappings()

@router.post("/field-mappings/{mapping_id}")
async def update_field_mapping(mapping_id: str, updates: dict):
    if storage.update_field_mapping(mapping_id, updates):
        return {"message": "Mapping updated"}
    raise HTTPException(status_code=404, detail="Mapping not found")

@router.post("/upload")
async def upload_dataset(
    name: str = Form(...),
    rating: str = Form(...),
    worksheet: str = Form(...),
    header_row: int = Form(...),
    file: UploadFile = File(...)
):
    contents = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents), header=header_row-1)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents), sheet_name=worksheet, header=header_row-1)
        else:
            raise HTTPException(status_code=400, detail="Invalid file format")
        
        # Add dataset to storage
        ds_id = storage.add_dataset({
            "name": name,
            "last_uploaded": datetime.now().strftime("%b %d, %Y, %I:%M:%S %p"),
            "records": len(df),
            "upload_count": 1,
            "process": True,
            "worksheets": [worksheet],
            "rating": rating
        })

        # Generate initial field mappings
        for col in df.columns:
            storage.add_field_mapping({
                "source_field": str(col),
                "data_source": name,
                "worksheet": worksheet,
                "data_entity": None,
                "target_field": None,
                "status": "Pending",
                "process": True
            })

        return {"message": f"Successfully uploaded {name} with {len(df)} records", "dataset_id": ds_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/ingest")
async def ingest_cis(file: UploadFile = File(...)):
    contents = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents))
    elif file.filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(io.BytesIO(contents))
    else:
        raise HTTPException(status_code=400, detail="Invalid file format")

    ingested_count = 0
    for _, row in df.iterrows():
        # Basic mapping logic - assuming column names match or are close
        try:
            ci_data = {
                "name": str(row.get("name", "Unnamed")),
                "type": row.get("type", CIType.OTHER),
                "description": row.get("description", ""),
                "properties": json.loads(row.get("properties", "{}")) if isinstance(row.get("properties"), str) else {}
            }
            storage.add_ci(ci_data)
            ingested_count += 1
        except Exception:
            continue
            
    return {"message": f"Successfully ingested {ingested_count} items"}
