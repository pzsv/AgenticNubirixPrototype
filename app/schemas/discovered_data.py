from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class DiscoveredDataFieldBase(BaseModel):
    field_name: str
    field_value: str
    rating: Optional[str] = None
    created_time: Optional[str] = None

class DiscoveredDataFieldCreate(DiscoveredDataFieldBase):
    discovered_data_entity_id: str

class DiscoveredDataField(DiscoveredDataFieldBase):
    id: str
    discovered_data_entity_id: str
    model_config = ConfigDict(from_attributes=True)

class DiscoveredDataEntityBase(BaseModel):
    source_type: str
    user: str
    data_entity_name: str
    created_time: Optional[str] = None
    status: str = "Ingestion"

class DiscoveredDataEntityCreate(DiscoveredDataEntityBase):
    pass

class DiscoveredDataEntity(DiscoveredDataEntityBase):
    id: str
    fields: List[DiscoveredDataField] = []
    model_config = ConfigDict(from_attributes=True)
