import PatientLayout from "../../layouts/PatientLayout";
import RxGuardianAssistant from "../../components/assistant/RxGuardianAssistant";

export default function MedicineAgent() {
  return (
    <PatientLayout>
      <div className="p-8 h-[calc(100vh-40px)]">

        {/* Header */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-semibold">
            🤖 AI ASSISTANT
          </div>

          {/* <h1 className="mt-4 text-5xl font-black text-slate-900">
            RxGuardian{" "}
            <span className="text-cyan-500">
              Assistant
            </span>
          </h1>

          <p className="mt-3 text-slate-500 text-lg">
            Upload medicine images, analyze prescriptions,
            ask medication questions and get AI-powered guidance.
          </p> */}
        </div>

        {/* Assistant Container */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden h-[70vh]">

          <RxGuardianAssistant forceOpen />

        </div>

      </div>
    </PatientLayout>
  );
}