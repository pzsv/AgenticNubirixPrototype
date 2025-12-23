from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class RawDataEntityFieldBase(BaseModel):
    field_name: str
    field_value: str
    rating: Optional[str] = None
    created_time: Optional[str] = None

class RawDataEntityFieldCreate(RawDataEntityFieldBase):
    raw_data_entity_id: str

class RawDataEntityField(RawDataEntityFieldBase):
    id: str
    raw_data_entity_id: str
    model_config = ConfigDict(from_attributes=True)

class RawDataEntityBase(BaseModel):
    source_type: str
    user: str
    data_entity_name: str
    created_time: Optional[str] = None

class RawDataEntityCreate(RawDataEntityBase):
    pass

class RawDataEntity(RawDataEntityBase):
    id: str
    fields: List[RawDataEntityField] = []
    model_config = ConfigDict(from_attributes=True)
