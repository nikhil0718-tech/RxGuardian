from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

import threading
import time

# =====================================================
# DATABASE
# =====================================================

from app.config.database import (
    get_db
)

# =====================================================
# ADVANCED REMINDER ENGINE
# =====================================================

from app.utils.advanced_reminder_scheduler import (
    process_reminders
)

# =====================================================
# IMPORT ROUTES
# =====================================================

from app.routes.auth_routes import (
    router as auth_router
)

from app.routes.user_routes import (
    router as user_router
)

from app.routes.patient_routes import (
    router as patient_router
)

from app.routes.doctor_routes import (
    router as doctor_router
)

from app.routes.guardian_routes import (
    router as guardian_router
)

from app.routes.prescription_routes import (
    router as prescription_router
)

from app.routes.reminder_routes import (
    router as reminder_router
)

from app.routes.adherence_routes import (
    router as adherence_router
)

from app.routes.risk_routes import (
    router as risk_router
)

from app.routes.guardian_alert_routes import (
    router as guardian_alert_router
)

from app.routes.medicine_agent_routes import (
    router as medicine_agent_router
)

from app.routes.medicine_chat_routes import (
    router as medicine_chat_router
)

from app.routes.ai_routes import (
    router as ai_router
)

from app.routes.assistant_routes import (
    router as assistant_router
)

from app.routes.test_routes import (
    router as test_router
)

# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI(

    title="RxGuardian API",

    version="2.0.0"
)

# =====================================================
# CORS CONFIGURATION
# =====================================================

app.add_middleware(

    CORSMiddleware,
    allow_origins=["*"],
    # allow_origins=[

    #     "http://localhost:5173",

    #     "http://127.0.0.1:5173"
    # ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =====================================================
# INCLUDE ROUTERS
# =====================================================

app.include_router(auth_router)

app.include_router(user_router)

app.include_router(patient_router)

app.include_router(doctor_router)

app.include_router(guardian_router)

app.include_router(prescription_router)

app.include_router(reminder_router)

app.include_router(adherence_router)

app.include_router(risk_router)
 
from app.routes.medicine_agent_routes import (
    router as medicine_agent_router
)

app.include_router(
    medicine_agent_router
)

app.include_router(guardian_alert_router)

app.include_router(ai_router)

app.include_router(assistant_router)

app.include_router(test_router)

app.include_router(
    medicine_chat_router
)

# =====================================================
# ADVANCED REMINDER BACKGROUND ENGINE
# =====================================================

def reminder_background():

    while True:

        try:

            db = next(get_db())

            process_reminders(db)

            print(
                "Checking reminders..."
            )

        except Exception as e:

            print(
                "REMINDER ENGINE ERROR:",
                e
            )

        time.sleep(60)

# =====================================================
# START BACKGROUND THREAD
# =====================================================



print(
    "Advanced Reminder Scheduler Started"
)

# =====================================================
# HOME ROUTE
# =====================================================

@app.get("/")

def home():

    return {

        "message":
        "RxGuardian Backend Running Successfully"
    }

# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")

def health_check():

    return {

        "status": "healthy",

        "backend": "running",

        "project": "RxGuardian"
    }

@app.on_event("startup")
def startup_event():

    threading.Thread(
        target=reminder_background,
        daemon=True
    ).start()

    print("Advanced Reminder Scheduler Started")