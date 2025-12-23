from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api import prepare, map as mapping, plan, move, evaluate, data_dictionary, data_entities
import os

app = FastAPI(
    title="Data Centre Migration Prototype",
    description="A prototype for planning and executing data centre migrations.",
    version="0.1.0"
)

# Include Routers
app.include_router(prepare.router)
app.include_router(mapping.router)
app.include_router(plan.router)
app.include_router(move.router)
app.include_router(evaluate.router)
app.include_router(data_dictionary.router)
app.include_router(data_entities.router)

# Mount Static Files
base_dir = os.path.dirname(os.path.abspath(__file__))
app.mount("/static", StaticFiles(directory=os.path.join(base_dir, "static")), name="static")

@app.get("/")
async def root():
    return FileResponse(os.path.join(base_dir, "static", "index.html"))

@app.get("/api-status")
async def api_status():
    return {
        "message": "Welcome to the Data Centre Migration Prototype API",
        "modules": [
            "Prepare: Ingest and manage CIs",
            "Map: Group CIs into workloads and define dependencies",
            "Plan: Organize workloads into migration waves",
            "Move: Generate and manage migration runbooks",
            "Evaluate: Dashboard and reports on migration progress and impact"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("APP_HOST", "0.0.0.0")
    port = int(os.getenv("APP_PORT", 8000))
    
    uvicorn.run(app, host=host, port=port)
