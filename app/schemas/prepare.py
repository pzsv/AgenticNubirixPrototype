from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from enum import Enum

class CIType(str, Enum):
    SERVER = "server"
    VIRTUAL_SERVER = "virtual_server"
    DATABASE = "database"
    CLUSTER = "cluster"
    APPLICATION = "application"
    NETWORK_DEVICE = "network_device"
    OTHER = "other"

class ConfigurationItemBase(BaseModel):
    name: str
    type: CIType
    description: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)

class ConfigurationItemCreate(ConfigurationItemBase):
    pass

class ConfigurationItem(ConfigurationItemBase):
    id: str
    model_config = ConfigDict(from_attributes=True)
