import uuid
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    # Unique ID for each resume record
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Link this resume to the user who uploaded it
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Raw extracted text from the uploaded file
    raw_text = Column(Text, nullable=False)

    # Structured data (skills, experience, education) - filled in later by AI parsing
    parsed_json = Column(JSONB, nullable=True)

    # Timestamp
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())