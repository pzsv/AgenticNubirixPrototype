from fastapi import APIRouter, HTTPException
from app.services.storage import storage

router = APIRouter(prefix="/admin/project", tags=["Project Management"])

@router.post("/reset")
async def reset_project():
    try:
        storage.reset_project()
        return {"message": "Project reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
