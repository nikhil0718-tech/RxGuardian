from sqlalchemy import create_engine

from sqlalchemy.ext.declarative import (
    declarative_base
)

from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv

import os

# =========================================
# LOAD ENV
# =========================================

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

# =========================================
# ENGINE
# =========================================

engine = create_engine(
    DATABASE_URL
)

# =========================================
# SESSION
# =========================================

SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine
)

# =========================================
# BASE
# =========================================

Base = declarative_base()

# =========================================
# DB DEPENDENCY
# =========================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()