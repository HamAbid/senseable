from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.rephrase import RephraseRequest, RephraseResponse, RephraseHistoryResponse
from ..models.rephrase import RephraseHistory
from ..services.ai_service import ai_service
from ..services.user_service import user_service
from ..services.tag_service import tag_service

router = APIRouter(prefix="/api/rephrase", tags=["rephrase"])

@router.post("", response_model=RephraseResponse)
def rephrase_text(request: RephraseRequest, db: Session = Depends(get_db)):
    """Rephrase text based on user preferences"""
    # Get user preferences
    user = user_service.get_user_by_id(db, request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    preferences = user_service.get_preferences(db, request.user_id)
    
    # Get user's tags for context
    tags = tag_service.get_tags_by_user(db, request.user_id)
    tagged_phrases = [
        {"phrase": tag.phrase, "level": tag.familiarity_level}
        for tag in tags
    ]
    
    # Rephrase using AI service
    result = ai_service.rephrase_text(
        text=request.text,
        accessibility_need=preferences.accessibility_need if preferences else None,
        reading_level=preferences.reading_level if preferences else None,
        preferred_complexity=preferences.preferred_complexity if preferences else None,
        tagged_phrases=tagged_phrases
    )
    
    # Save to history
    history = RephraseHistory(
        user_id=request.user_id,
        original_text=request.text,
        rephrased_text=result["rephrased_text"],
        version=1
    )
    db.add(history)
    db.commit()
    
    return RephraseResponse(
        rephrased_text=result["rephrased_text"],
        suggestions=result["suggestions"],
        version=1
    )

@router.post("/regenerate", response_model=RephraseResponse)
def regenerate_rephrase(request: RephraseRequest, db: Session = Depends(get_db)):
    """Regenerate a new version of rephrased text"""
    # Get user preferences
    user = user_service.get_user_by_id(db, request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    preferences = user_service.get_preferences(db, request.user_id)
    
    # Get user's tags
    tags = tag_service.get_tags_by_user(db, request.user_id)
    tagged_phrases = [
        {"phrase": tag.phrase, "level": tag.familiarity_level}
        for tag in tags
    ]
    
    # Get current version count
    version_count = db.query(RephraseHistory).filter(
        RephraseHistory.user_id == request.user_id,
        RephraseHistory.original_text == request.text
    ).count()
    
    new_version = version_count + 1
    
    # Rephrase using AI service
    result = ai_service.rephrase_text(
        text=request.text,
        accessibility_need=preferences.accessibility_need if preferences else None,
        reading_level=preferences.reading_level if preferences else None,
        preferred_complexity=preferences.preferred_complexity if preferences else None,
        tagged_phrases=tagged_phrases
    )
    
    # Save to history
    history = RephraseHistory(
        user_id=request.user_id,
        original_text=request.text,
        rephrased_text=result["rephrased_text"],
        version=new_version
    )
    db.add(history)
    db.commit()
    
    return RephraseResponse(
        rephrased_text=result["rephrased_text"],
        suggestions=result["suggestions"],
        version=new_version
    )

@router.get("/history/{user_id}", response_model=List[RephraseHistoryResponse])
def get_rephrase_history(user_id: int, db: Session = Depends(get_db)):
    """Get rephrase history for a user"""
    history = db.query(RephraseHistory).filter(
        RephraseHistory.user_id == user_id
    ).order_by(RephraseHistory.created_at.desc()).limit(50).all()
    
    return [RephraseHistoryResponse.model_validate(h) for h in history]
