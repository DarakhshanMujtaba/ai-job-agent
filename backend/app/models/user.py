import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    # Unique ID for each user (auto-generated UUID)
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # User's email - must be unique
    email = Column(String, unique=True, index=True, nullable=False)

    # Hashed password (never store plain text passwords)
    password_hash = Column(String, nullable=False)

    # Timestamp for when the user was created
    created_at = Column(DateTime(timezone=True), server_default=func.now())