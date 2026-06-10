print("STEP 1")
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
print("AUTH IMPORTED")


from app.routes.user_routes import (
    router as user_router
)
print("USER IMPORTED")

from app.routes.patient_routes import (
    router as patient_router
)
print("PATIENT IMPORTED")

from app.routes.doctor_routes import (
    router as doctor_router
)
print("DOCTOR IMPORTED")

from app.routes.guardian_routes import (
    router as guardian_router
)
print("GUARDIAN IMPORTED")

from app.routes.prescription_routes import (
    router as prescription_router
)
print("PRESCRIPTION IMPORTED")

from app.routes.reminder_routes import (
    router as reminder_router
)
print("REMINDER IMPORTED")

from app.routes.adherence_routes import (
    router as adherence_router
)
print("ADHERENCE IMPORTED")

from app.routes.risk_routes import (
    router as risk_router
)
print("RISK IMPORTED")

from app.routes.guardian_alert_routes import (
    router as guardian_alert_router
)
print("GUARDIAN ALERT IMPORTED")

from app.routes.medicine_agent_routes import (
    router as medicine_agent_router
)
print("MEDICINE AGENT IMPORTED")

from app.routes.medicine_chat_routes import (
    router as medicine_chat_router
)
print("MEDICINE CHAT IMPORTED")

from app.routes.ai_routes import (
    router as ai_router
)
print("AI IMPORTED")

from app.routes.assistant_routes import (
    router as assistant_router
)
print("ASSISTANT IMPORTED")

from app.routes.test_routes import (
    router as test_router
)
print("TEST IMPORTED")
# =====================================================
# FASTAPI APP
# =====================================================
print("FASTAPI APP CREATED")
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