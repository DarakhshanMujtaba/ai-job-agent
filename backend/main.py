from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
from app.routes.resume_routes import router as resume_router
from app.routes.job_routes import router as job_router
from app.routes.application_routes import router as application_router

app = FastAPI(title="AI Job Application Agent")

# TODO: add the deployed Vercel frontend URL (e.g. "https://your-app.vercel.app")
# to allow_origins once it's known, or the production frontend won't be able to
# call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
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