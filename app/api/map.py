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
    return storage.get_workload_by_id(workload_id)

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
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Invalid file format")
        
        # Group by (Parent Application Package Name, AWI Environment)
        # Using columns from the provided AWI template
        name_col = 'Parent Application Package Name'
        env_col = 'AWI Environment'
        hosting_col = 'AWI Current Hosting Model'
        asset_col = 'Secondary Entity Anchor Value'
        
        # Some rows might have missing values, fill them
        df[name_col] = df[name_col].ffill()
        df[env_col] = df[env_col].ffill()
        
        grouped = df.groupby([name_col, env_col])
        
        ingested_count = 0
        for (name, env), group in grouped:
            # Check if workload already exists
            workload = storage.get_workload_by_name_and_env(name, env)
            
            # Collect CI IDs
            ci_ids = []
            for _, row in group.iterrows():
                asset_name = row.get(asset_col)
                if pd.notna(asset_name):
                    ci = storage.get_ci_by_name(str(asset_name))
                    if ci:
                        if ci["id"] not in ci_ids:
                            ci_ids.append(ci["id"])
                    else:
                        # For prototype, if CI not found, we could create it or just ignore
                        # Let's create a minimal CI so the relationship is visible
                        new_ci_id = storage.add_ci({
                            "name": str(asset_name),
                            "type": "other",
                            "description": "Auto-created during AWI ingestion",
                            "properties": {}
                        })
                        ci_ids.append(new_ci_id)
            
            hosting_model = group[hosting_col].iloc[0] if hosting_col in group.columns and pd.notna(group[hosting_col].iloc[0]) else "On-Premise"
            
            if workload:
                # Update existing workload
                new_ci_ids = list(set(workload.get("ci_ids", []) + ci_ids))
                storage.update_workload(workload["id"], {
                    "ci_ids": new_ci_ids,
                    "hosting_model": hosting_model
                })
            else:
                # Create new workload
                storage.add_workload({
                    "name": name,
                    "environment": env,
                    "hosting_model": hosting_model,
                    "ci_ids": ci_ids,
                    "description": f"Ingested from {file.filename}",
                    "relationships": []
                })
                ingested_count += 1
                
        return {"message": f"Successfully processed {len(grouped)} workloads ({ingested_count} new)"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/ingest/dependencies")
async def ingest_dependencies(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Invalid file format")
            
        # Columns: 'Parent Application Package Name', 'Linked Parent Application Package Name', 'Dependency Link Environment', 'Dependency Level', 'Latency Sensitive'
        src_col = 'Parent Application Package Name'
        target_col = 'Linked Parent Application Package Name'
        env_col = 'Dependency Link Environment'
        level_col = 'Dependency Level'
        latency_col = 'Latency Sensitive'
        
        ingested_count = 0
        for _, row in df.iterrows():
            src_name = row.get(src_col)
            target_name = row.get(target_col)
            env = row.get(env_col, "PROD")
            
            if pd.isna(src_name) or pd.isna(target_name):
                continue
                
            src_wl = storage.get_workload_by_name_and_env(src_name, env)
            target_wl = storage.get_workload_by_name_and_env(target_name, env)
            
            if src_wl and target_wl:
                storage.add_dependency({
                    "source_workload_id": src_wl["id"],
                    "target_workload_id": target_wl["id"],
                    "environment": env,
                    "level": str(row.get(level_col, "Medium")),
                    "latency_sensitive": bool(row.get(latency_col, False)),
                    "type": "dependency"
                })
                ingested_count += 1
            else:
                # For prototype, if workloads don't exist, we might want to create them
                # but usually AWIs should be ingested first.
                pass
                
        return {"message": f"Successfully ingested {ingested_count} dependencies"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
