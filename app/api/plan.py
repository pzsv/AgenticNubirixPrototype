from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.plan import MigrationWave, MigrationWaveCreate
from app.services.storage import storage
import pandas as pd
import io
import json

router = APIRouter(prefix="/plan", tags=["Plan"])

@router.post("/waves", response_model=MigrationWave)
async def create_wave(wave: MigrationWaveCreate):
    wave_id = storage.add_wave(wave.model_dump())
    return storage.waves[wave_id]

@router.get("/waves", response_model=list[MigrationWave])
async def list_waves():
    return storage.get_waves()

@router.post("/ingest/waves")
async def ingest_waves(file: UploadFile = File(...)):
    contents = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents))
    elif file.filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(io.BytesIO(contents))
    else:
        raise HTTPException(status_code=400, detail="Invalid file format")

    ingested_count = 0
    for _, row in df.iterrows():
        try:
            workload_ids = row.get("workload_ids", "[]")
            if isinstance(workload_ids, str):
                workload_ids = json.loads(workload_ids)
            
            wave_data = {
                "name": str(row.get("name", "Unnamed Wave")),
                "start_date": row.get("start_date"),
                "end_date": row.get("end_date"),
                "workload_ids": workload_ids
            }
            storage.add_wave(wave_data)
            ingested_count += 1
        except Exception:
            continue
            
    return {"message": f"Successfully ingested {ingested_count} waves"}

@router.get("/recommendations/{workload_id}")
async def get_recommendation(workload_id: str):
    # Mock recommendation logic
    return {
        "workload_id": workload_id,
        "recommended_strategy": "Rehost",
        "reasoning": "Standard web application with minimal dependencies."
    }
