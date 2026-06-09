from pydantic import BaseModel
from typing import Literal
from typing import Optional


class RegisterSchema(BaseModel):

    name: str

    email: str

    password: str

    role: Literal[
        "patient",
        "doctor",
        "guardian"
    ]

    # =====================================
    # GUARDIAN DETAILS
    # =====================================

    guardian_name: Optional[str] = None

    guardian_email: Optional[str] = None

    guardian_phone: Optional[str] = None


class LoginSchema(BaseModel):

    email: str

    password: str