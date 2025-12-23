from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class DataEntityFieldBase(BaseModel):
    name: str
    anchor: Optional[str] = None

class DataEntityFieldCreate(DataEntityFieldBase):
    entity_id: str

class DataEntityField(DataEntityFieldBase):
    id: str
    entity_id: str
    model_config = ConfigDict(from_attributes=True)

class DataEntityBase(BaseModel):
    name: str

class DataEntityCreate(DataEntityBase):
    key_field_id: Optional[str] = None

class DataEntity(DataEntityBase):
    id: str
    key_field_id: Optional[str] = None
    fields: List[DataEntityField] = []
    model_config = ConfigDict(from_attributes=True)
