import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Eye, Activity, AlertCircle, TrendingDown, CheckCircle2 } from "lucide-react";

import DoctorLayout from "../../layouts/DoctorLayout";
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

/* ── Risk config ── */
const riskConfig = {
  LOW:    { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200", dot: "#10b981" },
  MEDIUM: { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200",   dot: "#f59e0b" },
  HIGH:   { bg: "bg-red-50",      text: "text-red-700",     border: "border-red-200",     dot: "#ef4444" },
};

const getRisk = (risk) => riskConfig[risk] || riskConfig.MEDIUM;

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ── Fetch (unchanged) ──
  const fetchPatients = async () => {
    try {
      const response = await API.get("/doctor/patients");
      setPatients(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  // ── Loading ──
  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
            >
              <Users className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Patients…</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

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
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-[0_24px_64px_rgba(37,99,235,0.10)] bg-white/80 backdrop-blur-2xl p-8 lg:p-10">
            {/* Blobs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#0BA5A4] opacity-[0.07] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#2563EB] opacity-[0.07] blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-4">
                  <Users className="w-3.5 h-3.5" />
                  Patient Monitoring
                </div>

                <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                  Manage{" "}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                  >
                    Patients
                  </span>
                </h1>
                <p className="mt-2 text-slate-500 font-medium">Monitor adherence and manage patient risk</p>
              </div>

              {patients.length > 0 && (
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  {[
                    { label: "Total", val: patients.length, bg: "bg-sky-50", text: "text-sky-700" },
                    { label: "Low Risk", val: patients.filter((p) => p.risk_level === "LOW").length, bg: "bg-emerald-50", text: "text-emerald-700" },
                    { label: "High Risk", val: patients.filter((p) => p.risk_level === "HIGH").length, bg: "bg-red-50", text: "text-red-700" },
                  ].map((s) => (
                    <div key={s.label} className={`flex items-center gap-2 px-3 py-2 rounded-2xl ${s.bg} border border-white/60`}>
                      <p className={`text-lg font-black ${s.text}`}>{s.val}</p>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ══ EMPTY STATE ═══════════════════════════════════════════════ */}
        {patients.length === 0 && (
          <motion.div
            variants={up}
            className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-16 text-center"
          >
            <div
              className="w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#dbeafe,#bfdbfe)" }}
            >
              <Users className="w-10 h-10 text-sky-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">No Patients Found</h2>
            <p className="mt-2 text-slate-400 font-medium">Your patient list will appear here once patients are assigned to you.</p>
          </motion.div>
        )}

        {/* ══ PATIENT TABLE ═════════════════════════════════════════════ */}
        {patients.length > 0 && (
          <motion.section variants={up} className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-50/50 border-b border-slate-100">
                    {[
                      { label: "Patient", icon: <Users className="w-4 h-4" /> },
                      { label: "Email", icon: null },
                      { label: "Adherence", icon: <Activity className="w-4 h-4" /> },
                      { label: "Missed", icon: <TrendingDown className="w-4 h-4" /> },
                      { label: "Risk", icon: <AlertCircle className="w-4 h-4" /> },
                      { label: "Action", icon: null },
                    ].map((col, i) => (
                      <th
                        key={i}
                        className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          {col.icon && <span className="text-slate-300">{col.icon}</span>}
                          {col.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, i) => {
                    const risk = getRisk(patient.risk_level);

                    return (
                      <tr
                        key={i}
                        className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors duration-150"
                      >
                        {/* Patient name */}
                        <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                              style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
                            >
                              {(patient.patient_name?.split(" ").map((w) => w[0]).slice(0, 2).join("") || "P").toUpperCase()}
                            </div>
                            {patient.patient_name}
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4 text-slate-600 text-sm whitespace-nowrap">{patient.email}</td>

                        {/* Adherence */}
                        <td className="px-5 py-4 font-bold text-transparent bg-clip-text whitespace-nowrap"
                          style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#2563EB)" }}>
                          {patient.adherence_percentage}%
                        </td>

                        {/* Missed */}
                        <td className="px-5 py-4 font-semibold text-red-600 whitespace-nowrap">{patient.missed_medicines}</td>

                        {/* Risk */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${risk.bg} ${risk.text} border ${risk.border}`}>
                            <span className="w-2 h-2 rounded-full" style={{ background: risk.dot }} />
                            {patient.risk_level}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => {
                              localStorage.setItem("selected_patient_email", patient.email);
                              localStorage.setItem("selected_patient_name", patient.patient_name);
                              navigate("/doctor/patient-adherence");
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-white text-xs font-bold shadow-md shadow-[#119DD8]/20 hover:shadow-lg hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium">
                Total Patients: <span className="text-slate-600 font-bold">{patients.length}</span>
              </p>
            </div>
          </motion.section>
        )}

      </motion.div>
    </DoctorLayout>
  );
};

export default Patients;