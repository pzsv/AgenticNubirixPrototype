from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.prepare import ConfigurationItem, ConfigurationItemCreate, CIType
from app.services.storage import storage
import pandas as pd
import io
import json

router = APIRouter(prefix="/prepare", tags=["Prepare"])

@router.post("/items", response_model=ConfigurationItem)
async def create_ci(ci: ConfigurationItemCreate):
    ci_id = storage.add_ci(ci.model_dump())
    return storage.cis[ci_id]

@router.get("/items", response_model=list[ConfigurationItem])
async def list_cis():
    return storage.get_cis()

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
