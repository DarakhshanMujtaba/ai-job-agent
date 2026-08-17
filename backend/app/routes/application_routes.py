from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.resume import Resume
from app.models.application import Application
from app.schemas.application_schema import FitScoreRequest, ApplicationResponse
from app.auth import get_current_user
from app.authenticity_checker import check_authenticity, check_for_injection
from app.llm_service import generate_fit_score, generate_tailored_content, generate_interview_prep

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("/fit-score", response_model=ApplicationResponse)
def calculate_fit_score(
    request: FitScoreRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify the resume belongs to this user and has been parsed already
    resume = db.query(Resume).filter(
        Resume.id == request.resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    if not resume.parsed_json:
        raise HTTPException(
            status_code=400,
            detail="This resume hasn't been parsed yet. Call /resume/{id}/parse first."
        )

    # Verify the job exists
    job = db.query(Job).filter(Job.id == request.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    # Call the LLM to generate the fit score and reasoning
    result = generate_fit_score(resume.parsed_json, job.description or "")

    # Save this as an application record
    new_application = Application(
        user_id=current_user.id,
        job_id=job.id,
        resume_id=resume.id,
        fit_score=result.get("fit_score"),
        fit_reasoning=result.get("reasoning"),
        status="suggested"
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


@router.get("/", response_model=list[ApplicationResponse])
def list_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Return all fit-score results for the logged-in user, best matches first
    applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).order_by(Application.fit_score.desc()).all()

    return applications

@router.post("/{application_id}/tailor", response_model=ApplicationResponse)
def tailor_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find the application, and make sure it belongs to the logged-in user
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    # Get the related resume and job
    resume = db.query(Resume).filter(Resume.id == application.resume_id).first()
    job = db.query(Job).filter(Job.id == application.job_id).first()

    if not resume or not resume.parsed_json:
        raise HTTPException(status_code=400, detail="Resume must be parsed first.")

    # Generate tailored resume summary and cover letter
    tailored = generate_tailored_content(
        resume.parsed_json,
        job.description or "",
        job.title
    )

    # Run the authenticity check on the generated cover letter
    authenticity = check_authenticity(tailored["cover_letter"])

    # Defense-in-depth: check if the LLM followed a hidden instruction
    # embedded in the job description (prompt injection)
    injection_check = check_for_injection(tailored["cover_letter"])
    authenticity["injection_check"] = injection_check

    # Save results
    application.tailored_summary = tailored["tailored_summary"]
    application.cover_letter = tailored["cover_letter"]
    application.authenticity_report = authenticity
    application.status = "tailored"

    db.commit()
    db.refresh(application)

    return application

@router.post("/{application_id}/interview-prep", response_model=ApplicationResponse)
def prepare_interview(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    resume = db.query(Resume).filter(Resume.id == application.resume_id).first()
    job = db.query(Job).filter(Job.id == application.job_id).first()

    if not resume or not resume.parsed_json:
        raise HTTPException(status_code=400, detail="Resume must be parsed first.")

    prep_data = generate_interview_prep(
        resume.parsed_json,
        job.description or "",
        job.title
    )

    application.interview_prep = prep_data

    db.commit()
    db.refresh(application)

    return application