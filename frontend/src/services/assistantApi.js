import axios from "axios";

export const askAssistant =
async (

  sessionId,

  message

) => {

  const response =
    await axios.post(

      "http://localhost:8000/assistant/chat",

      {

        session_id:
          sessionId,

        message:
          message

      }
    );

  return response.data;
};