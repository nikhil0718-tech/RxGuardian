def route_tool(
    tool_name,
    **kwargs
):

    if tool_name == "rag":

        from app.tools.rag_tool import (
            execute
        )

        return execute(
            kwargs["query"]
        )

    return (
        "Tool not found"
    )

# Why?

# Future:

# tool_router
#      ↓

# rag
# prescription
# adherence
# verification

# Single entry point.

# Exactly how tool-calling systems work.