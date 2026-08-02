from app.services.resolver_service import (
    ResolverService
)

from app.services.knowledge_base_service import (
    KnowledgeBaseService
)

from app.services.groq_service import (
    GroqService
)

from ai_engine.ocr.medicine_text_match import (
    check_text_match
)
from app.services.assistant_service import (
    AssistantService
)

from app.services.conversation_memory import (
    save_medicine
)
class MedicineAgentService:

    @staticmethod
    def process(
    session_id,
    cnn_class,
    confidence,
    ocr_text
):
        ocr_verified = check_text_match(
            ocr_text,
            cnn_class
        )

        final_medicine = cnn_class
        print(
    "SAVING MEDICINE:",
    final_medicine
)

        save_medicine(
    session_id,
    final_medicine
)
        if confidence < 90:

            if not ocr_verified:

                final_medicine = (
                    ResolverService.resolve(
                        cnn_class,
                        confidence,
                        ocr_text
                    )
                )

        medicine_data = (
            KnowledgeBaseService
            .get_medicine(
                final_medicine
            )
        )

        if not medicine_data:

            if ocr_text:

                fallback_answer = (
                    AssistantService
                    .ask_ai(
                        "image_session",
                        f"What is {ocr_text} used for and what are its side effects?"
                    )
                )

            else:

                fallback_answer = (
                    "Unable to identify the medicine clearly. "
                    "Please upload a clearer image."
                )
            return {

                "success": True,

                "medicine": "Unknown",

                "confidence": confidence,

                "ocr_verified": ocr_verified,

                "summary": fallback_answer
            }
        

        summary = (
            GroqService
            .generate_summary(
                medicine_data
            )
        )

        return {

            "success": True,

            "medicine":
            medicine_data[
                "medicine_name"
            ],

            "generic_name":
            medicine_data[
                "generic_name"
            ],

            "confidence":
            confidence,

            "ocr_verified":
            ocr_verified,

            "usage":
            medicine_data[
                "usage"
            ],

            "best_time":
            medicine_data[
                "best_time"
            ],

            "dosage":
            medicine_data[
                "dosage"
            ],

            "precautions":
            medicine_data[
                "precautions"
            ],

            "side_effects":
            medicine_data[
                "side_effects"
            ],

            "summary":
            summary
        }