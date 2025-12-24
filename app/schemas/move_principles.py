from pydantic import BaseModel
from typing import Optional

class MovePrincipleBase(BaseModel):
    name: str
    description: Optional[str] = None

class MovePrincipleCreate(MovePrincipleBase):
    pass

class MovePrincipleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class MovePrinciple(MovePrincipleBase):
    id: str

    class Config:
        from_attributes = True
