from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
from app.routes.resume_routes import router as resume_router
from app.routes.job_routes import router as job_router
from app.routes.application_routes import router as application_router

app = FastAPI(title="AI Job Application Agent")

# allow_origin_regex covers Vercel's preview/production subdomains, which are
# assigned randomly (e.g. "https://ai-job-agent-xyz123.vercel.app"), so there's
# no single fixed URL to list in allow_origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(application_router)


@app.get("/")
def read_root():
    return {"message": "AI Job Application Agent backend is running!"}