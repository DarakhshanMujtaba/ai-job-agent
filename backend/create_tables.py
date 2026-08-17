from app.database import engine, Base
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.application import Application

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")