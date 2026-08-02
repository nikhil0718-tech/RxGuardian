import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Activity, CheckCircle2, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";

import DoctorLayout from "../../layouts/DoctorLayout";
import AdherencePieChart from "../../components/charts/AdherencePieChart";
import AdherenceBarChart from "../../components/charts/AdherenceBarChart";
import WeeklyTrendChart from "../../components/charts/WeeklyTrendChart";
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
const PatientAdherenceDashboard = () => {
  const [adherence, setAdherence] = useState(null);
  const [loading, setLoading] = useState(true);

  const patientName = localStorage.getItem("selected_patient_name");
  const patientEmail = localStorage.getItem("selected_patient_email");

  // ── Fetch (unchanged) ──
  const fetchDashboard = async () => {
    try {
      const selectedPatientEmail = localStorage.getItem("selected_patient_email");
      if (!selectedPatientEmail) { console.log("No patient selected"); return; }
      const response = await API.get(`/adherence/patient-email/${selectedPatientEmail}`);
      setAdherence(response.data);
    } catch (error) {
      console.log("DASHBOARD ERROR =", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);
  useEffect(() => {
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Insight logic (unchanged) ──
  let insightMessage = "Patient adherence is stable.";
  let insightStyle = "bg-emerald-50 border-emerald-400 text-emerald-800";

  if (adherence?.adherence_percentage < 80) {
    insightMessage = "⚠ Adherence consistency is dropping. Monitor closely.";
    insightStyle = "bg-amber-50 border-amber-400 text-amber-800";
  }

  if (adherence?.adherence_percentage < 50) {
    insightMessage = "🔴 Critical adherence risk detected. Immediate intervention recommended.";
    insightStyle = "bg-red-50 border-red-400 text-red-800";
  }

  // ── Loading ──
  if (loading || !adherence) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
            >
              <Activity className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Dashboard…</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  const kpis = [
    { label: "Adherence", value: `${adherence.adherence_percentage}%`, icon: <Activity className="w-5 h-5" />, from: "#0BA5A4", to: "#119DD8" },
    { label: "Taken", value: adherence.taken_medicines, icon: <CheckCircle2 className="w-5 h-5" />, from: "#10b981", to: "#06b6d4" },
    { label: "Missed", value: adherence.missed_medicines, icon: <AlertCircle className="w-5 h-5" />, from: "#ef4444", to: "#fb923c" },
    { label: "Risk Level", value: adherence.risk_level, isText: true, icon: <TrendingUp className="w-5 h-5" />, from: "#f59e0b", to: "#ef4444" },
  ];

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

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-4">
                <BarChart3 className="w-3.5 h-3.5" />
                Patient Analysis
              </div>

              <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                Patient Adherence{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                >
                  Dashboard
                </span>
              </h1>
              <p className="mt-2 text-slate-500 font-medium">Real-time adherence analytics and insights</p>
            </div>
          </div>
        </motion.section>

        {/* ══ PATIENT INFO CARD ═════════════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
              >
                {(patientName?.split(" ").map((w) => w[0]).slice(0, 2).join("") || "P").toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-800">{patientName || "Patient"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <p className="text-sm text-slate-500">{patientEmail || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ══ KPI CARDS ═════════════════════════════════════════════════ */}
        <motion.section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {kpis.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={up}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6"
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg,${kpi.from},${kpi.to})` }}
              />

              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-[0.08]"
                style={{ background: `radial-gradient(circle,${kpi.from},${kpi.to})` }}
              />

              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md mb-4"
                  style={{ background: `linear-gradient(135deg,${kpi.from},${kpi.to})` }}
                >
                  {kpi.icon}
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                <p className={`text-4xl font-black ${kpi.isText ? "text-slate-900" : "text-slate-900"}`}>{kpi.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ══ CHARTS ════════════════════════════════════════════════════ */}
        <motion.section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {[
            {
              title: "Adherence Summary",
              chart: (
                <AdherencePieChart
                  taken={adherence.taken_medicines}
                  missed={adherence.missed_medicines}
                  pending={adherence.pending_medicines}
                />
              ),
            },
            {
              title: "Weekly Analysis",
              chart: (
                <AdherenceBarChart
                  taken={adherence.taken_medicines}
                  missed={adherence.missed_medicines}
                  pending={adherence.pending_medicines}
                />
              ),
            },
          ].map((c) => (
            <motion.div
              key={c.title}
              variants={up}
              className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6"
            >
              <h3 className="text-base font-bold text-slate-800 mb-4">{c.title}</h3>
              <div className="rounded-2xl bg-gradient-to-br from-slate-50/60 to-white/60 border border-slate-100 p-3">
                {c.chart}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ══ WEEKLY TREND ══════════════════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Weekly Trend</h3>
            <div className="rounded-2xl bg-gradient-to-br from-slate-50/60 to-white/60 border border-slate-100 p-4">
              <WeeklyTrendChart />
            </div>
          </div>
        </motion.section>

        {/* ══ DOCTOR INSIGHTS ═══════════════════════════════════════════ */}
        <motion.section variants={up}>
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 lg:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Doctor Insights</h3>
            <div className={`p-6 rounded-2xl border-2 ${insightStyle} font-medium leading-relaxed`}>
              {insightMessage}
            </div>

            {adherence.risk_level === "HIGH" && (
              <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200">
                <p className="text-sm font-semibold text-red-800">
                  ⚠️ Recommend scheduling a patient follow-up call to discuss barriers to adherence.
                </p>
              </div>
            )}
          </div>
        </motion.section>

      </motion.div>
    </DoctorLayout>
  );
};

export default PatientAdherenceDashboard;