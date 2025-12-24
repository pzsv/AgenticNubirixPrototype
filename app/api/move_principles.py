from fastapi import APIRouter, HTTPException
from typing import List
from app.services.storage import storage
from app.schemas.move_principles import MovePrinciple, MovePrincipleCreate, MovePrincipleUpdate

router = APIRouter(prefix="/move-principles", tags=["Move Principles"])

@router.get("/", response_model=List[MovePrinciple])
async def get_move_principles():
    return storage.get_move_principles()

@router.post("/", response_model=str)
async def add_move_principle(principle: MovePrincipleCreate):
    return storage.add_move_principle(principle.dict())

@router.put("/{principle_id}", response_model=bool)
async def update_move_principle(principle_id: str, updates: MovePrincipleUpdate):
    success = storage.update_move_principle(principle_id, updates.dict(exclude_unset=True))
    if not success:
        raise HTTPException(status_code=404, detail="Move Principle not found")
    return success

@router.delete("/{principle_id}", response_model=bool)
async def delete_move_principle(principle_id: str):
    success = storage.delete_move_principle(principle_id)
    if not success:
        raise HTTPException(status_code=404, detail="Move Principle not found")
    return success
