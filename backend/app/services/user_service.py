from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.user import User
from ..models.preference import UserPreference
from ..schemas.user import UserCreate, UserUpdate
from ..schemas.preference import UserPreferenceCreate, UserPreferenceUpdate

class UserService:
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        db_user = User(**user_data.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> Optional[User]:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        update_data = user_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_preferences(db: Session, user_id: int) -> Optional[UserPreference]:
        return db.query(UserPreference).filter(UserPreference.user_id == user_id).first()

    @staticmethod
    def create_preferences(db: Session, pref_data: UserPreferenceCreate) -> UserPreference:
        db_pref = UserPreference(**pref_data.model_dump())
        db.add(db_pref)
        db.commit()
        db.refresh(db_pref)
        return db_pref

    @staticmethod
    def update_preferences(
        db: Session,
        user_id: int,
        pref_data: UserPreferenceUpdate
    ) -> Optional[UserPreference]:
        pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
        
        if not pref:
            # Create new preferences if they don't exist
            create_data = pref_data.model_dump(exclude_unset=True)
            create_data['user_id'] = user_id
            pref = UserPreference(**create_data)
            db.add(pref)
        else:
            # Update existing preferences
            update_data = pref_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                if key != 'user_id':
                    setattr(pref, key, value)
        
        db.commit()
        db.refresh(pref)
        return pref

user_service = UserService()
