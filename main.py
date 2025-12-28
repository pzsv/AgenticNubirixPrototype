from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api import prepare, map as mapping, plan, move, evaluate, data_dictionary, data_entities, discovered_data, environments, move_principles, score_card, users, admin_project
from app.config import settings
import os

app = FastAPI(
    title=settings.app.title,
    description=settings.app.description,
    version=settings.app.version
)

# Include Routers
app.include_router(prepare.router)
app.include_router(mapping.router)
app.include_router(plan.router)
app.include_router(move.router)
app.include_router(evaluate.router)
app.include_router(data_dictionary.router)
app.include_router(data_entities.router)
app.include_router(discovered_data.router)
app.include_router(environments.router)
app.include_router(move_principles.router)
app.include_router(score_card.router)
app.include_router(users.router)
app.include_router(admin_project.router)

# Mount Static Files
base_dir = os.path.dirname(os.path.abspath(__file__))
app.mount("/static", StaticFiles(directory=os.path.join(base_dir, "static")), name="static")

@app.get("/")
async def root():
    return FileResponse(os.path.join(base_dir, "static", "index.html"))

@app.get("/api-status")
async def api_status():
    return {
        "message": f"Welcome to the {settings.app.title}",
        "version": settings.app.version,
        "version_content": settings.app.version_content,
        "root_url": settings.app.root_url,
        "description": settings.app.description,
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
    
    host = os.getenv("APP_HOST", settings.app.host)
    port = int(os.getenv("APP_PORT", str(settings.app.port)))
    reload = os.getenv("APP_RELOAD", str(settings.app.reload)).lower() == "true"
    
    uvicorn.run("main:app", host=host, port=port, reload=reload)
