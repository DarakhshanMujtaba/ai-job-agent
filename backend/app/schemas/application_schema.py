from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, Any


class FitScoreRequest(BaseModel):
    resume_id: UUID
    job_id: UUID


class ApplicationResponse(BaseModel):
    id: UUID
    user_id: UUID
    job_id: UUID
    resume_id: UUID
    fit_score: Optional[int] = None
    fit_reasoning: Optional[str] = None
    tailored_summary: Optional[str] = None
    cover_letter: Optional[str] = None
    authenticity_report: Optional[Any] = None
    interview_prep: Optional[Any] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True