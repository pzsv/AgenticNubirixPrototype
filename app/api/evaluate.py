from fastapi import APIRouter
from app.schemas.evaluate import DashboardMetrics, Report
from app.services.storage import storage

router = APIRouter(prefix="/evaluate", tags=["Evaluate"])

@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard():
    # Mock calculation logic
    cis = storage.get_cis()
    workloads = storage.get_workloads()
    waves = storage.get_waves()
    
    return DashboardMetrics(
        total_cis=len(cis),
        total_workloads=len(workloads),
        total_waves=len(waves),
        migration_progress=0.15, # Mock
        total_estimated_tco_savings=1500000.0, # Mock
        esg_impact_score=75.5, # Mock
        risk_summary={"high": 2, "medium": 5, "low": 12} # Mock
    )

@router.get("/reports", response_model=list[Report])
async def get_reports():
    return [
        Report(title="TCO Analysis", data=[{"year": 2025, "savings": 500000}, {"year": 2026, "savings": 1000000}]),
        Report(title="ESG Impact", data=[{"metric": "CO2 Reduction", "value": "20%"}, {"metric": "Energy Savings", "value": "15%"}])
    ]
