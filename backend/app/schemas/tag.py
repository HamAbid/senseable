from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TagBase(BaseModel):
    phrase: str
    familiarity_level: str

class TagCreate(TagBase):
    user_id: int

class TagUpdate(BaseModel):
    phrase: Optional[str] = None
    familiarity_level: Optional[str] = None

class TagResponse(TagBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
