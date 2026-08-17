import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the database engine (handles the actual connection)
engine = create_engine(DATABASE_URL)

# Session factory - creates a new session for each request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that our database models (tables) will inherit from
Base = declarative_base()

# Dependency function - FastAPI routes use this to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()