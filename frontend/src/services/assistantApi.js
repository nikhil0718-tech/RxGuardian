import axios from "axios";

export const askAssistant =
async (

  sessionId,

  message

) => {

  const response =
    await axios.post(

      "https://api.rxguardian.xyz/assistant/chat",

      {

        session_id:
          sessionId,

        message:
          message

      }
    );

  return response.data;
};