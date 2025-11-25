from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.user import UserCreate, UserUpdate, UserResponse
from ..schemas.preference import UserPreferenceUpdate, UserPreferenceResponse
from ..services.user_service import user_service

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/register", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user - simple version for demo"""
    # Check if user already exists
    existing_user = user_service.get_user_by_email(db, user_data.email)
    if existing_user:
        # For demo, just return existing user
        return UserResponse.model_validate(existing_user)
    
    # Create user
    user = user_service.create_user(db, user_data)
    return UserResponse.model_validate(user)

@router.get("/profile/{user_id}", response_model=UserResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    """Get user profile"""
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)

@router.put("/profile/{user_id}", response_model=UserResponse)
def update_profile(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    """Update user profile"""
    user = user_service.update_user(db, user_id, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)

@router.get("/preferences/{user_id}", response_model=UserPreferenceResponse)
def get_preferences(user_id: int, db: Session = Depends(get_db)):
    """Get user preferences"""
    preferences = user_service.get_preferences(db, user_id)
    if not preferences:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return UserPreferenceResponse.model_validate(preferences)

@router.put("/preferences/{user_id}", response_model=UserPreferenceResponse)
def update_preferences(
    user_id: int,
    pref_data: UserPreferenceUpdate,
    db: Session = Depends(get_db)
):
    """Update user preferences"""
    preferences = user_service.update_preferences(db, user_id, pref_data)
    return UserPreferenceResponse.model_validate(preferences)
