import cv2
import numpy as np

IMG_SIZE = 224

# ---------------------------------------------------
# PREPROCESS IMAGE
# ---------------------------------------------------

def preprocess_image(image_path):

    # ---------------------------------------------------
    # LOAD IMAGE
    # ---------------------------------------------------

    image = cv2.imread(image_path)

    if image is None:

        raise ValueError(
            f"Unable to load image: {image_path}"
        )

    # ---------------------------------------------------
    # CONVERT BGR → RGB
    # ---------------------------------------------------

    image = cv2.cvtColor(

        image,

        cv2.COLOR_BGR2RGB
    )

    # ---------------------------------------------------
    # RESIZE
    # ---------------------------------------------------

    image = cv2.resize(

        image,

        (IMG_SIZE, IMG_SIZE),

        interpolation=cv2.INTER_CUBIC
    )

    # ---------------------------------------------------
    # NORMALIZATION
    # ---------------------------------------------------

    image = image.astype(
        np.float32
    ) / 255.0

    # ---------------------------------------------------
    # BATCH DIMENSION
    # ---------------------------------------------------

    image = np.expand_dims(

        image,

        axis=0
    )

    return image