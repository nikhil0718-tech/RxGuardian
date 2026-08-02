import re

# =====================================================
# CLEAN OCR TEXT
# =====================================================

def clean_text(text):

    # LOWERCASE

    text = text.lower()

    # REMOVE SPECIAL CHARACTERS

    text = re.sub(

        r"[^a-zA-Z0-9\s]",

        "",

        text
    )

    # REMOVE EXTRA WHITESPACES

    text = re.sub(

        r"\s+",

        " ",

        text
    )

    return text.strip()