from ai_engine.ocr.ocr_engine import (
    extract_text
)

text = extract_text(
    "d003.png"
)

print(text)