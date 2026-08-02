# conversation_memory = {}

# def save_medicine(
#     session_id,
#     medicine
# ):

#     print(
#         "BEFORE SAVE:",
#         conversation_memory
#     )

#     conversation_memory[
#         session_id
#     ] = medicine

#     print(
#         "AFTER SAVE:",
#         conversation_memory
#     )


# def get_medicine(
#     session_id
# ):

#     medicine = conversation_memory.get(
#         session_id
#     )

#     print(
#         "GET MEDICINE:",
#         session_id,
#         medicine
#     )

#     return medicine

conversation_memory = {}


def create_session(session_id):

    if session_id not in conversation_memory:

        conversation_memory[session_id] = {

            "current_medicine": None,

            "history": [],

            "last_route": None,

            "last_tool": None
        }


def save_medicine(
    session_id,
    medicine
):

    create_session(session_id)

    conversation_memory[
        session_id
    ]["current_medicine"] = medicine

    if medicine not in conversation_memory[
        session_id
    ]["history"]:

        conversation_memory[
            session_id
        ]["history"].append(
            medicine
        )


def get_medicine(session_id):

    create_session(session_id)

    return conversation_memory[
        session_id
    ]["current_medicine"]


def save_route(
    session_id,
    route
):

    create_session(session_id)

    conversation_memory[
        session_id
    ]["last_route"] = route


def get_route(session_id):

    create_session(session_id)

    return conversation_memory[
        session_id
    ]["last_route"]


def save_tool(
    session_id,
    tool
):

    create_session(session_id)

    conversation_memory[
        session_id
    ]["last_tool"] = tool


def get_tool(session_id):

    create_session(session_id)

    return conversation_memory[
        session_id
    ]["last_tool"]


def get_history(session_id):

    create_session(session_id)

    return conversation_memory[
        session_id
    ]["history"]


def clear_memory(session_id):

    if session_id in conversation_memory:

        del conversation_memory[
            session_id
        ]