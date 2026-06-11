import axios from "axios";

export const uploadMedicine =
async (file) => {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await axios.post(

      "https://api.rxguardian.xyz/medicine/analyze",

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