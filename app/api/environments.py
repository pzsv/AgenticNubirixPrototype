from fastapi import APIRouter, HTTPException
from typing import List
from app.services.storage import storage
from app.schemas.environments import Environment, EnvironmentCreate, EnvironmentUpdate

router = APIRouter(prefix="/environments", tags=["Environments"])

@router.get("/", response_model=List[Environment])
async def get_environments():
    return storage.get_environments()

@router.post("/", response_model=str)
async def add_environment(env: EnvironmentCreate):
    return storage.add_environment(env.dict())

@router.put("/{env_id}", response_model=bool)
async def update_environment(env_id: str, updates: EnvironmentUpdate):
    success = storage.update_environment(env_id, updates.dict(exclude_unset=True))
    if not success:
        raise HTTPException(status_code=404, detail="Environment not found")
    return success

@router.delete("/{env_id}", response_model=bool)
async def delete_environment(env_id: str):
    success = storage.delete_environment(env_id)
    if not success:
        raise HTTPException(status_code=404, detail="Environment not found")
    return success
