from pydantic import BaseModel
from typing import Optional, Dict, Any

class UserPreferenceBase(BaseModel):
    accessibility_need: Optional[str] = None
    reading_level: Optional[str] = None
    preferred_complexity: Optional[str] = None
    color_palette: Optional[Dict[str, str]] = None
    other_preferences: Optional[Dict[str, Any]] = None

class UserPreferenceCreate(UserPreferenceBase):
    user_id: int

class UserPreferenceUpdate(UserPreferenceBase):
    pass

class UserPreferenceResponse(BaseModel):
    id: int
    user_id: int
    accessibility_need: Optional[str] = None
    reading_level: Optional[str] = None
    preferred_complexity: Optional[str] = None
    color_palette: Optional[Dict[str, str]] = None
    other_preferences: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True
