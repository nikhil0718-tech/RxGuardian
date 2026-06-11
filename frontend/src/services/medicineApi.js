import axios from "axios";

const API_URL = "https://api.rxguardian.xyz";

export const analyzeMedicine =
  async (file) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await axios.post(

        `${API_URL}/medicine/analyze`,

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };