import axios from "axios";
import { API_BASE } from "../api/api";

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