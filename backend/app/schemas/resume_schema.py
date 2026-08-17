from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, Any


class ResumeResponse(BaseModel):
    id: UUID
    user_id: UUID
    raw_text: str
    parsed_json: Optional[Any] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True