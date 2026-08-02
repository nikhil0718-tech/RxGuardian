from fastapi import APIRouter, Depends

from app.middleware.role_middleware import (
    role_required
)

router = APIRouter(
    prefix="/patient",
    tags=["Patient"]
)


@router.get("/dashboard")
def patient_dashboard(
    user=Depends(role_required(["patient"]))
):

    return {
        "message": "Welcome Patient",
        "user": user
    }