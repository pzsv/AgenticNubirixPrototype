from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Relationship(BaseModel):
    source_id: str
    target_id: str
    type: str # e.g., "runs_on", "depends_on", "part_of"

class WorkloadBase(BaseModel):
    name: str
    description: Optional[str] = None
    ci_ids: List[str] = Field(default_factory=list)
    relationships: List[Relationship] = Field(default_factory=list)

class WorkloadCreate(WorkloadBase):
    pass

class Workload(WorkloadBase):
    id: str

class Dependency(BaseModel):
    source_workload_id: str
    target_workload_id: str
    type: str = "dependency"
