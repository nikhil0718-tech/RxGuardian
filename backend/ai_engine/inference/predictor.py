print("PREDICTOR START")
import os
import json
import numpy as np
import tensorflow as tf

from PIL import Image

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input

# =====================================================
# ENABLE GPU MEMORY GROWTH
# =====================================================

gpus = tf.config.experimental.list_physical_devices('GPU')

if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(
                gpu,
                True
            )

        print("GPU ENABLED:",
              gpus)

    except RuntimeError as e:
        print(e)

# =====================================================
# PATHS
# =====================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "medicine_recognition_model.keras"
)

LABELS_PATH = os.path.join(
    BASE_DIR,
    "model",
    "medicine_class_labels.json"
)
print("BEFORE MODEL LOAD")
# =====================================================
# LOAD MODEL
# =====================================================

print("Loading AI model...")

model = load_model(MODEL_PATH)

print("Model Loaded Successfully")
print("AFTER MODEL LOAD")
# =====================================================
# LOAD LABELS
# =====================================================

with open(LABELS_PATH, "r") as file:

    class_names = json.load(file)

# =====================================================
# PREDICT FUNCTION
# =====================================================

def predict_medicine(

    image_path,

    device="GPU"
):

    try:

        # =================================================
        # LOAD IMAGE
        # =================================================

        img = Image.open(image_path)

        if img.mode != "RGB":
            img = img.convert("RGB")
        # =================================================
        # RESIZE
        # =================================================

        img = img.resize(
            (224, 224)
        )

        # =================================================
        # IMAGE ARRAY
        # =================================================

        img_array = image.img_to_array(
            img
        )

        img_array = np.expand_dims(
            img_array,
            axis=0
        )

        # =================================================
        # PREPROCESS
        # =================================================

        img_array = preprocess_input(
            img_array
        )

        # =================================================
        # GPU INFERENCE
        # =================================================

        with tf.device('/GPU:0'):

            prediction = model.predict(
                img_array,
                verbose=0
            )

        # =================================================
        # RESULTS
        # =================================================

        predicted_index = np.argmax(
            prediction
        )

        confidence = float(
            np.max(prediction)
        )

        predicted_medicine = class_names[
            predicted_index
        ]

        return {

            "medicine_name": predicted_medicine,

            "confidence_score": round(
                confidence * 100,
                2
            ),

            "raw_predictions": prediction[
                0
            ].tolist(),

            "device_used": "GPU"
        }

    except Exception as e:

        return {

            "medicine_name": "Unknown",

            "confidence_score": 0.0,

            "error": str(e)
        }