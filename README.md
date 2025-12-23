# Data Centre Migration Prototype

This is a FastAPI-based prototype for a Data Centre Migration application.

## Modules

1. **Prepare**: Ingest or manually input configuration items (Servers, VMs, DBs, etc.).
2. **Map**: Group CIs into workloads, define relationships and dependencies.
3. **Plan**: Organize workloads into migration waves and get strategy recommendations.
4. **Move**: Generate and manage migration runbooks based on templates.
5. **Evaluate**: View dashboards and reports on migration progress, TCO, ESG, and risks.

## Getting Started

### Prerequisites

- Python 3.8+
- Dependencies listed in `requirements.txt`

### Installation

```bash
pip install -r requirements.txt
```

### Running the Application

```bash
python main.py
```
The application UI will be available at `http://localhost:8000`.
Interactive API documentation (Swagger UI) is at `http://localhost:8000/docs`.
The raw API status can be checked at `http://localhost:8000/api-status`.

Alternatively, run with uvicorn:
```bash
uvicorn main:app --reload
```

### Troubleshooting: Address already in use

If you see `ERROR: [Errno 48] Address already in use`, it means port 8000 is taken.

**Option 1: Use a different port**
```bash
# Using python script
APP_PORT=8080 python main.py

# Using uvicorn directly
uvicorn main:app --reload --port 8080
```

**Option 2: Find and kill the process using port 8000**
```bash
# On macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Using the API

The application follows a linear workflow:
1. **Prepare**: Start by adding CIs via `POST /prepare/items` or uploading a CSV/Excel via `POST /prepare/ingest`.
2. **Map**: Group your CIs into workloads via `POST /map/workloads`.
3. **Plan**: Create migration waves via `POST /plan/waves`.
4. **Move**: Generate runbooks via `POST /move/generate/{workload_id}`.
5. **Evaluate**: Check the overall status at `GET /evaluate/dashboard`.

## Data Ingestion

All modules support CSV and Excel ingestion. 
Example CSV format for CIs:
```csv
name,type,description,properties
web-server-01,server,Production web server,"{""cpu"": 4, ""ram"": ""16GB""}"
```
