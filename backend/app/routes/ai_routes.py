import os
import tempfile

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.utils.ai_helper import (
    verify_tablet_logic
)
from app.models.user_model import User

router = APIRouter(

    prefix="/ai",

    tags=["AI Verification"]
)

# =====================================================
# NORMAL AI VERIFICATION
# =====================================================

@router.post("/verify-tablet/{patient_id}")

async def verify_tablet_api(

    patient_id: int,

    file: UploadFile = File(...),

    db: Session = Depends(get_db)
):

    # call the sync verify implementation
    return verify_tablet(patient_id, file, db)


# synchronous verify implementation reused by other routes
def verify_tablet(

    patient_id: int,

    file: UploadFile,

    db: Session
):

    image_path = None

    try:

        # =====================================
        # CREATE UPLOADS
        # =====================================

        os.makedirs("uploads", exist_ok=True)

        # =====================================
        # SAVE IMAGE
        # =====================================

        image_path = f"uploads/{file.filename}"

        with open(image_path, "wb") as buffer:

            # use sync file read
            buffer.write(file.file.read())

        # =====================================
        # AI VERIFY
        # =====================================

        result = verify_tablet_logic(patient_id=patient_id, image_path=image_path, db=db)

        print(result)

        return result

    except Exception as e:

        print("AI ERROR =", e)

        return {"status": "Verification Failed", "error": str(e)}

    finally:

        if image_path and os.path.exists(image_path):

            os.remove(image_path)


# =====================================================
# VERIFY TABLET BY EMAIL
# =====================================================


@router.post("/verify-tablet-email/{email}")

def verify_tablet_by_email(

    email: str,

    file: UploadFile = File(...),

    db: Session = Depends(get_db)
):

    patient = db.query(User).filter(User.email == email).first()

    if not patient:

        return {"status": "Patient Not Found"}

    patient_id = patient.id

    # =====================================
    # USE YOUR EXISTING VERIFY LOGIC
    # =====================================

    return verify_tablet(patient_id, file, db)