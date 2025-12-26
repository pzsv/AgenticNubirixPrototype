from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import models
from app.schemas.users import User, UserCreate, Role, AccessRight, LoginRequest, LoginResponse, AccessRightBase

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user or user.password != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    role = db.query(models.Role).filter(models.Role.id == user.role_id).first()
    access_rights = db.query(models.AccessRight).filter(models.AccessRight.role_id == user.role_id).all()
    
    return {
        "id": user.id,
        "username": user.username,
        "role": role.name,
        "access_rights": [
            {
                "feature": ar.feature,
                "read": ar.read,
                "write": ar.write,
                "delete": ar.delete,
                "execute": ar.execute
            } for ar in access_rights
        ]
    }

@router.get("/", response_model=List[User])
async def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.get("/roles", response_model=List[Role])
async def list_roles(db: Session = Depends(get_db)):
    return db.query(models.Role).all()

@router.get("/access-rights/{role_id}", response_model=List[AccessRight])
async def get_access_rights(role_id: int, db: Session = Depends(get_db)):
    return db.query(models.AccessRight).filter(models.AccessRight.role_id == role_id).all()

@router.post("/", response_model=User)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
