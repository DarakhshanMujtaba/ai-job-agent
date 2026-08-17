from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.schemas.job_schema import JobResponse
from app.auth import get_current_user
from app.job_service import fetch_jobs_from_remoteok

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/fetch", response_model=List[JobResponse])
def fetch_and_save_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get fresh job listings from RemoteOK
    fetched_jobs = fetch_jobs_from_remoteok(limit=20)

    saved_jobs = []
    for job_data in fetched_jobs:
        # Avoid saving duplicate jobs (same title + company already in DB)
        existing = db.query(Job).filter(
            Job.title == job_data["title"],
            Job.company == job_data["company"]
        ).first()

        if existing:
            saved_jobs.append(existing)
            continue

        new_job = Job(**job_data)
        db.add(new_job)
        db.commit()
        db.refresh(new_job)
        saved_jobs.append(new_job)

    return saved_jobs


@router.get("/", response_model=List[JobResponse])
def list_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Return all jobs currently stored in the database
    jobs = db.query(Job).order_by(Job.fetched_at.desc()).all()
    return jobs