from pydantic import BaseModel
from typing import List, Optional

class ScoreCardOptionBase(BaseModel):
    name: str
    score: int

class ScoreCardOptionCreate(ScoreCardOptionBase):
    factor_id: str

class ScoreCardOption(ScoreCardOptionBase):
    id: str
    factor_id: str

class ScoreCardFactorBase(BaseModel):
    name: str
    weight: int = 1
    description: Optional[str] = None

class ScoreCardFactorCreate(ScoreCardFactorBase):
    pass

class ScoreCardFactor(ScoreCardFactorBase):
    id: str
    options: List[ScoreCardOption] = []
