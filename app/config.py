import yaml
import os
from pydantic import BaseModel
from typing import Optional

class AppConfig(BaseModel):
    title: str
    description: str
    version: str
    version_content: str
    root_url: str
    host: str
    port: int
    reload: bool

class DatabaseConfig(BaseModel):
    url: str
    username: Optional[str] = ""
    password: Optional[str] = ""

class Config(BaseModel):
    app: AppConfig
    database: DatabaseConfig

def load_config(config_path: str = "config.yaml") -> Config:
    # If the path is not absolute, try to find it relative to the project root
    if not os.path.isabs(config_path) and not os.path.exists(config_path):
        current_file_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(current_file_dir)
        config_path_in_root = os.path.join(project_root, config_path)
        if os.path.exists(config_path_in_root):
            config_path = config_path_in_root

    if not os.path.exists(config_path):
        # Provide some defaults if file doesn't exist, or raise a better error
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
        
    with open(config_path, "r") as f:
        config_dict = yaml.safe_load(f)
    return Config(**config_dict)

settings = load_config()
