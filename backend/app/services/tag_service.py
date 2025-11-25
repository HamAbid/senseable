from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.tag import Tag
from ..schemas.tag import TagCreate, TagUpdate

class TagService:
    @staticmethod
    def create_tag(db: Session, tag_data: TagCreate) -> Tag:
        db_tag = Tag(**tag_data.model_dump())
        db.add(db_tag)
        db.commit()
        db.refresh(db_tag)
        return db_tag

    @staticmethod
    def get_tags_by_user(db: Session, user_id: int) -> List[Tag]:
        return db.query(Tag).filter(Tag.user_id == user_id).all()

    @staticmethod
    def get_tag_by_id(db: Session, tag_id: int) -> Optional[Tag]:
        return db.query(Tag).filter(Tag.id == tag_id).first()

    @staticmethod
    def update_tag(db: Session, tag_id: int, tag_data: TagUpdate) -> Optional[Tag]:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            return None
        
        update_data = tag_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(tag, key, value)
        
        db.commit()
        db.refresh(tag)
        return tag

    @staticmethod
    def delete_tag(db: Session, tag_id: int) -> bool:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            return False
        
        db.delete(tag)
        db.commit()
        return True

tag_service = TagService()
