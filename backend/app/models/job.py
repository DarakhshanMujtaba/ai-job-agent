import uuid
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    # Unique ID for each job record
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Basic job details
    title = Column(String, nullable=False)
    company = Column(String, nullable=True)
    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    # Original job posting URL (so the user can visit and apply)
    source_url = Column(String, nullable=True)

    # Which platform this job came from (e.g. "remoteok")
    source = Column(String, nullable=True)

    # Timestamp of when we fetched this job
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())