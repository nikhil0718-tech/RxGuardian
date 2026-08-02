import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight, Home, Zap } from "lucide-react";

import PatientLayout from "../../layouts/PatientLayout";

/* ─── Motion variants ───────────────────────────────────────────────── */
const containerVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { duration: 0.7, type: "spring", stiffness: 100, damping: 15 },
  },
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.35 } },
};

const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.55 } },
  whileHover: { y: -4, transition: { duration: 0.2 } },
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const VerificationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  const verified = result?.verified;

  return (
    <PatientLayout>
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 lg:p-8">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="w-full max-w-2xl"
        >
          {/* ── Main card ── */}
          <div
            className="relative overflow-hidden rounded-[32px] border shadow-[0_24px_64px_rgba(37,99,235,0.12)] backdrop-blur-2xl p-8 lg:p-12"
            style={{
              background: verified
                ? "linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 100%)"
                : "linear-gradient(135deg,#fef2f2 0%,#fef5f5 100%)",
              borderColor: verified ? "#d1fae5" : "#fee2e2",
            }}
          >
            {/* Ambient blobs */}
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{
                background: verified
                  ? "radial-gradient(circle, #10b981, #059669)"
                  : "radial-gradient(circle, #ef4444, #dc2626)",
              }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 blur-2xl pointer-events-none"
              style={{
                background: verified
                  ? "radial-gradient(circle, #10b981, #059669)"
                  : "radial-gradient(circle, #ef4444, #dc2626)",
              }}
            />

            <div className="relative text-center">
              {/* Icon */}
              <motion.div
                variants={iconVariants}
                className="flex justify-center mb-6"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: verified
                      ? "linear-gradient(135deg,#10b981,#059669)"
                      : "linear-gradient(135deg,#ef4444,#dc2626)",
                  }}
                >
                  {verified ? (
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-white" />
                  )}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={textVariants}
                className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-3"
                style={{
                  color: verified ? "#059669" : "#dc2626",
                }}
              >
                {verified ? "Medicine Matched" : "Wrong Medicine"}
              </motion.h1>

              {/* Status message */}
              <motion.p
                variants={textVariants}
                className="text-lg font-semibold"
                style={{
                  color: verified ? "#10b981" : "#ef4444",
                }}
              >
                {verified
                  ? "✓ Medicine verified and recorded successfully"
                  : "⚠ Please verify before taking this medicine"}
              </motion.p>

              {/* Result card */}
              <motion.div
                variants={cardVariants}
                className="mt-8 rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg p-6 lg:p-8"
              >
                <div className="space-y-6">
                  {/* Predicted medicine */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      AI Detected Medicine
                    </p>
                    <p
                      className="text-3xl lg:text-4xl font-black"
                      style={{
                        color: verified ? "#0BA5A4" : "#dc2626",
                      }}
                    >
                      {result?.medicine_name || "Unknown"}
                    </p>
                  </div>

                  {/* Confidence score */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Confidence Score
                    </p>
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result?.confidence_score || 0}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{
                              background: verified
                                ? "linear-gradient(90deg,#10b981,#059669)"
                                : "linear-gradient(90deg,#ef4444,#dc2626)",
                            }}
                          />
                        </div>
                      </div>
                      <p
                        className="text-2xl lg:text-3xl font-black font-mono min-w-fit"
                        style={{
                          color: verified ? "#10b981" : "#ef4444",
                        }}
                      >
                        {result?.confidence_score || 0}%
                      </p>
                    </div>
                  </div>

                  {/* Expected medicine (if mismatch) */}
                  {!verified && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Expected Medicine
                      </p>
                      <p className="text-2xl lg:text-3xl font-black text-red-600">
                        {result?.expected_medicine || "Unknown"}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action button */}
              <motion.button
                variants={buttonVariants}
                whileHover="whileHover"
                onClick={() => navigate("/patient/today-medicines")}
                className="mt-8 w-full lg:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-200"
                style={{
                  background: verified
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : "linear-gradient(135deg,#ef4444,#dc2626)",
                }}
              >
                {verified ? (
                  <>
                    <Home className="w-5 h-5" />
                    Back to Today's Medicines
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Try Again
                  </>
                )}
              </motion.button>

              {/* Info note */}
              <motion.div
                variants={buttonVariants}
                className="mt-6 p-4 rounded-2xl"
                style={{
                  background: verified
                    ? "rgba(16, 185, 129, 0.05)"
                    : "rgba(239, 68, 68, 0.05)",
                  borderColor: verified ? "#d1fae5" : "#fee2e2",
                  borderWidth: "1px",
                }}
              >
                <p
                  className="text-sm font-medium flex items-center justify-center gap-2"
                  style={{ color: verified ? "#059669" : "#dc2626" }}
                >
                  <Zap className="w-4 h-4" />
                  {verified
                    ? "Great job! Your medicine adherence is being tracked."
                    : "Contact your healthcare provider if unsure about the medicine."}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </PatientLayout>
  );
};

export default VerificationResult;