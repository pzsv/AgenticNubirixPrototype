from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_workflow():
    # 1. Prepare: Create CI
    response = client.post("/prepare/items", json={
        "name": "Web-Server-01",
        "type": "server",
        "description": "Primary web server",
        "properties": {"cpu": 4, "ram": "16GB"}
    })
    assert response.status_code == 200
    ci_id = response.json()["id"]
    
    # 2. Map: Create Workload
    response = client.post("/map/workloads", json={
        "name": "Customer Portal",
        "description": "Main customer facing application",
        "ci_ids": [ci_id]
    })
    assert response.status_code == 200
    workload_id = response.json()["id"]
    
    # 3. Plan: Create Wave
    response = client.post("/plan/waves", json={
        "name": "Wave 1 - Web Apps",
        "workload_ids": [workload_id]
    })
    assert response.status_code == 200
    wave_id = response.json()["id"]
    
    # 4. Move: Generate Runbook
    response = client.post(f"/move/generate/{workload_id}")
    assert response.status_code == 200
    runbook_id = response.json()["id"]
    
    # 5. Evaluate: Check Dashboard
    response = client.get("/evaluate/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_cis"] >= 1
    assert data["total_workloads"] >= 1
    assert data["total_waves"] >= 1

def test_ingestion_csv_mock():
    # We can test the ingestion with a mock CSV
    import io
    csv_content = "name,type,description,properties\nServerCSV,server,Ingested via CSV,\"{\"\"os\"\": \"\"linux\"\"}\""
    files = {"file": ("test.csv", io.BytesIO(csv_content.encode()), "text/csv")}
    response = client.post("/prepare/ingest", files=files)
    assert response.status_code == 200
    assert "Successfully ingested" in response.json()["message"]

    # Verify item was added
    response = client.get("/prepare/items")
    items = response.json()
    assert any(item["name"] == "ServerCSV" for item in items)
