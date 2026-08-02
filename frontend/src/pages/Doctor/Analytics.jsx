import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, AlertTriangle, Activity } from "lucide-react";

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

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch (unchanged) ──
  const fetchAnalytics = async () => {
    try {
      const response = await API.get("/doctor/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  // ── Loading ──
  if (loading || !analytics) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
            >
              <BarChart3 className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Analytics…</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  const cards = [
    {
      label: "Total Patients",
      value: analytics.total_patients,
      icon: <Users className="w-5 h-5" />,
      from: "#0BA5A4",
      to: "#119DD8",
      sub: "Under your care",
    },
    {
      label: "Average Adherence",
      value: `${analytics.average_adherence}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      from: "#10b981",
      to: "#06b6d4",
      sub: "Across all patients",
    },
    {
      label: "High Risk Patients",
      value: analytics.high_risk_patients,
      icon: <AlertTriangle className="w-5 h-5" />,
      from: "#ef4444",
      to: "#f97316",
      sub: "Requiring attention",
    },
    {
      label: "Total Missed Medicines",
      value: analytics.total_missed_medicines,
      icon: <Activity className="w-5 h-5" />,
      from: "#f59e0b",
      to: "#f97316",
      sub: "Missed medications",
    },
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
            {/* Ambient blobs */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#0BA5A4] opacity-[0.07] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#2563EB] opacity-[0.07] blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-5">
                <BarChart3 className="w-3.5 h-3.5" />
                Clinical Analytics
              </div>

              <h1 className="text-[2.6rem] lg:text-[3rem] font-black leading-[1.1] tracking-tight text-slate-900">
                Doctor{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                >
                  Analytics
                </span>
              </h1>

              <p className="mt-3 text-slate-500 font-medium text-lg">
                Comprehensive clinical adherence overview and insights
              </p>
            </div>
          </div>
        </motion.section>

        {/* ══ ANALYTICS CARDS ═══════════════════════════════════════════ */}
        <motion.section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              variants={up}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6"
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg,${card.from},${card.to})` }}
              />

              {/* Ambient glow */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-[0.08]"
                style={{ background: `radial-gradient(circle,${card.from},${card.to})` }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md mb-4"
                  style={{ background: `linear-gradient(135deg,${card.from},${card.to})` }}
                >
                  {card.icon}
                </div>

                {/* Label */}
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>

                {/* Value */}
                <div className="text-4xl font-black text-slate-900 leading-none mb-2">
                  {card.value}
                </div>

                {/* Sub */}
                <p className="text-xs text-slate-400">{card.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ══ INSIGHTS SECTION ══════════════════════════════════════════ */}
        <motion.section variants={up}>
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 lg:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0BA5A4]" />
              Clinical Summary
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-semibold text-slate-600 mb-1">Overall Program Performance</p>
                <p className="text-2xl font-black text-slate-900">
                  {analytics.average_adherence}% average adherence
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {analytics.average_adherence >= 80
                    ? "✓ Excellent program outcomes"
                    : analytics.average_adherence >= 60
                    ? "⚠ Moderate adherence - focus on improvement strategies"
                    : "🔴 Critical adherence concern - intervention needed"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-semibold text-slate-600 mb-1">Patient Risk Distribution</p>
                <p className="text-2xl font-black text-slate-900">
                  {analytics.high_risk_patients} patients at high risk
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {analytics.high_risk_patients > 0
                    ? `Priority review needed for ${analytics.high_risk_patients} high-risk patient(s)`
                    : "All patients showing acceptable adherence patterns"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-cyan-200">
                <p className="text-sm font-semibold text-cyan-700 mb-1">Recommendation</p>
                <p className="text-base font-semibold text-cyan-900">
                  {analytics.average_adherence < 60
                    ? "Implement intensive adherence interventions and schedule patient callbacks"
                    : "Continue current monitoring protocol and focus on patients below 80% adherence"}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </DoctorLayout>
  );
};

export default Analytics;