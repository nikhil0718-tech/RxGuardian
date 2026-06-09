conversation_memory = {}

def save_medicine(
    session_id,
    medicine
):

    conversation_memory[
        session_id
    ] = medicine


def get_medicine(
    session_id
):

    return conversation_memory.get(
        session_id
    )