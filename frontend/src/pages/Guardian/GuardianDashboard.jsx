import React, { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Brain,
  BarChart2,
  PieChart,
  Calendar,
  Users,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Sparkles,
  Eye,
} from "lucide-react";

import GuardianLayout from "../../layouts/GuardianLayout";

import AdherencePieChart from "../../components/charts/AdherencePieChart";
import AdherenceBarChart from "../../components/charts/AdherenceBarChart";
import WeeklyTrendChart from "../../components/charts/WeeklyTrendChart";

import API from "../../api/api";

/* ─── Animated counter ──────────────────────────────────────────────── */
function CountUp({ to, suffix = "", duration = 1.2 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [to]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

/* ─── Pulse dot ─────────────────────────────────────────────────────── */
function PulseDot({ color = "#0BA5A4" }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

/* ─── Healthcare SVG Illustrations ──────────────────────────────────── */
const MonitoringIllustration = () => (
  <svg
    viewBox="0 0 320 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="heroGrad2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0BA5A4" />
        <stop offset="50%" stopColor="#119DD8" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <linearGradient id="cardGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.9" />
      </linearGradient>
      <filter id="softShadow2">
        <feDropShadow
          dx="0"
          dy="8"
          stdDeviation="12"
          floodColor="#2563EB"
          floodOpacity="0.15"
        />
      </filter>
    </defs>

    {/* Background blobs */}
    <ellipse cx="260" cy="60" rx="80" ry="60" fill="url(#heroGrad2)" opacity="0.07" />
    <ellipse cx="60" cy="200" rx="70" ry="50" fill="url(#heroGrad2)" opacity="0.05" />

    {/* Dashboard screen */}
    <rect
      x="100"
      y="30"
      width="120"
      height="140"
      rx="16"
      fill="url(#cardGrad2)"
      filter="url(#softShadow2)"
    />
    <rect x="108" y="42" width="104" height="80" rx="8" fill="url(#heroGrad2)" opacity="0.08" />

    {/* Grid lines */}
    <line x1="115" y1="95" x2="195" y2="95" stroke="url(#heroGrad2)" strokeWidth="1.5" opacity="0.4" />
    <line x1="115" y1="105" x2="195" y2="105" stroke="url(#heroGrad2)" strokeWidth="1.5" opacity="0.3" />
    <line x1="115" y1="115" x2="195" y2="115" stroke="url(#heroGrad2)" strokeWidth="1.5" opacity="0.25" />

    {/* Users circle (monitor) */}
    <circle cx="240" cy="90" r="32" fill="#2563EB" opacity="0.15" />
    <circle cx="240" cy="90" r="24" fill="#2563EB" opacity="0.1" />
    <circle cx="232" cy="85" r="5" fill="#2563EB" opacity="0.5" />
    <circle cx="248" cy="85" r="5" fill="#2563EB" opacity="0.5" />
    <path d="M230 95 Q240 102 250 95" stroke="#2563EB" strokeWidth="2" fill="none" opacity="0.6" />

    {/* Check badge */}
    <circle cx="65" cy="145" r="26" fill="#10b981" opacity="0.12" />
    <circle cx="65" cy="145" r="18" fill="#10b981" opacity="0.2" />
    <path
      d="M57 145 l5 5 l11-11"
      stroke="#10b981"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Floating dots */}
    <circle cx="80" cy="55" r="6" fill="#0BA5A4" opacity="0.3" />
    <circle cx="270" cy="190" r="9" fill="#2563EB" opacity="0.2" />
    <circle cx="40" cy="160" r="4" fill="#119DD8" opacity="0.4" />

    {/* Pulse rings */}
    <circle cx="240" cy="90" r="38" fill="none" stroke="url(#heroGrad2)" strokeWidth="1.5" opacity="0.2" />
    <circle cx="240" cy="90" r="44" fill="none" stroke="url(#heroGrad2)" strokeWidth="1" opacity="0.1" />
  </svg>
);

/* ─── userData (preserved from original) ───────────────────────────── */
const userData = JSON.parse(localStorage.getItem("user"));

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const GuardianDashboard = () => {
  // ── States (business logic unchanged) ──
  const [adherence, setAdherence] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch (unchanged) ──
  const fetchDashboard = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const email = userData?.user?.email;
      const response = await API.get(`/guardian/reports-email/${email}`);
      setAdherence(response.data);
    } catch (error) {
      console.log("DASHBOARD ERROR =", error);
    }
  };

  // ── Initial load ──
  useEffect(() => {
    const loadData = async () => {
      await fetchDashboard();

      const userData = JSON.parse(localStorage.getItem("user"));
      const email = userData?.user?.email;

      if (email) {
        const response = await API.get(`/guardian/profile-email/${email}`);
        setProfile(response.data);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // ── Auto refresh ──
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboard();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ── Loading ──
  if (loading || !adherence) {
    return (
      <GuardianLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#0BA5A4] to-[#2563EB] flex items-center justify-center shadow-lg">
              <Eye className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">
              Loading Dashboard…
            </p>
          </div>
        </div>
      </GuardianLayout>
    );
  }

  // ── Insight logic (unchanged messages) ──
  let insightMessage = "";
  let insightStyle = "";

  if (adherence?.risk_level === "LOW") {
    insightMessage =
      "Excellent medication adherence observed. The patient is consistently following the prescribed treatment plan and maintaining healthy medication habits.";
    insightStyle = "bg-emerald-50 border-emerald-400 text-emerald-800";
  } else if (adherence?.risk_level === "MEDIUM") {
    insightMessage =
      "Moderate adherence detected. A few medications have been missed. Continued monitoring and timely medication intake are recommended to improve treatment effectiveness.";
    insightStyle = "bg-amber-50 border-amber-400 text-amber-800";
  } else if (adherence?.risk_level === "HIGH") {
    insightMessage =
      "Poor medication adherence detected. Multiple missed medications may impact treatment outcomes. Immediate attention and follow-up are recommended.";
    insightStyle = "bg-red-50 border-red-400 text-red-800";
  } else {
    insightMessage =
      "Patient monitoring is currently in progress. Medication adherence data is being collected and analyzed to establish baseline treatment patterns. A comprehensive risk assessment and adherence insights will be generated once sufficient medication history becomes available.";
    insightStyle = "bg-sky-50 border-sky-300 text-sky-800";
  }

  const riskConfig = {
    MONITORING: {
      color: "text-sky-600",
      bg: "bg-sky-100",
      border: "border-sky-200",
      dot: "#0ea5e9",
      badge: "bg-sky-100 text-sky-700",
    },
    LOW: {
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
      dot: "#10b981",
      badge: "bg-emerald-100 text-emerald-700",
    },
    MEDIUM: {
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-200",
      dot: "#f59e0b",
      badge: "bg-amber-100 text-amber-700",
    },
    HIGH: {
      color: "text-red-600",
      bg: "bg-red-100",
      border: "border-red-200",
      dot: "#ef4444",
      badge: "bg-red-100 text-red-700",
    },
  };
  const risk = riskConfig[adherence?.risk_level] || riskConfig.MONITORING;
  const riskLabel =
    adherence?.risk_level === "MONITORING" ? "MONITORING" : adherence?.risk_level;

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // ── Motion variants ──
  const page = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.07 },
    },
  };
  const up = {
    initial: { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const float = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  /* KPI card data */
  const kpis = [
    {
      label: "Adherence Rate",
      value: adherence.adherence_percentage,
      suffix: "%",
      icon: <Activity className="w-5 h-5" />,
      from: "#0BA5A4",
      to: "#119DD8",
      sub: "Overall for monitoring period",
      trend: "+2.4%",
    },
    {
      label: "Medicines Taken",
      value: adherence.taken_medicines,
      suffix: "",
      icon: <CheckCircle2 className="w-5 h-5" />,
      from: "#10b981",
      to: "#06b6d4",
      sub: "Recorded as taken",
      trend: "On track",
    },
    {
      label: "Medicines Missed",
      value: adherence.missed_medicines,
      suffix: "",
      icon: <AlertCircle className="w-5 h-5" />,
      from: "#f43f5e",
      to: "#fb923c",
      sub: "Recorded as missed",
      trend: adherence.missed_medicines > 0 ? "Needs attention" : "None",
    },
    {
      label: "Risk Level",
      value: riskLabel,
      suffix: "",
      isText: true,
      icon: <ShieldAlert className="w-5 h-5" />,
      from: "#f59e0b",
      to: "#ef4444",
      sub: "AI-assessed risk score",
      trend: "Auto-updated",
    },
  ];

  /* ── Render ── */
  return (
    <GuardianLayout>
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
            {/* Ambient gradient blobs */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#0BA5A4] opacity-[0.07] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#2563EB] opacity-[0.07] blur-3xl pointer-events-none" />
            <div className="absolute top-10 right-1/3 w-48 h-48 rounded-full bg-[#119DD8] opacity-[0.05] blur-2xl pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-0">
              {/* Left */}
              <div className="p-8 lg:p-10 flex flex-col justify-between gap-6">
                <div>
                  {/* breadcrumb chip */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-5">
                    <PulseDot color="#0BA5A4" />
                    Patient Monitoring
                  </div>

                  <h1 className="text-[2.6rem] lg:text-[3rem] font-black leading-[1.1] tracking-tight text-slate-900">
                    Guardian{" "}
                    <span
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)",
                      }}
                    >
                      Dashboard
                    </span>
                  </h1>

                  <p className="mt-3 text-slate-500 font-medium text-lg">
                    Welcome back,{" "}
                    <span className="text-slate-800 font-bold">
                      {profile?.guardian_name ||
                        userData?.name ||
                        "Guardian"}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{currentDate}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${risk.badge}`}>
                      <PulseDot color={risk.dot} />
                      {riskLabel}
                    </span>
                  </div>

                  {/* Patient reference */}
                  {profile && (
                    <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Monitoring
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {profile?.patient_name || "—"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-6 py-2.5 rounded-2xl text-white text-sm font-semibold shadow-lg shadow-[#119DD8]/25 hover:shadow-xl hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)",
                    }}
                  >
                    View Patient
                  </button>
                  <button className="px-6 py-2.5 rounded-2xl text-slate-700 text-sm font-semibold border border-slate-200 bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200">
                    Download Report
                  </button>
                </div>
              </div>

              {/* Right — illustration */}
              <motion.div
                {...float}
                className="hidden lg:flex items-center justify-center p-6 lg:p-8 border-l border-white/40"
              >
                <div className="w-full max-w-[320px]">
                  <MonitoringIllustration />
                </div>
              </motion.div>
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
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 cursor-default"
            >
              {/* Gradient top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[28px]"
                style={{
                  background: `linear-gradient(90deg,${kpi.from},${kpi.to})`,
                }}
              />

              {/* Ambient glow */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-[0.08]"
                style={{
                  background: `radial-gradient(circle,${kpi.from},${kpi.to})`,
                }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md mb-4"
                  style={{
                    background: `linear-gradient(135deg,${kpi.from},${kpi.to})`,
                  }}
                >
                  {kpi.icon}
                </div>

                {/* Label */}
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                  {kpi.label}
                </p>

                {/* Value */}
                <div className="text-4xl font-black text-slate-900 leading-none mb-2">
                  {kpi.isText ? (
                    <span className={risk.color}>{kpi.value}</span>
                  ) : (
                    <CountUp to={kpi.value} suffix={kpi.suffix} />
                  )}
                </div>

                {/* Sub + trend */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-slate-400">{kpi.sub}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {kpi.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ══ CHARTS ════════════════════════════════════════════════════ */}
        <motion.section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[
            {
              icon: <PieChart className="w-5 h-5 text-[#0BA5A4]" />,
              sub: "Medicine Status Analytics",
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
              icon: <BarChart2 className="w-5 h-5 text-[#119DD8]" />,
              sub: "Analytics",
              title: "Weekly Trend",
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
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#0BA5A4]/10 to-[#2563EB]/10">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    {c.sub}
                  </p>
                  <h3 className="text-base font-bold text-slate-800">
                    {c.title}
                  </h3>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-slate-50/60 to-white/60 border border-slate-100 p-3">
                {c.chart}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Weekly trend full width */}
        <motion.section variants={up} className="mb-8">
          <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#0BA5A4]/10 to-[#2563EB]/10">
                <BarChart2 className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Trend Analysis
                </p>
                <h3 className="text-base font-bold text-slate-800">
                  Weekly Adherence Trend
                </h3>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-slate-50/60 to-white/60 border border-slate-100 p-4">
              <WeeklyTrendChart />
            </div>
          </div>
        </motion.section>

        {/* ══ AI INSIGHT ════════════════════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div className="rounded-[28px] overflow-hidden border border-white/60 shadow-[0_8px_32px_rgba(37,99,235,0.10)] relative">
            {/* Gradient header strip */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{
                background:
                  "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)",
              }}
            />

            <div className="bg-white/85 backdrop-blur-xl p-6 h-full flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)",
                    }}
                  >
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      AI Health Assistant
                    </p>
                    <h3 className="text-base font-bold text-slate-800">
                      Clinical Insight
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/15 text-xs font-semibold text-[#119DD8]">
                  <Sparkles className="w-3 h-3" />
                  AI Powered
                </div>
              </div>

              {/* Insight bubble */}
              <div
                className={`flex-1 p-5 rounded-2xl border-2 ${insightStyle} text-sm leading-relaxed font-medium`}
              >
                <p>{insightMessage}</p>
              </div>

              {/* Clinical recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#0BA5A4]" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Clinical Action
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {adherence.missed_medicines > 3
                      ? "Schedule follow-up with patient immediately"
                      : adherence.risk_level === "HIGH"
                      ? "Contact patient for medication support"
                      : "Continue routine monitoring"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-4 h-4 text-[#2563EB]" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Priority Status
                    </p>
                  </div>
                  <p
                    className={`text-sm font-bold ${
                      adherence.missed_medicines > 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {adherence.risk_level === "HIGH"
                      ? "Urgent Attention"
                      : adherence.risk_level === "MEDIUM"
                      ? "Monitor Closely"
                      : "Stable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </GuardianLayout>
  );
};

export default GuardianDashboard;