import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Users, AlertCircle, TrendingDown, Heart, BarChart3, Zap } from "lucide-react";

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
const DoctorDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch (unchanged) ──
  const fetchDashboard = async () => {
    try {
      const response = await API.get("/doctor/analytics");
      setAnalytics(response.data);
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
  const getInsightData = () => {
    if (!analytics) {
      return { message: "Loading insights...", style: "bg-slate-50 border-slate-300 text-slate-700" };
    }
    const adherence = analytics.average_adherence;
    if (adherence >= 80) {
      return {
        message: "✓ Excellent adherence! Patients are maintaining high medication compliance.",
        style: "bg-emerald-50 border-emerald-400 text-emerald-800",
        color: "#10b981",
      };
    }
    if (adherence >= 60) {
      return {
        message: "⚠ Good adherence with room for improvement. Monitor patient progress.",
        style: "bg-sky-50 border-sky-400 text-sky-800",
        color: "#0ea5e9",
      };
    }
    if (adherence >= 40) {
      return {
        message: "⚠ Medium adherence risk detected. Intervention recommended.",
        style: "bg-amber-50 border-amber-400 text-amber-800",
        color: "#f59e0b",
      };
    }
    return {
      message: "🔴 Critical adherence risk! Immediate intervention required.",
      style: "bg-red-50 border-red-400 text-red-800",
      color: "#ef4444",
    };
  };

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
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Dashboard…</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  const insightData = getInsightData();

  const kpis = [
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
      icon: <Activity className="w-5 h-5" />,
      from: "#10b981",
      to: "#06b6d4",
      sub: "Across all patients",
    },
    {
      label: "High Risk Patients",
      value: analytics.high_risk_patients,
      icon: <AlertCircle className="w-5 h-5" />,
      from: "#ef4444",
      to: "#f97316",
      sub: "Requiring attention",
    },
    {
      label: "Total Missed",
      value: analytics.total_missed_medicines,
      icon: <TrendingDown className="w-5 h-5" />,
      from: "#f59e0b",
      to: "#f97316",
      sub: "Missed medicines",
    },
  ];

  return (
    <DoctorLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={page}
        className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 font-[system-ui]"
        style={{ fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif" }}
      >

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-[0_24px_64px_rgba(37,99,235,0.10)] bg-white/80 backdrop-blur-2xl">
            {/* Ambient blobs */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#0BA5A4] opacity-[0.07] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#2563EB] opacity-[0.07] blur-3xl pointer-events-none" />

            <div className="relative p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-5">
                <Activity className="w-3.5 h-3.5" />
                Clinical Dashboard
              </div>

              <h1 className="text-[2.6rem] lg:text-[3rem] font-black leading-[1.1] tracking-tight text-slate-900">
                Doctor{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                >
                  Dashboard
                </span>
              </h1>

              <p className="mt-3 text-slate-500 font-medium text-lg">
                Real-time patient adherence analytics and clinical insights
              </p>
            </div>
          </div>
        </motion.section>

        {/* ══ KPI CARDS ═════════════════════════════════════════════════ */}
        <motion.section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              variants={up}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 cursor-default"
            >
              {/* Gradient top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[28px]"
                style={{ background: `linear-gradient(90deg,${kpi.from},${kpi.to})` }}
              />

              {/* Ambient glow */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-[0.08]"
                style={{ background: `radial-gradient(circle,${kpi.from},${kpi.to})` }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md mb-4"
                  style={{ background: `linear-gradient(135deg,${kpi.from},${kpi.to})` }}
                >
                  {kpi.icon}
                </div>

                {/* Label */}
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>

                {/* Value */}
                <div className="text-4xl font-black text-slate-900 leading-none mb-2">
                  {kpi.value}
                </div>

                {/* Sub */}
                <p className="text-xs text-slate-400">{kpi.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ══ DOCTOR INSIGHTS ═══════════════════════════════════════════ */}
        <motion.section variants={up}>
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
              >
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AI-Powered</p>
                <h3 className="text-base font-bold text-slate-800">Doctor Insights</h3>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border-2 ${insightData.style} text-lg font-medium leading-relaxed`}>
              {insightData.message}
            </div>

            {/* Secondary metrics */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Clinical Action</p>
                <p className="text-sm font-bold text-slate-800">
                  {analytics.high_risk_patients > 0
                    ? `Review ${analytics.high_risk_patients} high-risk patient(s)`
                    : "All patients monitored successfully"}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-sm font-bold text-slate-800">
                  Focus on patients with adherence below 60%
                </p>
              </div>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </DoctorLayout>
  );
};

export default DoctorDashboard; 