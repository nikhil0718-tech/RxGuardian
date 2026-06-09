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


class MedicineAgentService:

    @staticmethod
    def process(
        cnn_class,
        confidence,
        ocr_text
    ):

        ocr_verified = check_text_match(
            ocr_text,
            cnn_class
        )

        final_medicine = cnn_class

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

            return {

                "success": False,

                "message":
                "Medicine not found in knowledge base."
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