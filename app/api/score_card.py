from fastapi import APIRouter, HTTPException
from app.schemas.score_card import ScoreCardFactor, ScoreCardFactorCreate, ScoreCardOption, ScoreCardOptionCreate
from app.services.storage import storage
from typing import List

router = APIRouter(prefix="/score-card", tags=["Score Card"])

@router.get("/factors", response_model=List[ScoreCardFactor])
async def list_factors():
    return storage.get_score_card_factors()

@router.post("/factors", response_model=str)
async def create_factor(factor: ScoreCardFactorCreate):
    return storage.add_score_card_factor(factor.model_dump())

@router.post("/options", response_model=str)
async def create_option(option: ScoreCardOptionCreate):
    return storage.add_score_card_option(option.model_dump())
