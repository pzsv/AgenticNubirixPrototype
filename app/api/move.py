from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.move import Runbook, RunbookCreate
from app.services.storage import storage
import pandas as pd
import io
import json

router = APIRouter(prefix="/move", tags=["Move"])

@router.post("/runbooks", response_model=Runbook)
async def create_runbook(runbook: RunbookCreate):
    runbook_id = storage.add_runbook(runbook.model_dump())
    return storage.runbooks[runbook_id]

@router.get("/runbooks", response_model=list[Runbook])
async def list_runbooks():
    return storage.get_runbooks()

@router.post("/generate/{workload_id}")
async def generate_runbook(workload_id: str):
    # Mock generation from template
    runbook_data = {
        "name": f"Runbook for {workload_id}",
        "workload_id": workload_id,
        "steps": [
            {"order": 1, "task": "Shut down source servers", "owner": "SysAdmin", "status": "pending"},
            {"order": 2, "task": "Data replication", "owner": "DBA", "status": "pending"},
            {"order": 3, "task": "Bring up target servers", "owner": "CloudEng", "status": "pending"}
        ]
    }
    runbook_id = storage.add_runbook(runbook_data)
    return storage.runbooks[runbook_id]

@router.post("/ingest/runbooks")
async def ingest_runbooks(file: UploadFile = File(...)):
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
            steps = row.get("steps", "[]")
            if isinstance(steps, str):
                steps = json.loads(steps)
            
            runbook_data = {
                "name": str(row.get("name", "Unnamed Runbook")),
                "workload_id": str(row.get("workload_id")),
                "steps": steps
            }
            storage.add_runbook(runbook_data)
            ingested_count += 1
        except Exception:
            continue
            
    return {"message": f"Successfully ingested {ingested_count} runbooks"}
