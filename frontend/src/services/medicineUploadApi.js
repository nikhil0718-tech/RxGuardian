import axios from "axios";
import { API_BASE } from "../api/api";

export const uploadMedicine =
async (file,sessionId) => {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );
  formData.append(
    "session_id",
    sessionId
  );


  const response =
    await axios.post(

      `${API_BASE}/medicine/analyze`,

      formData,

      {
        headers: {
          "Content-Type":
          "multipart/form-data"
        }
      }

    );

  return response.data;
};