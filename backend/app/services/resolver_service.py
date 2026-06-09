class ResolverService:

    @staticmethod
    def resolve(
        cnn_class,
        confidence,
        ocr_text
    ):

        if confidence >= 90:
            return cnn_class

        if ocr_text:
            return ocr_text.lower()

        return cnn_class