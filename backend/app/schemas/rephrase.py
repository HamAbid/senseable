from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict, Any

class Suggestion(BaseModel):
    phrase: str
    alternatives: List[str]
    position: Dict[str, int]

class RephraseRequest(BaseModel):
    text: str
    user_id: int = Field(alias='userId')
    preferences: Optional[Dict[str, Any]] = None
    
    class Config:
        populate_by_name = True

class RephraseResponse(BaseModel):
    rephrased_text: str
    suggestions: List[Suggestion]
    version: int

class RephraseHistoryResponse(BaseModel):
    id: int
    user_id: int
    original_text: str
    rephrased_text: str
    version: int
    created_at: datetime
    
    class Config:
        from_attributes = True
