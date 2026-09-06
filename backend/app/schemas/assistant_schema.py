from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ============================================================
# EXISTING ASSISTANT REQUEST SCHEMA
# ============================================================

class AssistantRequest(BaseModel):
    session_id: str
    message: str


# ============================================================
# LLM ROUTER SCHEMAS
# ============================================================

class RouterEntity(BaseModel):
    medicine_name: Optional[str] = None
    medicine_names: List[str] = Field(default_factory=list)
    date: Optional[str] = None
    time: Optional[str] = None
    symptom: Optional[str] = None


class ToolRequest(BaseModel):
    name: str
    arguments: Dict[str, Any] = Field(
        default_factory=dict
    )


class RouteDecision(BaseModel):
    intent: str
    confidence: float = 0.0

    entities: RouterEntity = Field(
        default_factory=RouterEntity
    )

    requires_patient_context: bool = False
    requires_rag: bool = False

    tools: List[ToolRequest] = Field(
        default_factory=list
    )

    needs_clarification: bool = False

    clarification_question: Optional[str] = None
# from pydantic import BaseModel

# class AssistantRequest(
#     BaseModel
# ):

#     session_id: str

#     message: str