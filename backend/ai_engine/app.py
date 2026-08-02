import os
import requests
import numpy as np
import streamlit as st

from tensorflow.keras.models import load_model

from model.preprocessing import (
    preprocess_image
)

from ocr.easyocr_engine import (
    extract_text
)

from ocr.medicine_text_match import (
    check_text_match
)

# ---------------------------------------------------
# PAGE CONFIG
# ---------------------------------------------------

st.set_page_config(

    page_title="RxGuardian AI",

    layout="wide"
)

# ---------------------------------------------------
# LOAD MODEL
# ---------------------------------------------------

MODEL_PATH = os.path.join(
    "model",
    "medicine_recognition_model.keras"
)

LABELS_PATH = os.path.join(
    "model",
    "class_labels.txt"
)

model = load_model(MODEL_PATH)

with open(LABELS_PATH, "r") as file:

    class_labels = [
        line.strip()
        for line in file.readlines()
    ]

# ---------------------------------------------------
# TITLE
# ---------------------------------------------------

st.title("💊 RxGuardian AI Verification")

st.write(
    "Upload medicine image for verification"
)

# ---------------------------------------------------
# IMAGE UPLOAD
# ---------------------------------------------------

uploaded_file = st.file_uploader(

    "Upload Medicine Image",

    type=["jpg", "jpeg", "png"]
)

# ---------------------------------------------------
# PREDICTION
# ---------------------------------------------------

if uploaded_file is not None:

    # CREATE UPLOADS DIRECTORY

    os.makedirs(
        "uploads",
        exist_ok=True
    )

    # SAVE IMAGE

    image_path = os.path.join(
        "uploads",
        uploaded_file.name
    )

    with open(image_path, "wb") as f:

        f.write(
            uploaded_file.getbuffer()
        )

    # DISPLAY IMAGE

    st.image(
        image_path,
        width=300
    )

    # PREPROCESS IMAGE

    processed_image = preprocess_image(
        image_path
    )

    # MODEL PREDICTION

    prediction = model.predict(
        processed_image
    )

    predicted_index = np.argmax(
        prediction
    )

    confidence_score = float(
        np.max(prediction) * 100
    )

    predicted_medicine = class_labels[
        predicted_index
    ]

    # OCR EXTRACTION

    extracted_text = extract_text(
        image_path
    )

    # OCR MATCH

    ocr_match = check_text_match(

        extracted_text,

        predicted_medicine
    )

    # ---------------------------------------------------
    # FETCH PRESCRIPTIONS
    # ---------------------------------------------------

    patient_id = st.number_input(

        "Enter Patient ID",

        min_value=1,

        step=1
    )

    if st.button("Verify Medicine"):

        try:

            response = requests.get(
                f"http://127.0.0.1:8000/prescriptions/patient/{patient_id}"
            )

            if response.status_code != 200:

                st.error("Failed to fetch prescriptions")

                st.stop()

            prescriptions = response.json()

            # DEBUG CHECK

            if not isinstance(prescriptions, list):

                st.error("Invalid prescription response")

                st.write(prescriptions)

                st.stop()

            prescribed_medicines = [

                prescription.get("medicine_name", "")

                for prescription in prescriptions
            ]

            # ---------------------------------------------------
            # PRESCRIPTION MATCH
            # ---------------------------------------------------

            prescription_match = (
                predicted_medicine.lower()
                in
                [
                    medicine.lower()
                    for medicine in prescribed_medicines
                ]
            )

            # ---------------------------------------------------
            # DISPLAY RESULTS
            # ---------------------------------------------------

            st.subheader("Verification Result")

            st.success(
                f"Predicted Medicine: {predicted_medicine}"
            )

            st.info(
                f"Confidence Score: {confidence_score:.2f}%"
            )

            # CORRECT MEDICINE

            if prescription_match:

                st.success(
                    "✅ Correct Medicine"
                )

                prescription = prescriptions[0]

                st.write("### Prescription Details")

                st.write(
                    f"Dosage: {prescription['dosage']}"
                )

                st.write(
                    f"Frequency: {prescription['frequency']}"
                )

                st.write(
                    f"Duration: {prescription['duration']}"
                )

                st.write(
                    f"Timing: {prescription['timing']}"
                )

            else:

                st.error(
                    "❌ WARNING: Medicine not in prescription"
                )

    

        except Exception as e:

            st.error(str(e))