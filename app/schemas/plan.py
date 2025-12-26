from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class MigrationStrategy(BaseModel):
    name: str # Rehost, Replatform, Refactor, Retire, Retain
    description: Optional[str] = None

class MigrationWaveBase(BaseModel):
    name: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    workload_ids: List[str] = Field(default_factory=list)
    mdg_ids: List[str] = Field(default_factory=list)

class MigrationWaveCreate(MigrationWaveBase):
    pass

class MigrationWave(MigrationWaveBase):
    id: str
