from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.user_model import User

from app.schemas.auth_schema import (
    RegisterSchema,
    LoginSchema
)

from app.utils.password_hash import (
    hash_password,
    verify_password
)

from app.utils.jwt_handler import (
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# REGISTER API

@router.post("/register")
def register_user(
    user: RegisterSchema,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(

        name=user.name,

        email=user.email,

        password=hashed_password,

        role=user.role,

        guardian_name=user.guardian_name,

        guardian_email=user.guardian_email,

        guardian_phone=user.guardian_phone
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# LOGIN API
@router.post("/login")
def login_user(
    user: LoginSchema,
    db: Session = Depends(get_db)
):

    print("================================")
    print("LOGIN ATTEMPT")
    print("EMAIL =", user.email)
    print("================================")

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        print("USER NOT FOUND")

        raise HTTPException(
            status_code=401,
            detail="Invalid email"
        )

    print("USER FOUND =", db_user.email)
    print("ROLE =", db_user.role)

    valid_password = verify_password(
        user.password,
        db_user.password
    )

    print("PASSWORD MATCH =", valid_password)

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    access_token = create_access_token(
        data={
            "user_id": db_user.id,
            "email": db_user.email,
            "role": db_user.role
        }
    )

    print("LOGIN SUCCESS")

    return {

        "access_token": access_token,

        "token_type": "bearer",

        "user": {

            "id": db_user.id,

            "name": db_user.name,

            "email": db_user.email,

            "role": db_user.role,

            "guardian_name":
            db_user.guardian_name,

            "guardian_email":
            db_user.guardian_email,

            "guardian_phone":
            db_user.guardian_phone
        }
    }