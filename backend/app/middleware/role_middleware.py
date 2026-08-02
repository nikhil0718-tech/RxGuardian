from fastapi import Depends, HTTPException

from app.middleware.jwt_middleware import (
    verify_token
)


def role_required(allowed_roles: list):

    def role_checker(
        user=Depends(verify_token)
    ):

        if user["role"] not in allowed_roles:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return user

    return role_checker