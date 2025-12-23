from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.workload import Workload, WorkloadCreate, Dependency
from app.services.storage import storage
import pandas as pd
import io
import json

router = APIRouter(prefix="/map", tags=["Map"])

@router.post("/workloads", response_model=Workload)
async def create_workload(workload: WorkloadCreate):
    workload_id = storage.add_workload(workload.model_dump())
    return storage.workloads[workload_id]

@router.get("/workloads", response_model=list[Workload])
async def list_workloads():
    return storage.get_workloads()

@router.post("/dependencies")
async def create_dependency(dependency: Dependency):
    storage.add_dependency(dependency.model_dump())
    return {"message": "Dependency added"}

@router.get("/dependencies", response_model=list[Dependency])
async def list_dependencies():
    return storage.get_dependencies()

@router.post("/ingest/workloads")
async def ingest_workloads(file: UploadFile = File(...)):
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
            ci_ids = row.get("ci_ids", "[]")
            if isinstance(ci_ids, str):
                ci_ids = json.loads(ci_ids)
            
            workload_data = {
                "name": str(row.get("name", "Unnamed Workload")),
                "description": row.get("description", ""),
                "ci_ids": ci_ids,
                "relationships": [] # Simplified for prototype
            }
            storage.add_workload(workload_data)
            ingested_count += 1
        except Exception:
            continue
            
    return {"message": f"Successfully ingested {ingested_count} workloads"}
