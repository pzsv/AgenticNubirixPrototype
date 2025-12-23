from pydantic import BaseModel
from typing import Dict, Any, List

class DashboardMetrics(BaseModel):
    total_cis: int
    total_workloads: int
    total_waves: int
    migration_progress: float # 0.0 to 1.0
    total_estimated_tco_savings: float
    esg_impact_score: float
    risk_summary: Dict[str, int] # e.g., {"high": 2, "medium": 5, "low": 10}

class Report(BaseModel):
    title: str
    data: List[Dict[str, Any]]
