from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    accessibility_need = Column(String(100))
    reading_level = Column(String(50))
    preferred_complexity = Column(String(50))
    color_palette = Column(JSON)
    other_preferences = Column(JSON)
