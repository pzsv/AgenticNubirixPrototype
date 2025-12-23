from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class StepStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class RunbookStep(BaseModel):
    order: int
    task: str
    owner: str
    status: StepStatus = StepStatus.PENDING
    duration_minutes: Optional[int] = None

class RunbookBase(BaseModel):
    name: str
    workload_id: str
    steps: List[RunbookStep] = Field(default_factory=list)

class RunbookCreate(RunbookBase):
    pass

class Runbook(RunbookBase):
    id: str
