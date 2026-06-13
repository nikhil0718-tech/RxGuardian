import axios from "axios";
import { API_BASE } from "../api/api";

export const askAssistant =
async (

  sessionId,

  message

) => {

  const response =
    await axios.post(

      `${API_BASE}/assistant/chat`,

      {

        session_id:
          sessionId,

        message:
          message

      }
    );

  return response.data;
};