from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(BaseModel):
    """Schema for user registration - accepts name and optional profile data"""
    name: str
    email: Optional[EmailStr] = None
    # Optional demographic fields
    ageRange: Optional[str] = None
    gender: Optional[str] = None
    country: Optional[str] = None
    languagePreference: Optional[str] = None
    accessibilityNeeds: Optional[list] = None
    otherAccessibilityText: Optional[str] = None
    additionalSupport: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr

class TokenResponse(BaseModel):
    user: UserResponse
    token: str
