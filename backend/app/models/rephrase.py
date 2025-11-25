from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..database import Base

class RephraseHistory(Base):
    __tablename__ = "rephrase_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    original_text = Column(Text, nullable=False)
    rephrased_text = Column(Text, nullable=False)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, server_default=func.now())
