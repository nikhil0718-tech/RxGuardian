from fastapi import APIRouter, Depends

from app.middleware.jwt_middleware import (
    verify_token
)

router = APIRouter(
    prefix="/user",
    tags=["User"]
)


@router.get("/me")
def current_user(
    user=Depends(verify_token)
):

    return {
        "message": "Authenticated User",
        "user": user
    }