import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, ImageIcon, CheckCircle2, AlertCircle, Sparkles,
  Pill, Activity, Clock3, Zap, TrendingUp, Shield
} from "lucide-react";

import PatientLayout from "../../layouts/PatientLayout";
import API from "../../api/api";

/* ─── Motion variants ───────────────────────────────────────────────── */
const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08 } },
};
const up = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const UploadMedicine = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── Get reminder ID (unchanged) ──
  const reminderId = searchParams.get("reminder_id");

  // ── Logged in user (unchanged) ──
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const patientId = loggedInUser?.id;

  // ── States (unchanged) ──
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ── File change (unchanged) ──
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // ── Drag handlers ──
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  // ── Upload (unchanged except for local state management) ──
  const handleUpload = async () => {
    if (!file) {
      alert("Upload medicine image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      let response;

      // Reminder flow
      if (reminderId) {
        response = await API.post(
          `/reminders/verify-and-take/${reminderId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        navigate("/patient/verification-result", {
          state: {
            verified: response.data.verified,
            medicine_name: response.data.medicine_name,
            confidence_score: response.data.confidence_score,
            expected_medicine: response.data.expected_medicine,
          },
        });
        return;
      }

      // Normal AI flow
      else {
        if (!patientId) {
          alert("Please login again");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const email = user.email;

        response = await API.post(
          `/ai/verify-tablet-email/${email}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setResult(response.data);
      }
    } catch (error) {
      console.log(error);
      alert("AI Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = reminderId ? "Take Medicine" : "AI Medicine Verification";
  const isCorrect = result?.status === "Correct Medicine";

  return (
    <PatientLayout>
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
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered
              </div>

              <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                {pageTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                >
                  {pageTitle.split(" ").slice(-1)[0]}
                </span>
              </h1>
              <p className="mt-2 text-slate-500 font-medium">
                Upload medicine image for AI verification
              </p>
            </div>
          </div>
        </motion.section>

        {/* ══ UPLOAD SECTION ════════════════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative overflow-hidden rounded-[28px] border-2 border-dashed transition-all duration-200 p-10 lg:p-14 text-center ${
              dragActive
                ? "border-[#0BA5A4] bg-[#0BA5A4]/5"
                : "border-slate-200 bg-white/80 backdrop-blur-xl"
            }`}
          >
            {/* Upload icon container */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  dragActive ? "scale-110" : "scale-100"
                }`}
                style={{
                  background: dragActive
                    ? "linear-gradient(135deg,#0BA5A4,#119DD8)"
                    : "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
                }}
              >
                <ImageIcon
                  className={`w-8 h-8 ${
                    dragActive ? "text-white" : "text-sky-600"
                  }`}
                />
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              {dragActive ? "Drop your image here" : "Upload Medicine Image"}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Drag and drop your medicine photo, or click to browse
            </p>

            {/* File input (hidden) */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="file-input"
              className="hidden"
            />

            {/* Upload button */}
            <label htmlFor="file-input" className="cursor-pointer">
              <button
                type="button"
                onClick={() => document.getElementById("file-input").click()}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-lg shadow-[#119DD8]/20 hover:shadow-xl hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
              >
                <Upload className="w-4 h-4" />
                {file ? "Change Image" : "Select Image"}
              </button>
            </label>

            {file && (
              <p className="mt-4 text-sm font-semibold text-slate-700">
                Selected: <span className="text-[#0BA5A4]">{file.name}</span>
              </p>
            )}
          </div>
        </motion.section>

        {/* ══ IMAGE PREVIEW ═════════════════════════════════════════════ */}
        <AnimatePresence>
          {preview && (
            <motion.section
              variants={up}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 lg:p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#0BA5A4]" />
                  Uploaded Image
                </h2>
                <img
                  src={preview}
                  alt="medicine"
                  className="max-w-sm rounded-2xl shadow-lg mx-auto"
                />

                {/* Verify button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-white text-sm font-bold shadow-lg shadow-[#119DD8]/20 hover:shadow-xl hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: loading
                        ? "linear-gradient(135deg,#94a3b8,#cbd5e1)"
                        : "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)",
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        AI is verifying...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Verify Medicine
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ══ VERIFICATION RESULT (Normal AI Flow Only) ═════════════════ */}
        <AnimatePresence>
          {result && !reminderId && (
            <motion.section
              variants={up}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-6">

                {/* ── Result header card ── */}
                <div
                  className="relative overflow-hidden rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-8 border"
                  style={{
                    background: isCorrect
                      ? "linear-gradient(135deg,#ecfdf5,#f0fdf4)"
                      : "linear-gradient(135deg,#fef2f2,#fef5f5)",
                    borderColor: isCorrect ? "#d1fae5" : "#fee2e2",
                  }}
                >
                  {/* Background icon */}
                  <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
                    {isCorrect ? (
                      <CheckCircle2 className="w-48 h-48 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-48 h-48 text-red-500" />
                    )}
                  </div>

                  <div className="relative flex items-start justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                        style={{
                          background: isCorrect
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                          color: isCorrect ? "#059669" : "#dc2626",
                        }}>
                        {isCorrect ? "✓ Verified" : "⚠ Mismatch"}
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-black"
                        style={{ color: isCorrect ? "#059669" : "#dc2626" }}>
                        {result.status}
                      </h2>
                      <p className="mt-1 text-sm font-medium"
                        style={{ color: isCorrect ? "#10b981" : "#f87171" }}>
                        {isCorrect
                          ? "The medicine has been verified successfully."
                          : "Please verify the medicine name before proceeding."}
                      </p>
                    </div>

                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isCorrect
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(239, 68, 68, 0.15)",
                      }}>
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6" style={{ color: "#059669" }} />
                      ) : (
                        <AlertCircle className="w-6 h-6" style={{ color: "#dc2626" }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Medicine details grid ── */}
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    {
                      icon: <Pill className="w-5 h-5" />,
                      label: "Medicine Name",
                      value: result.medicine_name,
                      color: "text-[#0BA5A4]",
                    },
                    {
                      icon: <TrendingUp className="w-5 h-5" />,
                      label: "Confidence Score",
                      value: `${result.confidence_score}%`,
                      color: "text-[#119DD8]",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-[24px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-5 lg:p-6"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
                        >
                          <span className={`${item.color}`}>{item.icon}</span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                          {item.label}
                        </p>
                      </div>
                      <p className="text-2xl lg:text-3xl font-black text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ── Prescription details (if available) ── */}
                {result.prescription_details && (
                  <div className="rounded-[28px] bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/60"
                        style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}>
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Prescription Details</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { label: "Dosage", value: result.prescription_details.dosage, icon: <Pill className="w-4 h-4" /> },
                        { label: "Frequency", value: result.prescription_details.frequency, icon: <Clock3 className="w-4 h-4" /> },
                        { label: "Duration", value: result.prescription_details.duration, icon: <Zap className="w-4 h-4" /> },
                        { label: "Timing", value: result.prescription_details.timing, icon: <Shield className="w-4 h-4" /> },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-white/60 border border-white/60">
                          <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-600">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </motion.div>
    </PatientLayout>
  );
};

export default UploadMedicine;