# RxGuardian Interview-Ready Project Documentation

This document is based only on the code present in the workspace under [backend](../backend) and [frontend](../frontend).

---

## 1) Project Overview

### Purpose
RxGuardian is a full-stack healthcare application focused on medication safety, adherence tracking, doctor oversight, guardian monitoring, and AI-assisted medicine verification.

### Problem Solved
The project helps patients take the correct medicine at the right time by combining:
- prescription management
- reminder workflows
- guardian alerts
- AI image-based medicine verification
- conversational medicine assistance

### Primary Users
- Patients
- Doctors
- Guardians

### Objectives
- Improve medicine adherence
- Reduce wrong-medicine intake risk
- Give doctors visibility into patient adherence
- Give guardians live medication monitoring
- Provide AI-based medicine recognition and explanation

### Unique Features
- CNN + OCR hybrid medicine verification
- Reminder workflow tied to prescriptions
- Guardian alerting for missed doses
- Medicine assistant for medicine-related questions
- Prescription PDF generation
- Role-based dashboards for patient, doctor, and guardian

### 30-Second Project Explanation
RxGuardian is a healthcare platform that helps patients manage medications safely through AI medicine verification, reminders, prescription tracking, and guardian alerts. It combines a React frontend with a FastAPI backend and a deep-learning medicine recognition pipeline.

### 1-Minute Project Explanation
RxGuardian is a smart medication management platform built for patients, doctors, and guardians. Patients can view prescriptions, receive reminders, upload medicine images for AI verification, and ask the assistant about their medicine. Doctors can create prescriptions and monitor adherence, while guardians can track missed doses and view reports. The system combines FastAPI, SQLAlchemy, React, CNN-based image recognition, OCR, and LLM-based assistance.

### 3-Minute Project Explanation
RxGuardian is a multi-role healthcare application that brings medication safety into one platform. On the backend, FastAPI routers handle authentication, prescriptions, reminders, adherence, guardian alerts, AI verification, and medicine assistance. The AI module uses a TensorFlow/Keras CNN model and EasyOCR to verify medicine images, then combines the results with a hybrid confidence logic. The frontend is a React + Vite app with role-based dashboards and a floating assistant. The database is PostgreSQL accessed via SQLAlchemy ORM models such as User, PrescriptionSession, Prescription, Reminder, GuardianAlert, Adherence, and RiskStatus. The project also includes a retrieval-based RAG component using ChromaDB and sentence embeddings for medicine safety-related questions.

---

## 2) Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- Lucide icons

Why used:
- The app uses React for a modern, component-based UI.
- Vite provides a fast dev/build experience.
- React Router handles role-based navigation.
- Tailwind and Framer Motion are used for polished UI and animations.
- Recharts powers healthcare dashboards and charts.

Where used:
- [frontend/src/App.jsx](../frontend/src/App.jsx)
- [frontend/src/pages](../frontend/src/pages)
- [frontend/src/layouts](../frontend/src/layouts)
- [frontend/src/components](../frontend/src/components)

### Backend
- FastAPI
- SQLAlchemy ORM
- Pydantic
- Python

Why used:
- FastAPI provides a clear API layer for routers and dependency injection.
- SQLAlchemy models the relational database cleanly.
- Pydantic schemas are used for request validation and structured payloads.

Where used:
- [backend/app/main.py](../backend/app/main.py)
- [backend/app/routes](../backend/app/routes)
- [backend/app/models](../backend/app/models)
- [backend/app/schemas](../backend/app/schemas)

### Database
- PostgreSQL via SQLAlchemy
- Neon database URL configured in environment variables

Why used:
- The backend uses a relational database for users, prescriptions, reminders, alerts, and adherence data.

Where used:
- [backend/app/config/database.py](../backend/app/config/database.py)
- [backend/.env](../backend/.env)

### AI/ML
- TensorFlow/Keras
- OpenCV
- NumPy
- Pillow
- PyTorch
- RapidFuzz

Why used:
- TensorFlow/Keras loads the medicine recognition model.
- OpenCV and NumPy support image preprocessing.
- RapidFuzz compares OCR text to predicted medicine names.

Where used:
- [backend/ai_engine/inference/predictor.py](../backend/ai_engine/inference/predictor.py)
- [backend/ai_engine/inference/hybrid_engine.py](../backend/ai_engine/inference/hybrid_engine.py)
- [backend/ai_engine/ocr/ocr_engine.py](../backend/ai_engine/ocr/ocr_engine.py)
- [backend/ai_engine/model/preprocessing.py](../backend/ai_engine/model/preprocessing.py)

### OCR
- EasyOCR

Why used:
- The system extracts visible text from medicine images to supplement CNN predictions.

Where used:
- [backend/ai_engine/ocr/ocr_engine.py](../backend/ai_engine/ocr/ocr_engine.py)

### Authentication
- JWT with Python-JOSE
- Password hashing with Passlib + bcrypt
- HTTP Bearer auth

Why used:
- JWT secures protected routes.
- Password hashing protects stored credentials.

Where used:
- [backend/app/middleware/jwt_middleware.py](../backend/app/middleware/jwt_middleware.py)
- [backend/app/utils/jwt_handler.py](../backend/app/utils/jwt_handler.py)
- [backend/app/utils/password_hash.py](../backend/app/utils/password_hash.py)

### Deployment
- Frontend configured for Vercel via [frontend/vercel.json](../frontend/vercel.json)
- Backend is a FastAPI service intended to run as an API server

Why used:
- Vercel is configured for SPA routing.
- The backend is designed as a stateless API service.

Where used:
- [frontend/vercel.json](../frontend/vercel.json)
- [frontend/src/api/api.js](../frontend/src/api/api.js)

### Cloud / External Services
- Neon PostgreSQL from environment variable
- Groq LLM API
- ChromaDB for vector storage / retrieval

Why used:
- Groq powers generated summaries and assistant responses.
- ChromaDB enables retrieval-based question answering for medicine safety queries.

Where used:
- [backend/.env](../backend/.env)
- [backend/app/services/groq_service.py](../backend/app/services/groq_service.py)
- [backend/app/services/assistant_service.py](../backend/app/services/assistant_service.py)
- [backend/app/rag/retriever.py](../backend/app/rag/retriever.py)

---

## 3) Architecture

### Frontend Architecture
The frontend is a React + Vite app with page-based routing and layout wrappers:
- landing pages
- authentication pages
- patient dashboard and subpages
- doctor dashboard and prescription pages
- guardian dashboard and monitoring pages

### Backend Architecture
The backend is a modular FastAPI service with:
- router modules for each domain
- dependency-based database session handling
- middleware for JWT and role-based access
- services for AI, assistant, reminder logic, and knowledge retrieval

### Database Architecture
This is a relational data model with core entities for users and healthcare workflows.

### AI Architecture
The AI pipeline consists of:
1. image upload
2. preprocessing
3. CNN prediction
4. OCR extraction
5. hybrid confidence fusion
6. comparison with prescription data
7. assistant / summary generation

### Authentication Architecture
- login verifies credentials
- JWT token is returned to the frontend
- token is attached to requests through Axios interceptors
- protected routes use middleware

### Deployment Architecture
- Vite frontend deployed to Vercel-style hosting
- FastAPI backend exposed as an API service
- frontend uses API base URL from env config

### Request / Response Flow
1. User authenticates through [backend/app/routes/auth_routes.py](../backend/app/routes/auth_routes.py)
2. Frontend stores JWT in localStorage
3. API calls use the token via Axios interceptor in [frontend/src/api/api.js](../frontend/src/api/api.js)
4. Backend routes query SQLAlchemy models and return JSON or files
5. AI routes process uploads and return verification results
6. Reminder and guardian modules update database state for adherence tracking

### Text-Based Architecture Diagram
```text
User (Patient/Doctor/Guardian)
        |
        v
React + Vite Frontend
        |
        |-- Axios API Calls
        v
FastAPI Backend
  |-- Auth + JWT Middleware
  |-- Role-based Routes
  |-- Prescription / Reminder / Adherence / Guardian Routes
  |-- AI Routes (CNN + OCR + Hybrid Engine)
  |-- Assistant / RAG Services
        |
        v
PostgreSQL Database
        |
        +--> Users
        +--> Prescriptions
        +--> Prescription Sessions
        +--> Reminders
        +--> Guardian Alerts
        +--> Adherence Logs / Risk Status

AI pipeline:
Image -> Preprocess -> CNN Model -> OCR -> Hybrid Prediction -> Prescription Match -> Result
```

---

## 4) Complete Workflows

### Registration, Login, JWT Authentication
- Registration is handled by [backend/app/routes/auth_routes.py](../backend/app/routes/auth_routes.py)
- The handler checks duplicate email, hashes password with bcrypt, and creates a User record
- Login verifies password, creates a JWT token, and returns user data
- JWT validation is handled by [backend/app/middleware/jwt_middleware.py](../backend/app/middleware/jwt_middleware.py)
- Role-based access uses [backend/app/middleware/role_middleware.py](../backend/app/middleware/role_middleware.py)
- Frontend stores token and user data in localStorage in [frontend/src/pages/Auth/Login.jsx](../frontend/src/pages/Auth/Login.jsx)

### Doctor Workflow
- Doctor can view analytics and patient list through [backend/app/routes/doctor_routes.py](../backend/app/routes/doctor_routes.py)
- Doctor can create prescriptions through [frontend/src/pages/Doctor/CreatePrescription.jsx](../frontend/src/pages/Doctor/CreatePrescription.jsx)
- Prescription creation calls POST /prescriptions/create-session
- Doctor dashboard reads /doctor/analytics

### Patient Workflow
- Patient sees today’s medicines, prescriptions, upload screen, medicine history, and AI assistant
- Patient reminders are read from /reminders/patient-email/{email}
- Patient can upload image to verify medicine from reminder flow or manual flow
- Patient can ask medicine questions through the assistant UI

### Guardian Workflow
- Guardian dashboard uses guardian-specific endpoints to view reports, alerts, and patient profile
- Guardian alert routes expose patient status and alert summaries
- Guardian pages are in [frontend/src/pages/Guardian](../frontend/src/pages/Guardian)

### Prescription Management
- Doctors create a prescription session and individual medicine entries
- The backend creates:
  - a PrescriptionSession row
  - one or more Prescription rows
  - one Reminder row per medicine
- Prescription PDF generation uses reportlab and is available from /prescriptions/download/session/{session_id}

### Medicine Verification (CNN + OCR)
- Patient uploads an image through the upload page
- Backend saves the file under uploads
- The AI pipeline runs CNN prediction and OCR extraction
- Hybrid logic combines both results and returns confidence and source
- If the prediction matches the prescribed medicine, the reminder can be marked taken

### Medicine Agent
- The medicine agent endpoint is [backend/app/routes/medicine_agent_routes.py](../backend/app/routes/medicine_agent_routes.py)
- It uses CNN prediction and OCR text to create a medicine analysis response
- The service layer combines knowledge base and LLM summarization

### Reminder & Notification System
- Prescription creation creates reminders linked to each medicine
- Backend reminder processing updates reminder status and guardian alerts
- Frontend contains a reminder engine for browser notifications in [frontend/src/utils/reminderEngine.js](../frontend/src/utils/reminderEngine.js)
- Backend reminder scheduler runs in the FastAPI app startup path via [backend/app/main.py](../backend/app/main.py)

### Dashboard Flow
- Patient dashboard shows reminders and adherence information
- Doctor dashboard shows aggregate analytics
- Guardian dashboard shows adherence summaries and alert views

### End-to-End Request Lifecycle
1. Frontend sends HTTP request to API base URL
2. Axios adds Authorization header when token exists
3. FastAPI route parses request and dependency injects DB session
4. Business logic runs in the route or service layer
5. Database state is updated or queried
6. Response is returned as JSON or file download

---

## 5) Features

### Authentication and Role-Based Access
- Registration and login
- JWT-based session handling
- Role-based route protection for patient, doctor, guardian
- Files: [backend/app/routes/auth_routes.py](../backend/app/routes/auth_routes.py), [backend/app/middleware/jwt_middleware.py](../backend/app/middleware/jwt_middleware.py), [backend/app/middleware/role_middleware.py](../backend/app/middleware/role_middleware.py)

### Prescription Creation
- Doctors can create prescription sessions and enter medicines
- Files: [backend/app/routes/prescription_routes.py](../backend/app/routes/prescription_routes.py), [frontend/src/pages/Doctor/CreatePrescription.jsx](../frontend/src/pages/Doctor/CreatePrescription.jsx)

### Prescription PDF Download
- Prescription sessions can be exported as PDF
- Files: [backend/app/routes/prescription_routes.py](../backend/app/routes/prescription_routes.py)

### Reminder Tracking
- Medicines are linked to reminders with time and status
- Files: [backend/app/models/reminder_model.py](../backend/app/models/reminder_model.py), [backend/app/routes/reminder_routes.py](../backend/app/routes/reminder_routes.py)

### AI Medicine Verification
- User uploads medicine image
- CNN + OCR logic verifies medicine identity
- Files: [backend/app/routes/ai_routes.py](../backend/app/routes/ai_routes.py), [backend/app/routes/reminder_routes.py](../backend/app/routes/reminder_routes.py)

### Medicine Assistant
- Conversational assistant for medicine-related questions
- Supports current medicine context and file upload context
- Files: [backend/app/routes/assistant_routes.py](../backend/app/routes/assistant_routes.py), [frontend/src/components/assistant/RxGuardianAssistant.jsx](../frontend/src/components/assistant/RxGuardianAssistant.jsx)

### RAG / Medicine Safety Questions
- ChromaDB-based retrieval for medicine safety and guidance
- Files: [backend/app/rag/retriever.py](../backend/app/rag/retriever.py), [backend/app/rag/rag_service.py](../backend/app/rag/rag_service.py)

### Guardian Alerts
- Missed medicines can trigger guardian alerts
- Files: [backend/app/utils/guardian_alert_engine.py](../backend/app/utils/guardian_alert_engine.py), [backend/app/routes/guardian_routes.py](../backend/app/routes/guardian_routes.py)

### Adherence Analytics
- Patient adherence history and summaries are generated from reminder status
- Files: [backend/app/routes/adherence_routes.py](../backend/app/routes/adherence_routes.py), [frontend/src/pages/Patient/MedicineHistory.jsx](../frontend/src/pages/Patient/MedicineHistory.jsx)

### Doctor Analytics Dashboard
- Doctor views patient count, average adherence, high-risk patients, and missed medicines
- Files: [backend/app/routes/doctor_routes.py](../backend/app/routes/doctor_routes.py), [frontend/src/pages/Doctor/DoctorDashboard.jsx](../frontend/src/pages/Doctor/DoctorDashboard.jsx)

### Guardian Monitoring Dashboard
- Guardian sees adherence rate, missed and taken medicines, risk level, and charts
- Files: [frontend/src/pages/Guardian/GuardianDashboard.jsx](../frontend/src/pages/Guardian/GuardianDashboard.jsx)

---

## 6) Database

### Core Models
- User
- PrescriptionSession
- Prescription
- Reminder
- GuardianAlert
- Adherence
- RiskStatus

### Model Summary

#### User
Fields:
- id
- name
- email
- password
- role
- guardian_name
- guardian_email
- guardian_phone

Business logic:
- Stores account and role information
- Supports patient, doctor, and guardian roles
- Files: [backend/app/models/user_model.py](../backend/app/models/user_model.py)

#### PrescriptionSession
Fields:
- id
- patient_id
- doctor_name
- disease
- created_at

Business logic:
- Represents one prescription episode or session
- Files: [backend/app/models/prescription_session_model.py](../backend/app/models/prescription_session_model.py)

#### Prescription
Fields:
- id
- session_id
- doctor_id
- patient_id
- medicine_name
- dosage
- frequency
- duration
- timing
- scheduled_time
- start_date
- end_date
- created_at

Business logic:
- Stores individual medicines inside a prescription session
- Files: [backend/app/models/prescription_model.py](../backend/app/models/prescription_model.py)

#### Reminder
Fields:
- id
- patient_id
- prescription_id
- medicine_name
- scheduled_time
- status
- notification_count
- guardian_notified
- medicine_verified
- created_at
- updated_at

Business logic:
- Tracks reminder execution and guardrail escalation
- Files: [backend/app/models/reminder_model.py](../backend/app/models/reminder_model.py)

#### GuardianAlert
Fields:
- id
- patient_id
- alert_message
- risk_level
- status
- created_at

Business logic:
- Stores guardian-facing alerts for missed or abnormal medication events
- Files: [backend/app/models/guardian_alert_model.py](../backend/app/models/guardian_alert_model.py)

#### Adherence
Fields:
- id
- patient_id
- reminder_id
- medicine_name
- status
- timestamp

Business logic:
- Stores adherence history
- Files: [backend/app/models/adherence_model.py](../backend/app/models/adherence_model.py)

#### RiskStatus
Fields:
- id
- patient_id
- total_missed
- risk_level
- recommendation
- updated_at

Business logic:
- Aggregates medication risk profile
- Files: [backend/app/models/risk_model.py](../backend/app/models/risk_model.py)

### Relationships
- User -> PrescriptionSession
- PrescriptionSession -> Prescription
- Prescription -> Reminder
- User -> Reminder
- User -> GuardianAlert
- Reminder -> Adherence

### Text ER Diagram
```text
User (1) --- (many) PrescriptionSession
User (1) --- (many) Prescription
User (1) --- (many) Reminder
User (1) --- (many) GuardianAlert
User (1) --- (many) Adherence
PrescriptionSession (1) --- (many) Prescription
Prescription (1) --- (many) Reminder
Reminder (1) --- (many) Adherence
```

---

## 7) APIs

### Authentication
- POST /auth/register
  - Registers a new user
  - Request: name, email, password, role, optional guardian fields
  - Response: success message
- POST /auth/login
  - Authenticates user, returns JWT and user payload

### User
- GET /user/me
  - Returns authenticated user payload

### Patient
- GET /patient/dashboard
  - Role-protected patient dashboard endpoint

### Doctor
- GET /doctor/patients
  - Returns patient list and adherence metrics
- GET /doctor/analytics
  - Returns analytics summary

### Guardian
- GET /guardian/patient-status/{patient_id}
- GET /guardian/reports/{patient_id}
- GET /guardian/alerts/{patient_id}
- GET /guardian/profile-email/{email}
- GET /guardian/alerts-email/{email}

### Prescription
- POST /prescriptions/create-session
- GET /prescriptions/patient/{patient_id}
- GET /prescriptions/patient-email/{email}
- GET /prescriptions/download/session/{session_id}

### Reminder
- GET /reminders/patient/{patient_id}
- GET /reminders/patient-email/{email}
- POST /reminders/verify-and-take/{reminder_id}

### Adherence
- GET /adherence/patient/{patient_id}
- GET /adherence/patient-email/{email}

### AI Verification
- POST /ai/verify-tablet/{patient_id}
- POST /ai/verify-tablet-email/{email}

### Medicine Agent
- POST /medicine/analyze

### Assistant
- POST /assistant/chat
- POST /assistant/set-context
- POST /assistant/chat-v2

### Medicine Chat
- POST /medicine-chat/ask

### Risk
- GET /risk/patient/{patient_id}

### Notes on Validation
- Some routes use direct request bodies and simple checks.
- Pydantic schemas are used for auth registration/login.
- The project relies heavily on route-level logic and database operations rather than complex schema validation for all endpoints.

---

## 8) Frontend

### Main Pages
- Landing page: [frontend/src/pages/Landing/LandingPage.jsx](../frontend/src/pages/Landing/LandingPage.jsx)
- Role selection: [frontend/src/pages/Landing/RoleSelection.jsx](../frontend/src/pages/Landing/RoleSelection.jsx)
- Authentication: [frontend/src/pages/Auth/Login.jsx](../frontend/src/pages/Auth/Login.jsx)
- Patient pages: [frontend/src/pages/Patient](../frontend/src/pages/Patient)
- Doctor pages: [frontend/src/pages/Doctor](../frontend/src/pages/Doctor)
- Guardian pages: [frontend/src/pages/Guardian](../frontend/src/pages/Guardian)

### Routing
Defined in [frontend/src/App.jsx](../frontend/src/App.jsx):
- /
- /roles
- /register
- /login
- /patient/*
- /doctor/*
- /guardian/*

### State Management
- Uses React local state and useEffect in each page
- Uses localStorage for auth persistence and selected user context
- No global state library is visible in the workspace

### API Integration
- Central API client in [frontend/src/api/api.js](../frontend/src/api/api.js)
- Axios interceptor adds auth token to requests
- Service modules abstract some API calls:
  - [frontend/src/services/assistantApi.js](../frontend/src/services/assistantApi.js)
  - [frontend/src/services/medicineUploadApi.js](../frontend/src/services/medicineUploadApi.js)

### Reusable Components
- Sidebar and role-specific layouts
- Assistant widget
- Charts components
- Reusable landing/auth UI blocks

---

## 9) Backend

### Routers
- auth_routes.py
- user_routes.py
- patient_routes.py
- doctor_routes.py
- guardian_routes.py
- prescription_routes.py
- reminder_routes.py
- adherence_routes.py
- risk_routes.py
- guardian_alert_routes.py
- medicine_agent_routes.py
- medicine_chat_routes.py
- ai_routes.py
- assistant_routes.py
- test_routes.py

### Services
- assistant_service.py
- assistant_service_v2.py
- medicine_agent_service.py
- groq_service.py
- resolver_service.py
- knowledge_base_service.py
- conversation_memory.py
- query_router.py
- llm_router.py
- medicine_chat_service.py
- json_summary_service.py
- tool_summary_service.py

### Models
All are SQLAlchemy ORM classes under [backend/app/models](../backend/app/models)

### Schemas
- auth_schema.py
- assistant_schema.py

### Middleware
- jwt_middleware.py
- role_middleware.py

### Dependencies
- get_db from [backend/app/config/database.py](../backend/app/config/database.py)

### Validation / Error Handling
- FastAPI HTTPException is used for auth and not-found cases
- Some routes return JSON error payloads directly
- File uploads are handled with try/finally cleanup

---

## 10) AI Module

### Image Preprocessing
- [backend/ai_engine/model/preprocessing.py](../backend/ai_engine/model/preprocessing.py) resizes images to 224x224 and normalizes to 0-1 values
- [backend/ai_engine/inference/predictor.py](../backend/ai_engine/inference/predictor.py) opens the image and converts it to RGB before prediction

### CNN Inference
- The model is loaded from [backend/ai_engine/model/medicine_recognition_model.keras](../backend/ai_engine/model/medicine_recognition_model.keras)
- Labels are loaded from [backend/ai_engine/model/medicine_class_labels.json](../backend/ai_engine/model/medicine_class_labels.json)
- Prediction returns medicine name, confidence score, and raw probabilities

### OCR
- [backend/ai_engine/ocr/ocr_engine.py](../backend/ai_engine/ocr/ocr_engine.py) uses EasyOCR
- Images are resized, grayscale, blurred, contrasted, thresholded, and cleaned before OCR

### Verification Logic
- [backend/app/utils/ai_helper.py](../backend/app/utils/ai_helper.py) links prediction to the patient’s prescriptions
- It normalizes medicine names and compares them to stored prescriptions
- If confidence is below 60, it returns a low-confidence result

### LLM / Medicine Agent
- [backend/app/services/medicine_agent_service.py](../backend/app/services/medicine_agent_service.py) combines CNN class, OCR text, knowledge base, and LLM summarization
- [backend/app/services/assistant_service.py](../backend/app/services/assistant_service.py) and [backend/app/services/groq_service.py](../backend/app/services/groq_service.py) generate medicine summaries and assistant replies

### Confidence Scoring
- CNN confidence is converted to percentage
- OCR is scored by fuzzy string matching
- Hybrid logic chooses the final prediction based on agreement or stronger signal

---

## 11) Security

### JWT
- Access token created in [backend/app/utils/jwt_handler.py](../backend/app/utils/jwt_handler.py)
- Verified in [backend/app/middleware/jwt_middleware.py](../backend/app/middleware/jwt_middleware.py)

### Password Hashing
- bcrypt via Passlib in [backend/app/utils/password_hash.py](../backend/app/utils/password_hash.py)

### RBAC
- Role middleware checks whether the current user’s role is permitted
- Files: [backend/app/middleware/role_middleware.py](../backend/app/middleware/role_middleware.py)

### CORS
- CORS is enabled in [backend/app/main.py](../backend/app/main.py) with allow_origins=["*"]

### Validation
- Pydantic schemas for auth requests
- Route-level checks for email duplication and password validation flow

### Environment Variables
- Database URL
- Secret Key
- Algorithm
- Access token expiry
- Groq API key

Files: [backend/.env](../backend/.env)

---

## 12) Deployment

### Current Evidence in Code
- Frontend includes a Vercel config file [frontend/vercel.json](../frontend/vercel.json)
- Frontend API base is configurable through [frontend/src/api/api.js](../frontend/src/api/api.js)
- Backend uses environment variables for database and API secrets

### What Is Present
- SPA rewrite support for Vercel
- Frontend environment variable for API base URL

### What Is Not Present in the Workspace
- No Dockerfile found in the workspace
- No Nginx configuration found
- No Azure deployment manifest found
- No explicit SSL/TLS config file found

### Practical Deployment Interpretation
The project is structured for a frontend-backend split, with the frontend being deployable as a Vite app and the backend as a FastAPI API service. The codebase provides a strong starting point for deployment, but the workspace does not include production deployment manifests beyond the Vercel rewrite config.

---

## 13) Skills Demonstrated

### Frontend
- React components and pages
- Routing and layout composition
- Form handling
- API integration
- UI animations and charts

### Backend
- FastAPI routing
- SQLAlchemy models
- Dependency injection
- Business logic in route/service layers

### Database
- ER modeling
- Relational data design
- CRUD logic for healthcare workflows

### AI
- TensorFlow/Keras inference
- EasyOCR integration
- Hybrid prediction logic
- LLM-based assistant workflows

### API Design
- REST-style API endpoints
- File upload endpoints
- JSON response patterns

### Security
- JWT authentication
- Password hashing
- Role-based access control

### Cloud / DevOps
- Environment-variable-driven config
- Vercel deployment config
- External API integrations

### Git / Problem Solving
- The repository is structured into clear domain folders and modules, showing modular engineering practice

---

## 14) Challenges & Improvements

### Problems Solved
- Built a cross-role healthcare experience for patient, doctor, and guardian
- Implemented AI-assisted medicine recognition without relying on a simple single-model approach
- Added reminders, guardian escalation, and adherence tracking

### Trade-offs Observed in the Code
- The app uses direct route-level logic for several features rather than deeper service abstractions
- Several modules overlap conceptually, such as reminder logic in backend utilities and frontend reminder engine
- Some features rely on simple string-based routing and heuristics

### Future Improvements
- Add stronger request validation schemas for all endpoints
- Centralize reminder logic to avoid duplication between frontend and backend
- Add comprehensive tests for routes and business logic
- Add stricter role enforcement and audit logging
- Improve deployment configuration for production environments
- Add background job orchestration and observability

---

## 15) Interview Preparation

### Resume-Ready Project Description
RxGuardian is a full-stack healthcare platform that helps patients take medications safely using AI-powered medicine verification, prescription management, reminder tracking, guardian alerts, and role-based dashboards for patients, doctors, and guardians.

### ATS Bullet Points
- Built a full-stack healthcare application using React, Vite, FastAPI, SQLAlchemy, and PostgreSQL
- Implemented JWT authentication, password hashing, and role-based access control
- Developed AI-based medicine verification using TensorFlow/Keras CNN and EasyOCR
- Designed reminder and adherence workflows with guardian alert escalation
- Built doctor and guardian analytics dashboards with dynamic reporting
- Integrated LLM-based medicine assistant and retrieval-based medicine safety support

### Frequently Asked Interview Questions and Answers

#### Q1. What problem does your project solve?
A: It improves medication safety and adherence by combining prescription management, reminders, AI verification of medicine images, guardian alerts, and doctor oversight in one platform.

#### Q2. How did you implement AI verification?
A: I used a CNN model for image classification and EasyOCR for text extraction. The system then combines the results using hybrid confidence logic and compares them with the patient’s prescribed medicines.

#### Q3. How is authentication handled?
A: Users register and log in through FastAPI routes. Passwords are hashed with bcrypt, and JWT tokens are issued and validated through middleware.

#### Q4. How do patients and guardians interact with the system?
A: Patients can view their medicines, verify them, and interact with the assistant. Guardians can see adherence reports and alerts for missed medicines.

#### Q5. What database design choices did you make?
A: I used PostgreSQL with SQLAlchemy ORM and modeled entities such as User, PrescriptionSession, Prescription, Reminder, GuardianAlert, Adherence, and RiskStatus to support healthcare workflows.

#### Q6. What is the role of the medicine assistant?
A: The assistant answers medicine-related questions and uses current medicine context plus knowledge retrieval and LLM summaries to provide helpful responses.

### Possible Follow-Up Questions
- How would you scale the reminder engine for a large user base?
- How would you improve the AI verification pipeline for higher accuracy?
- How would you handle production logging and monitoring?
- How would you secure the API further for healthcare use?

### Important Concepts to Revise
- JWT and middleware flow
- SQLAlchemy ORM relationships
- CNN + OCR pipeline
- FastAPI router structure
- Role-based access control
- Prompt engineering and LLM integration
- ChromaDB / RAG basics

---

## 16) File-by-File Analysis

### Frontend
- [frontend/src/App.jsx](../frontend/src/App.jsx): main routing
- [frontend/src/main.jsx](../frontend/src/main.jsx): app bootstrap, service worker, notifications
- [frontend/src/api/api.js](../frontend/src/api/api.js): central Axios client
- [frontend/src/pages/Auth/Login.jsx](../frontend/src/pages/Auth/Login.jsx): authentication UI and role-based login handling
- [frontend/src/pages/Patient/TodayMedicines.jsx](../frontend/src/pages/Patient/TodayMedicines.jsx): daily medicine view and reminders
- [frontend/src/pages/Patient/UploadMedicine.jsx](../frontend/src/pages/Patient/UploadMedicine.jsx): medicine image upload and verification flow
- [frontend/src/pages/Patient/Prescriptions.jsx](../frontend/src/pages/Patient/Prescriptions.jsx): prescription history viewer
- [frontend/src/pages/Patient/MedicineAgent.jsx](../frontend/src/pages/Patient/MedicineAgent.jsx): assistant page
- [frontend/src/pages/Doctor/CreatePrescription.jsx](../frontend/src/pages/Doctor/CreatePrescription.jsx): prescription creation UI
- [frontend/src/pages/Doctor/DoctorDashboard.jsx](../frontend/src/pages/Doctor/DoctorDashboard.jsx): doctor analytics UI
- [frontend/src/pages/Guardian/GuardianDashboard.jsx](../frontend/src/pages/Guardian/GuardianDashboard.jsx): guardian dashboard UI

### Backend
- [backend/app/main.py](../backend/app/main.py): app entrypoint, router registration, CORS, reminder background engine
- [backend/app/routes/auth_routes.py](../backend/app/routes/auth_routes.py): registration and login logic
- [backend/app/routes/prescription_routes.py](../backend/app/routes/prescription_routes.py): prescription and PDF logic
- [backend/app/routes/reminder_routes.py](../backend/app/routes/reminder_routes.py): reminder retrieval and verification flow
- [backend/app/routes/ai_routes.py](../backend/app/routes/ai_routes.py): AI verification API
- [backend/app/routes/medicine_agent_routes.py](../backend/app/routes/medicine_agent_routes.py): medicine analysis endpoint
- [backend/app/routes/assistant_routes.py](../backend/app/routes/assistant_routes.py): assistant endpoints
- [backend/app/routes/doctor_routes.py](../backend/app/routes/doctor_routes.py): doctor analytics endpoints
- [backend/app/routes/guardian_routes.py](../backend/app/routes/guardian_routes.py): guardian reports, alerts, profile endpoints

### AI Engine
- [backend/ai_engine/inference/predictor.py](../backend/ai_engine/inference/predictor.py): CNN inference
- [backend/ai_engine/inference/hybrid_engine.py](../backend/ai_engine/inference/hybrid_engine.py): CNN + OCR reasoning engine
- [backend/ai_engine/ocr/ocr_engine.py](../backend/ai_engine/ocr/ocr_engine.py): OCR extraction
- [backend/ai_engine/model/preprocessing.py](../backend/ai_engine/model/preprocessing.py): image preprocessing

### Services and RAG
- [backend/app/services/medicine_agent_service.py](../backend/app/services/medicine_agent_service.py): orchestrates AI analysis for medicine agent
- [backend/app/services/assistant_service.py](../backend/app/services/assistant_service.py): LLM-guided assistant logic
- [backend/app/rag/retriever.py](../backend/app/rag/retriever.py): vector retrieval from ChromaDB
- [backend/app/rag/rag_service.py](../backend/app/rag/rag_service.py): RAG answer generation

---

## 17) Final Revision Sheet

### Architecture
- Frontend: React + Vite + Tailwind + React Router
- Backend: FastAPI + SQLAlchemy + Pydantic
- Database: PostgreSQL
- AI: TensorFlow/Keras + EasyOCR + RapidFuzz + Groq
- Authentication: JWT + bcrypt

### Core Workflows
- Register / Login / JWT
- Create prescription and reminders
- Upload medicine image for AI verification
- Mark reminder as taken after AI match
- View dashboards for patient / doctor / guardian
- Ask medicine questions through assistant

### Key APIs
- POST /auth/register
- POST /auth/login
- POST /prescriptions/create-session
- POST /reminders/verify-and-take/{reminder_id}
- POST /ai/verify-tablet-email/{email}
- POST /medicine/analyze
- GET /doctor/analytics
- GET /guardian/reports-email/{email}

### Database Core Models
- User
- PrescriptionSession
- Prescription
- Reminder
- GuardianAlert
- Adherence
- RiskStatus

### AI Pipeline
Image -> preprocess -> CNN -> OCR -> hybrid confidence -> prescription matching -> response

### Authentication Notes
- Token stored in localStorage
- Sent using Axios interceptor
- Verified by FastAPI middleware

### Deployment Notes
- Vite frontend configured for Vercel-style hosting
- Backend is a FastAPI API service
- Environment variables drive DB and API credentials

### Interview Key Points
- Full-stack healthcare platform
- AI + OCR verification
- Multi-role app with secure authentication
- Reminder and adherence workflows
- LLM + RAG integration
