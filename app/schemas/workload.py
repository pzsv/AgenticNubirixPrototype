from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Relationship(BaseModel):
    source_id: str
    target_id: str
    type: str # e.g., "runs_on", "depends_on", "part_of"

class WorkloadBase(BaseModel):
    name: str
    description: Optional[str] = None
    environment: str = "PROD"
    hosting_model: str = "On-Premise"
    ci_ids: List[str] = Field(default_factory=list)
    relationships: List[Relationship] = Field(default_factory=list)

class WorkloadCreate(WorkloadBase):
    pass

class Workload(WorkloadBase):
    id: str

class Dependency(BaseModel):
    source_workload_id: str
    target_workload_id: str
    environment: str = "PROD"
    level: str = "Medium"
    latency_sensitive: bool = False
    type: str = "dependency"
