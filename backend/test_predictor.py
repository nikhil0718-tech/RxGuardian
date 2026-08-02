from ai_engine.inference.predictor import (
    predict_medicine
)

result = predict_medicine(
    "ce032.jpg"
)

print(result)