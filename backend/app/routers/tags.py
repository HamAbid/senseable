from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.tag import TagCreate, TagUpdate, TagResponse
from ..schemas.rephrase import Suggestion
from ..services.tag_service import tag_service

router = APIRouter(prefix="/api/tags", tags=["tags"])

@router.post("", response_model=TagResponse)
def create_tag(tag_data: TagCreate, db: Session = Depends(get_db)):
    """Create a new tag"""
    tag = tag_service.create_tag(db, tag_data)
    return TagResponse.model_validate(tag)

@router.get("/{user_id}", response_model=List[TagResponse])
def get_tags(user_id: int, db: Session = Depends(get_db)):
    """Get all tags for a user"""
    tags = tag_service.get_tags_by_user(db, user_id)
    return [TagResponse.model_validate(tag) for tag in tags]

@router.put("/{tag_id}", response_model=TagResponse)
def update_tag(tag_id: int, tag_data: TagUpdate, db: Session = Depends(get_db)):
    """Update a tag"""
    tag = tag_service.update_tag(db, tag_id, tag_data)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return TagResponse.model_validate(tag)

@router.delete("/{tag_id}")
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    """Delete a tag"""
    success = tag_service.delete_tag(db, tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tag not found")
    return {"message": "Tag deleted successfully"}

@router.get("/suggestions/{phrase}", response_model=Suggestion)
def get_suggestions(phrase: str):
    """Get rephrase suggestions for a phrase"""
    # Simplified suggestions - in production, could use AI
    return Suggestion(
        phrase=phrase,
        alternatives=[
            f"Simpler: {phrase}",
            f"Easier: {phrase}",
            f"Plain language: {phrase}"
        ],
        position={"start": 0, "end": len(phrase)}
    )
