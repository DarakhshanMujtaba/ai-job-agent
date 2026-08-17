import pdfplumber
import docx
from fastapi import UploadFile, HTTPException
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract raw text from a PDF file's bytes."""
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract raw text from a DOCX file's bytes."""
    doc = docx.Document(io.BytesIO(file_bytes))
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text.strip()


def parse_resume_file(file: UploadFile, file_bytes: bytes) -> str:
    """Detect file type and extract text accordingly."""
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF or DOCX file."
        )