import uuid
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    # Unique ID for each application record
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Which user and which job this application links together
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), nullable=False)

    # AI-generated fit score (0-100) and its plain-language reasoning
    fit_score = Column(Integer, nullable=True)
    fit_reasoning = Column(Text, nullable=True)

    # Tailored content generated for this specific job
    tailored_summary = Column(Text, nullable=True)
    cover_letter = Column(Text, nullable=True)

    # Authenticity check results - flagged AI-cliche phrases and a human-likeness note
    authenticity_report = Column(JSONB, nullable=True)

    # AI-generated interview preparation questions and answer drafts
    interview_prep = Column(JSONB, nullable=True)

    # Tracks where this application stands: 'suggested', 'tailored', 'applied', 'rejected', etc.
    status = Column(String, default="suggested")

    created_at = Column(DateTime(timezone=True), server_default=func.now())