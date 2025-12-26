from pydantic import BaseModel
from typing import List, Optional

class AccessRightBase(BaseModel):
    feature: str
    read: bool = False
    write: bool = False
    delete: bool = False
    execute: bool = False

class AccessRight(AccessRightBase):
    id: int
    role_id: int

    class Config:
        from_attributes = True

class RoleBase(BaseModel):
    name: str

class Role(RoleBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    role_id: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: Optional[Role] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    id: int
    username: str
    role: str
    access_rights: List[AccessRightBase]
