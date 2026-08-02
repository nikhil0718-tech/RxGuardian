import easyocr
import cv2
import numpy as np
import torch

# =====================================================
# GPU DETECTION
# =====================================================

GPU_ENABLED = torch.cuda.is_available()

print(f"OCR GPU Enabled: {GPU_ENABLED}")

# =====================================================
# LOAD OCR READER
# =====================================================

reader = easyocr.Reader(

    ['en'],

    gpu=GPU_ENABLED
)

# =====================================================
# OCR FUNCTION
# =====================================================

def extract_text(image_path):

    try:

        # =================================================
        # LOAD IMAGE
        # =================================================

        image = cv2.imread(image_path)

        if image is None:

            raise ValueError(
                f"Unable to load image: {image_path}"
            )

        # =================================================
        # ENLARGE IMAGE
        # =================================================

        image = cv2.resize(

            image,

            None,

            fx=3,

            fy=3,

            interpolation=cv2.INTER_CUBIC
        )

        # =================================================
        # GRAYSCALE
        # =================================================

        gray = cv2.cvtColor(

            image,

            cv2.COLOR_BGR2GRAY
        )

        # =================================================
        # BLUR
        # =================================================

        gray = cv2.GaussianBlur(

            gray,

            (5, 5),

            0
        )

        # =================================================
        # CONTRAST ENHANCEMENT
        # =================================================

        gray = cv2.equalizeHist(
            gray
        )

        # =================================================
        # THRESHOLD
        # =================================================

        thresh = cv2.adaptiveThreshold(

            gray,

            255,

            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,

            cv2.THRESH_BINARY,

            11,

            2
        )

        # =================================================
        # MORPHOLOGY CLEANUP
        # =================================================

        kernel = np.ones(
            (2, 2),
            np.uint8
        )

        thresh = cv2.morphologyEx(

            thresh,

            cv2.MORPH_CLOSE,

            kernel
        )

        # =================================================
        # OCR
        # =================================================

        results = reader.readtext(

            thresh,

            detail=0,

            paragraph=True,

            batch_size=8,

            decoder='greedy'
        )

        # =================================================
        # JOIN TEXT
        # =================================================

        extracted_text = " ".join(
            results
        )

        extracted_text = extracted_text.lower().strip()

        # =================================================
        # LOGGING
        # =================================================

        print()

        print("OCR TEXT:")
        print(extracted_text)

        print()

        return extracted_text

    except Exception as e:

        print("OCR ERROR:", str(e))

        return ""