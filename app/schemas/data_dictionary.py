from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class StandardValueBase(BaseModel):
    value: str

class StandardValueCreate(StandardValueBase):
    field_id: str

class StandardValue(StandardValueBase):
    id: str
    field_id: str
    model_config = ConfigDict(from_attributes=True)

class DataFieldBase(BaseModel):
    name: str
    entity: str

class DataFieldCreate(DataFieldBase):
    pass

class DataField(DataFieldBase):
    id: str
    standard_values: List[StandardValue] = []
    model_config = ConfigDict(from_attributes=True)
