from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume_schema import ResumeResponse
from app.auth import get_current_user
from app.resume_parser import parse_resume_file
from app.llm_service import parse_resume_with_llm

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Read the uploaded file's raw bytes
    file_bytes = await file.read()

    # Extract text based on file type (PDF or DOCX)
    extracted_text = parse_resume_file(file, file_bytes)

    # Save the resume record in the database, linked to the logged-in user
    new_resume = Resume(
        user_id=current_user.id,
        raw_text=extracted_text
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume


@router.post("/{resume_id}/parse", response_model=ResumeResponse)
def parse_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find the resume, and make sure it belongs to the logged-in user
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    # Call the LLM to convert raw text into structured JSON
    structured_data = parse_resume_with_llm(resume.raw_text)

    # Save the structured data back into the database
    resume.parsed_json = structured_data
    db.commit()
    db.refresh(resume)

    return resume