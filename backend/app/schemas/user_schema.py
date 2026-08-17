from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID


# Schema for signup request - what the client sends us
class UserCreate(BaseModel):
    email: EmailStr
    password: str


# Schema for login request
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Schema for what we send back to the client (never include password_hash!)
class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True  # allows conversion from SQLAlchemy model


# Schema for the JWT token response
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"