from pydantic import BaseModel
from typing import Optional

class EnvironmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class EnvironmentCreate(EnvironmentBase):
    pass

class EnvironmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class Environment(EnvironmentBase):
    id: str

    class Config:
        from_attributes = True
