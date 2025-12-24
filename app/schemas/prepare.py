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

class NetworkScanBase(BaseModel):
    name: str
    target_range: str

class NetworkScanCreate(NetworkScanBase):
    pass

class NetworkScan(NetworkScanBase):
    id: str
    status: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    discovered_items: int = 0
    results: Optional[List[Dict[str, Any]]] = None
    model_config = ConfigDict(from_attributes=True)

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

class DataSourceBase(BaseModel):
    name: str
    source_type: str
    data_ingested: Optional[str] = None
    last_sync: Optional[str] = None
    records: int = 0
    sync_count: int = 0
    status: str = "Pending"
    process: bool = True
    config: Optional[Dict[str, Any]] = None
    rating: Optional[str] = None

class DataSourceCreate(DataSourceBase):
    pass

class DataSource(DataSourceBase):
    id: str
    model_config = ConfigDict(from_attributes=True)
