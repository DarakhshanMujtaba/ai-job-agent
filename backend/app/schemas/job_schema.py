from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class JobResponse(BaseModel):
    id: UUID
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    source_url: Optional[str] = None
    source: Optional[str] = None
    fetched_at: datetime

    class Config:
        from_attributes = True