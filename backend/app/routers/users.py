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
    """Register a new user - creates user and stores profile data in preferences"""
    # Create user
    user = user_service.create_user(db, user_data)
    
    # If demographic data is provided, create initial preferences
    if user_data.ageRange or user_data.gender or user_data.country:
        from ..schemas.preference import UserPreferenceUpdate
        other_prefs = {
            'ageRange': user_data.ageRange,
            'gender': user_data.gender,
            'country': user_data.country,
            'languagePreference': user_data.languagePreference,
            'accessibilityNeeds': user_data.accessibilityNeeds or [],
            'otherAccessibilityText': user_data.otherAccessibilityText,
            'additionalSupport': user_data.additionalSupport,
        }
        
        pref_data = UserPreferenceUpdate(
            accessibility_need='none',
            reading_level='intermediate',
            preferred_complexity='moderate',
            other_preferences=other_prefs
        )
        user_service.update_preferences(db, user.id, pref_data)
    
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
