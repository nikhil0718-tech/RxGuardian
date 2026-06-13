import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Plus, Download, X, Clock3, Pill, AlertCircle,
  User, Stethoscope, Sparkles, HeartPulse
} from "lucide-react";
import DoctorLayout from "../../layouts/DoctorLayout";
import API from "../../api/api";
import Select from "react-select";
import medicineOptions from "../../data/medicineOptions";

/* ─── Motion variants ───────────────────────────────────────────────── */
const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08 } },
};
const up = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Custom select styles ──────────────────────────────────────────── */
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "48px",
    borderRadius: "16px",
    borderColor: state.isFocused ? "#0BA5A4" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(11,165,164,0.15)" : "none",
    paddingLeft: "8px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    "&:hover": { borderColor: "#0BA5A4" },
  }),
  valueContainer: (provided) => ({ ...provided, padding: "0 10px" }),
  input: (provided) => ({ ...provided, margin: "0px" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (provided) => ({ ...provided, color: "#0BA5A4" }),
  menu: (provided) => ({ ...provided, borderRadius: "16px", overflow: "hidden" }),
};

/* ════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════ */
const CreatePrescription = () => {
  // ── States (unchanged) ──
  const [patientEmail, setPatientEmail] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Smith");
  const [disease, setDisease] = useState("");
  const [medicines, setMedicines] = useState([
    { medicine_name: "", dosage: "", frequency: "Once Daily", duration: "", timing: "", scheduled_time: "" },
  ]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Add medicine (unchanged) ──
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { medicine_name: "", dosage: "", frequency: "Once Daily", duration: "", timing: "", scheduled_time: "" },
    ]);
  };

  // ── Update medicine (unchanged) ──
  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  // ── Remove medicine ──
  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // ── Submit (unchanged) ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        patient_email: patientEmail,
        doctor_name: doctorName,
        disease: disease,
        medicines: medicines,
      };

      const response = await API.post("/prescriptions/create-session", payload);
      setSessionId(response.data.session_id);
    } catch (error) {
      console.log(error);
      alert("Prescription creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={page}
        className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8"
        style={{ fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif" }}
      >

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-[0_24px_64px_rgba(37,99,235,0.09)] bg-white/80 backdrop-blur-2xl p-8 lg:p-10">
            {/* Blobs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#0BA5A4] opacity-[0.07] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#2563EB] opacity-[0.07] blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-4">
                <FileText className="w-3.5 h-3.5" />
                Smart Prescription System
              </div>

              <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                Create{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                >
                  Prescription
                </span>
              </h1>
              <p className="mt-2 text-slate-500 font-medium">AI-powered prescription creation with automatic reminders</p>
            </div>
          </div>
        </motion.section>

        {/* ══ FORM ══════════════════════════════════════════════════════ */}
        <motion.section variants={up}>
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Patient info ── */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: User, placeholder: "Patient Email", value: patientEmail, onChange: setPatientEmail },
                  { icon: Stethoscope, placeholder: "Doctor Name", value: doctorName, onChange: setDoctorName },
                  { icon: AlertCircle, placeholder: "Disease / Condition", value: disease, onChange: setDisease },
                ].map((field, i) => {
                  const Icon = field.icon;
                  return (
                    <div key={i} className="relative">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
                        <Icon className="w-3 h-3 inline mr-1" />
                        {field.placeholder}
                      </label>
                      <input
                        type={field.placeholder.includes("Email") ? "email" : "text"}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0BA5A4] focus:border-[#0BA5A4] focus:bg-white transition-all duration-200"
                      />
                    </div>
                  );
                })}
              </div>

              {/* ── Medicines ── */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#0BA5A4]" />
                  Medicines
                </h3>

                <AnimatePresence>
                  {medicines.map((medicine, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-[24px] border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-800">Medicine {idx + 1}</h4>
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicine(idx)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors duration-200"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Medicine name */}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
                            Medicine
                          </label>
                          <Select
                            styles={customSelectStyles}
                            options={medicineOptions}
                            placeholder="Search medicine..."
                            value={medicineOptions.find((item) => item.value === medicine.medicine_name)}
                            onChange={(selected) => updateMedicine(idx, "medicine_name", selected.value)}
                          />
                        </div>

                        {/* Dosage */}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
                            Dosage
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 500mg"
                            value={medicine.dosage}
                            onChange={(e) => updateMedicine(idx, "dosage", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0BA5A4] focus:border-[#0BA5A4] transition-all duration-200"
                          />
                        </div>

                        {/* Frequency */}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
                            Frequency
                          </label>
                          <select
                            value={medicine.frequency}
                            onChange={(e) => updateMedicine(idx, "frequency", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0BA5A4] focus:border-[#0BA5A4] transition-all duration-200"
                          >
                            <option>Once Daily</option>
                            <option>Twice Daily</option>
                            <option>Thrice Daily</option>
                            <option>Every 4 Hours</option>
                            <option>Every 6 Hours</option>
                            <option>Every 8 Hours</option>
                            <option>Weekly</option>
                          </select>
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
                            Duration
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 5 Days"
                            value={medicine.duration}
                            onChange={(e) => updateMedicine(idx, "duration", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0BA5A4] focus:border-[#0BA5A4] transition-all duration-200"
                          />
                        </div>

                        {/* Timing */}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
                            Timing
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., After Food"
                            value={medicine.timing}
                            onChange={(e) => updateMedicine(idx, "timing", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0BA5A4] focus:border-[#0BA5A4] transition-all duration-200"
                          />
                        </div>

                        {/* Reminder time */}
                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
                            <Clock3 className="w-3 h-3 inline mr-1" />
                            Reminder Time
                          </label>
                          <input
                            type="time"
                            value={medicine.scheduled_time}
                            onChange={(e) => updateMedicine(idx, "scheduled_time", e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0BA5A4] focus:border-[#0BA5A4] transition-all duration-200"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add medicine button */}
                <button
                  type="button"
                  onClick={addMedicine}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 text-slate-600 font-semibold hover:border-[#0BA5A4] hover:text-[#0BA5A4] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Medicine
                </button>
              </div>

              {/* ── Submit ── */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl text-white text-base font-bold shadow-lg shadow-[#119DD8]/20 hover:shadow-xl hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: loading
                      ? "linear-gradient(135deg,#94a3b8,#cbd5e1)"
                      : "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)",
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Create Prescription
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* ── Download section ── */}
            <AnimatePresence>
              {sessionId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200"
                >
                  <p className="text-sm text-emerald-700 font-semibold mb-3">✓ Prescription created successfully!</p>
                  <a
                    href={`${API_BASE}/prescriptions/download/session/${sessionId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                  >
                    <Download className="w-4 h-4" />
                    Download Prescription PDF
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

      </motion.div>
    </DoctorLayout>
  );
};

export default CreatePrescription;