import { ImagePlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  askAssistant
} from "../../services/assistantApi";

import {
  uploadMedicine
} from "../../services/medicineUploadApi";
import { API_BASE } from "../../api/api";

export default function RxGuardianAssistant({
  forceOpen = false
}) {

const [isOpen, setIsOpen] =
  useState(forceOpen);

  const [messages, setMessages] =
  useState([
    {
      sender: "ai",
      text:
`👋 Welcome to RxGuardian AI

Upload a medicine image or ask a medicine-related question.

I'm here to help with medicine information and guidance.`
    }
  ]);

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [image, setImage] =
    useState(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef =
  useRef(null);
  // =====================================
  // USER SESSION
  // =====================================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const SESSION_ID =
    user?.email || "guest";
  useEffect(() => {

  messagesEndRef.current?.scrollIntoView({

    behavior: "smooth"

  });

}, [messages]);

  useEffect(() => {

    if (isOpen) {

      inputRef.current?.focus();

    }

  }, [isOpen]);
  // =====================================
  // IMAGE ANALYSIS
  // =====================================

  const handleImageUpload =
    async () => {

      if (!image) {

        alert(
          "Please select a medicine image."
        );

        return;
      }

      try {

        setLoading(true);

        const result =
          await uploadMedicine(
            image
          );
          const uploadedFileName =
  image?.name;
          console.log(
  "CLEARING IMAGE:",
  image?.name
);
          
        console.log({

  session_id:
    SESSION_ID,

  medicine:
    result.medicine

});
        await axios.post(

          `${API_BASE}/assistant/set-context`,

          {

            session_id:
              SESSION_ID,

            medicine:
              result.medicine

          }

        );
        setImage(null);

setQuestion("");

if (fileInputRef.current) {

  fileInputRef.current.value = "";

}
        setMessages(
          (prev) => [

            ...prev,

            {
              sender: "ai",

              text:
`✅ Image analyzed successfully

💊 Detected Medicine: ${result.medicine}

🎯 Confidence: ${result.confidence}%

I will remember this medicine for this conversation.

You can now ask:

• What is it used for?
• Side effects?
• Best time to take it?
• Precautions?`
            }

          ]
        );

        
      }

      catch (error) {

        console.error(error);

        setMessages(
          (prev) => [

            ...prev,

            {
              sender: "ai",

              text:
                "❌ Unable to analyze medicine image."
            }

          ]
        );

      }

      finally {

        setLoading(false);
      }
    };

  // =====================================
  // SEND MESSAGE
  // =====================================

  const sendMessage =
    async () => {

      console.log(
  "SEND CLICKED"
);



console.log(
  "SESSION_ID =",
  SESSION_ID
);


      if (!question.trim())
        return;

      const userQuestion =
        question;
      console.log(
  "QUESTION =",
  userQuestion
);
      setMessages(
        (prev) => [

          ...prev,

          {
            sender: "user",

            text:
              userQuestion
          }

        ]
      );

      setQuestion("");

      try {

        setLoading(true);

        const response =
          await askAssistant(

            SESSION_ID,

            userQuestion
          );
          console.log(
  "AI RESPONSE =",
  response
);

        setMessages(
          (prev) => [

            ...prev,

            {
              sender: "ai",

              text:
                response.answer
            }

          ]
        );

      }

      catch (error) {

        console.error(error);

        setMessages(
          (prev) => [

            ...prev,

            {
              sender: "ai",

              text:
                "❌ Unable to connect to RxGuardian AI."
            }

          ]
        );
      }

      finally {

        setLoading(false);
      }
    };

  return (

    <>
      {/* Floating Button */}

      {!forceOpen && (
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="
    fixed
    bottom-6
    right-6
    w-16
    h-16
    rounded-full
    bg-gradient-to-br
    from-emerald-500
    to-cyan-600
    text-white
    text-3xl
    shadow-2xl
    z-50
    hover:scale-105
    transition-all
    "
  >
    🤖
  </button>
)}

      {/* Assistant Window */}

      {isOpen && (

        <div
  className={
    forceOpen
      ? `
        w-full
        h-full
        bg-white
        rounded-[30px]
        shadow-[0_25px_80px_rgba(0,0,0,0.08)]
        border
        border-slate-200
        overflow-hidden
        flex
        flex-col
      `
      : `
        fixed
        bottom-24
        right-6
        w-[420px]
        h-[650px]
        bg-white
        rounded-[30px]
        shadow-[0_25px_80px_rgba(0,0,0,0.15)]
        border
        border-slate-200
        overflow-hidden
        z-50
        flex
        flex-col
      `
  }
>

          {/* Header */}

          <div

            className="
            bg-gradient-to-r
            from-emerald-600
            via-cyan-600
            to-blue-600
            text-white
            p-5
            "

          >

            <div
              className="
              flex
              justify-between
              items-center
              "
            >

              <div>

                <h2
                  className="
                  text-lg
                  font-bold
                  "
                >
                  RxGuardian AI
                </h2>

                <p
                  className="
                  text-xs
                  text-white/90
                  "
                >
                  Your Smart Medicine Assistant
                </p>

              </div>

              {!forceOpen && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="
                  w-8
                  h-8
                  rounded-full
                  bg-white/20
                  hover:bg-white/30
                  "
                >
                  ✕
                </button>
              )}

            </div>

          </div>

          {/* Chat Area */}

          <div
  className="
  flex-1
  overflow-y-auto
  p-4
  bg-slate-50
  space-y-3
  "
>

            {messages.map(

              (msg, index) => (

                <div

                  key={index}

                  className={

                    msg.sender ===
                    "user"

                      ? "flex justify-end"

                      : "flex justify-start"
                  }

                >

                  <div

                    className={

                      msg.sender ===
                      "user"

                        ? `
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-600
                        text-white
                        px-4
                        py-3
                        rounded-3xl
                        max-w-[85%]
                        whitespace-pre-wrap
                        `

                        : `
                        bg-white
                        border
                        border-slate-200
                        text-slate-800
                        px-4
                        py-3
                        rounded-3xl
                        max-w-[85%]
                        whitespace-pre-wrap
                        shadow-sm
                        `
                    }

                  >

                    {msg.text}

                  </div>

                </div>

              )

            )}

           {/* Quick Suggestions */}

{/* {messages.length === 1 && (

  <div
  className="
  flex
  flex-wrap
  gap-2
  justify-center
  mt-3
  mb-3
  "
>

  <button
    onClick={() =>
      setQuestion(
        "Explain this medicine"
      )
    }
    className="
    px-3
    py-2
    bg-white
    border
    rounded-full
    text-sm
    "
  >
    💊 Explain Medicine
  </button>

  <button
    onClick={() =>
      setQuestion(
        "What are the side effects?"
      )
    }
    className="
    px-3
    py-2
    bg-white
    border
    rounded-full
    text-sm
    "
  >
    ⚠ Side Effects
  </button>

  <button
    onClick={() =>
      setQuestion(
        "What is the dosage?"
      )
    }
    className="
    px-3
    py-2
    bg-white
    border
    rounded-full
    text-sm
    "
  >
    📋 Dosage
  </button>

  <button
    onClick={() =>
      setQuestion(
        "What precautions should I follow?"
      )
    }
    className="
    px-3
    py-2
    bg-white
    border
    rounded-full
    text-sm
    "
  >
    🛡 Precautions
  </button>

</div>

)} */}
            {loading && (

              <div
                className="
                flex
                justify-start
                "
              >

                <div

                  className="
                  bg-white
                  border
                  px-4
                  py-3
                  rounded-3xl
                  "

                >

                  🤖 RxGuardian AI is thinking...

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

          

          {/* Input Section */}

<div
  className="
  bg-white
  border-t
  p-3
  mt-auto
  "
>

  {image && (

  <div
    className="
    mb-2
    flex
    items-center
    justify-between
    px-3
    py-2
    bg-emerald-50
    border
    border-emerald-200
    rounded-xl
    text-sm
    text-emerald-700
    "
  >

    <span>
      📷 {image.name}
    </span>

    <button

      onClick={() => {

        setImage(null);

        if (
          fileInputRef.current
        ) {

          fileInputRef.current.value = "";

        }

      }}

      className="
      text-red-500
      font-bold
      "

    >

      ✕

    </button>

  </div>

)}

  <div
    className="
    flex
    items-center
    gap-2
    bg-slate-100
    rounded-3xl
    px-3
    py-2
    "
  >

    {/* Upload */}

    <label
  className="
  cursor-pointer
  w-10
  h-10
  rounded-full
  bg-white
  border
  border-slate-300
  flex
  items-center
  justify-center
  hover:bg-slate-100
  transition-all
  "
>

  <ImagePlus
    size={20}
    className="
    text-emerald-600
    "
  />

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) =>
      setImage(
        e.target.files[0]
      )
    }
  />

</label>

    {/* Text Input */}

    <input
      ref={inputRef}
      value={question}

      onChange={(e) =>
        setQuestion(
          e.target.value
        )
      }

      onKeyDown={(e) => {

        if (e.key === "Enter") {

          if (
            image &&
            !question.trim()
            ) {

            handleImageUpload();

            }

          else {

            sendMessage();

            }

        }

      }}

      placeholder="Ask about medicines..."

      className="
      flex-1
      bg-transparent
      outline-none
      text-sm
      "
    />

    {/* Send */}

    <button

  onClick={() => {

    if (
      image &&
      !question.trim()
    ) {

      handleImageUpload();

    }

    else {

      sendMessage();

    }

  }}

  className="
  w-10
  h-10
  rounded-full
  bg-gradient-to-r
  from-emerald-500
  via-cyan-500
  to-blue-600
  text-white
  flex
  items-center
  justify-center
  hover:scale-105
  transition
  "

>

  ➤

</button>

  </div>

</div>

        </div>

      )}

    </>
  );
}