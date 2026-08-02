from app.services.conversation_memory import (
    save_medicine,
    get_medicine
)

from app.services.medicine_detector import (
    detect_medicines
)

from app.services.general_medicine_extractor import (
    extract_unknown_medicine
)

from app.services.medicine_extractor import (
    extract_medicine
)


class ChatContextService:

    @staticmethod
    def resolve(session_id, message):

        current = get_medicine(session_id)

        medicines = detect_medicines(message)

        # One medicine explicitly mentioned
        if len(medicines) == 1:

            medicine = medicines[0]

            save_medicine(
                session_id,
                medicine
            )

            current = medicine

        # Multiple medicines mentioned
        elif len(medicines) > 1:

            medicine = None

        else:

            medicine = extract_medicine(message)

            if medicine:

                save_medicine(
                    session_id,
                    medicine
                )

                current = medicine

            else:

                unknown = extract_unknown_medicine(
                    message
                )

                if unknown:

                    save_medicine(
                        session_id,
                        unknown
                    )

                    current = unknown

                    medicine = unknown

                else:

                    medicine = current

        if medicine:

            enhanced_message = f"""
Current Medicine:
{medicine}

User Question:
{message}
"""

        else:

            enhanced_message = message

        return {

            "medicine": medicine,

            "enhanced_message": enhanced_message,

            "multiple": len(medicines) > 1

        }