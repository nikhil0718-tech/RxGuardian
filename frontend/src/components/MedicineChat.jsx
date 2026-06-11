import { useState } from "react";
import axios from "axios";

export default function MedicineChat({
  medicine
}) {

  const [question, setQuestion] =
    useState("");
  const [messages, setMessages] =
    useState([]);

  const askQuestion =
  async () => {
    if (!question.trim()) return;

    console.log("Medicine =", medicine);
    console.log("Question =", question);

    const response =
    await axios.post(

      "https://api.rxguardian.xyz/medicine-chat/ask",

      {
        medicine_name:
        medicine,

        question:
        question
      }
    );

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: question
      },
      {
        sender: "ai",
        text: response.data.answer
      }
    ]);

    setQuestion("");
  };

  return (

    <div
      className="
      mt-6
      bg-white
      p-4
      rounded-xl
      shadow-md"
    >

      <h3
        className="
        font-bold
        mb-3"
      >
        Ask RxGuardian AI
      </h3>

      <input
        className="
        w-full
        border
        p-3
        rounded-lg"
        value={question}
        onChange={(e) =>
          setQuestion(
            e.target.value
          )
        }
        placeholder="
        Ask about this medicine..."
      />

      <button
        onClick={askQuestion}
        className="
        mt-3
        bg-blue-600
        text-white
        px-4
        py-2
        rounded"
      >

        Ask

      </button>

      <div className="
        mt-4
        space-y-3"
      >
        {messages.map(
          (msg, index) => (

            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "rounded-xl p-3 bg-blue-50 text-blue-900"
                  : "rounded-xl p-3 bg-gray-100 text-gray-900"
              }
            >
              {msg.text}
            </div>

          )
        )}
      </div>

    </div>
  );
}