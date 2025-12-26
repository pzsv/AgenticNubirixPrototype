from fastapi.testclient import TestClient
from main import app
from app.config import settings

client = TestClient(app)

def test_api_status_config():
    response = client.get("/api-status")
    assert response.status_code == 200
    data = response.json()
    assert data["version"] == settings.app.version
    assert data["version_content"] == settings.app.version_content
    assert data["root_url"] == settings.app.root_url
    assert data["description"] == settings.app.description
    assert settings.app.title in data["message"]

def test_config_loading():
    assert settings.app.version == "0.1.0"
    assert settings.app.version_content == "Clean up project structure and add .gitignore"
    assert settings.database.url == "sqlite:///./prototype.db"
    assert settings.app.host == "0.0.0.0"
    assert settings.app.port == 8000
    assert settings.app.reload is True
