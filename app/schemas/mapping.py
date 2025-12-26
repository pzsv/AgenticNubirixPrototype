from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class S2TMappingBase(BaseModel):
    workload_id: str
    move_principle_id: Optional[str] = None
    target_environment_id: Optional[str] = None
    target_location: Optional[str] = None
    score_card_results: Dict[str, str] = {} # factor_id: option_id
    total_score: int = 0
    status: str = "Draft"

class S2TMappingCreate(S2TMappingBase):
    pass

class S2TMapping(S2TMappingBase):
    id: str

class MoveDependencyGroupBase(BaseModel):
    name: str
    description: Optional[str] = None
    workload_ids: List[str] = []
    score_card_results: Dict[str, str] = {}
    total_score: int = 0
    status: str = "Draft"

class MoveDependencyGroupCreate(MoveDependencyGroupBase):
    pass

class MoveDependencyGroup(MoveDependencyGroupBase):
    id: str
