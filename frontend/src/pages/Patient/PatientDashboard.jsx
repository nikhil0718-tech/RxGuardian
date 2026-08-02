
// import React, { useEffect, useState, useRef } from "react";
// import { motion, useMotionValue, useSpring, animate } from "framer-motion";
// import {
//   Activity, CheckCircle2, AlertCircle, ShieldAlert, Brain,
//   BarChart2, PieChart, Calendar, Heart, TrendingUp, Zap, ArrowUpRight, Sparkles
// } from "lucide-react";

// import PatientLayout from "../../layouts/PatientLayout";

// import AdherencePieChart from "../../components/charts/AdherencePieChart";
// import AdherenceBarChart from "../../components/charts/AdherenceBarChart";
// import WeeklyTrendChart from "../../components/charts/WeeklyTrendChart";
// import API from "../../api/api";

// /* ─── Animated counter ──────────────────────────────────────────────── */
// function CountUp({ to, suffix = "", duration = 1.2 }) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     const controls = animate(0, to, {
//       duration,
//       onUpdate: (v) => setVal(Math.round(v)),
//     });
//     return controls.stop;
//   }, [to]);
//   return <>{val}{suffix}</>;
// }

// /* ─── Pulse dot ─────────────────────────────────────────────────────── */
// function PulseDot({ color = "#0BA5A4" }) {
//   return (
//     <span className="relative flex h-2.5 w-2.5">
//       <span
//         className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
//         style={{ backgroundColor: color }}
//       />
//       <span
//         className="relative inline-flex rounded-full h-2.5 w-2.5"
//         style={{ backgroundColor: color }}
//       />
//     </span>
//   );
// }

// /* ─── Healthcare SVG Illustrations ──────────────────────────────────── */
// const MedicineIllustration = () => (
//   <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
//     <defs>
//       <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
//         <stop offset="0%" stopColor="#0BA5A4" />
//         <stop offset="50%" stopColor="#119DD8" />
//         <stop offset="100%" stopColor="#2563EB" />
//       </linearGradient>
//       <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
//         <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
//         <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.9" />
//       </linearGradient>
//       <filter id="softShadow">
//         <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#2563EB" floodOpacity="0.15" />
//       </filter>
//     </defs>

//     {/* Background blobs */}
//     <ellipse cx="260" cy="60" rx="80" ry="60" fill="url(#heroGrad)" opacity="0.07" />
//     <ellipse cx="60" cy="200" rx="70" ry="50" fill="url(#heroGrad)" opacity="0.05" />

//     {/* Main phone mockup */}
//     <rect x="110" y="20" width="100" height="180" rx="18" fill="url(#cardGrad)" filter="url(#softShadow)" />
//     <rect x="118" y="32" width="84" height="120" rx="10" fill="url(#heroGrad)" opacity="0.08" />

//     {/* Chart lines inside phone */}
//     <polyline points="124,120 140,100 155,110 170,85 185,95 196,75" stroke="url(#heroGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
//     <circle cx="196" cy="75" r="4" fill="#2563EB" />

//     {/* Pill capsule */}
//     <rect x="40" y="90" width="56" height="24" rx="12" fill="url(#heroGrad)" opacity="0.9" />
//     <rect x="40" y="90" width="28" height="24" rx="12" fill="#0BA5A4" opacity="0.95" />

//     {/* Check badge */}
//     <circle cx="248" cy="140" r="28" fill="#10b981" opacity="0.12" />
//     <circle cx="248" cy="140" r="20" fill="#10b981" opacity="0.2" />
//     <path d="M238 140 l7 7 l14-14" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

//     {/* Floating dots */}
//     <circle cx="80" cy="55" r="6" fill="#0BA5A4" opacity="0.3" />
//     <circle cx="270" cy="190" r="9" fill="#2563EB" opacity="0.2" />
//     <circle cx="40" cy="160" r="4" fill="#119DD8" opacity="0.4" />

//     {/* Heartbeat line */}
//     <polyline points="155,210 170,210 178,195 186,225 194,200 202,210 220,210" stroke="url(#heroGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
//   </svg>
// );

// /* ─── userData (preserved from original) ───────────────────────────── */
// const userData = JSON.parse(localStorage.getItem("user"));

// /* ══════════════════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════ */
// const PatientDashboard = () => {
//   const patientId = JSON.parse(localStorage.getItem("user"))?.id;

//   // ── States (unchanged) ──
//   const [adherence, setAdherence] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ── Fetch (unchanged) ──
//   const fetchDashboard = async () => {
//     if (!patientId) { setLoading(false); return; }
//     try {
//       const response = await API.get(`/adherence/patient/${patientId}`);
//       setAdherence(response.data);
//     } catch (error) {
//       console.log("DASHBOARD ERROR =", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchDashboard(); }, []);
//   useEffect(() => {
//     const interval = setInterval(fetchDashboard, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // ── Loading ──
//   if (loading || !adherence) {
//     return (
//       <PatientLayout>
//         <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
//           <div className="text-center">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#0BA5A4] to-[#2563EB] flex items-center justify-center shadow-lg">
//               <Heart className="w-8 h-8 text-white animate-pulse" />
//             </div>
//             <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Dashboard…</p>
//           </div>
//         </div>
//       </PatientLayout>
//     );
//   }

//   // ── Insight logic (unchanged) ──
//   let insightMessage = "";
//   let insightStyle = "";
//   if (adherence?.risk_level === "LOW") {
//     insightMessage = "Excellent medication adherence observed. The patient is consistently following the prescribed treatment plan and maintaining healthy medication habits.";
//     insightStyle = "bg-emerald-50 border-emerald-400 text-emerald-800";
//   } else if (adherence?.risk_level === "MEDIUM") {
//     insightMessage = "Moderate adherence detected. A few medications have been missed. Continued monitoring and timely medication intake are recommended to improve treatment effectiveness.";
//     insightStyle = "bg-amber-50 border-amber-400 text-amber-800";
//   } else if (adherence?.risk_level === "HIGH") {
//     insightMessage = "Poor medication adherence detected. Multiple missed medications may impact treatment outcomes. Immediate attention and follow-up are recommended.";
//     insightStyle = "bg-red-50 border-red-400 text-red-800";
//   } else {
//     insightMessage = "Patient monitoring is currently in progress. Medication adherence data is being collected and analyzed to establish baseline treatment patterns.";
//     insightStyle = "bg-sky-50 border-sky-300 text-sky-800";
//   }

//   const riskConfig = {
//     MONITORING: { color: "text-sky-600", bg: "bg-sky-100", border: "border-sky-200", dot: "#0ea5e9", badge: "bg-sky-100 text-sky-700" },
//     LOW:        { color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200", dot: "#10b981", badge: "bg-emerald-100 text-emerald-700" },
//     MEDIUM:     { color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200", dot: "#f59e0b", badge: "bg-amber-100 text-amber-700" },
//     HIGH:       { color: "text-red-600", bg: "bg-red-100", border: "border-red-200", dot: "#ef4444", badge: "bg-red-100 text-red-700" },
//   };
//   const risk = riskConfig[adherence?.risk_level] || riskConfig.MONITORING;
//   const riskLabel = adherence?.risk_level === "MONITORING" ? "MONITORING" : adherence?.risk_level;

//   const currentDate = new Date().toLocaleDateString(undefined, {
//     weekday: "long", month: "long", day: "numeric", year: "numeric"
//   });

//   // ── Motion variants ──
//   const page = {
//     initial: { opacity: 0 },
//     animate: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.07 } }
//   };
//   const up = {
//     initial: { opacity: 0, y: 24 },
//     animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
//   };
//   const float = {
//     animate: { y: [0, -10, 0], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } }
//   };

//   /* KPI card data */
//   const kpis = [
//     {
//       label: "Adherence Rate",
//       value: adherence.adherence_percentage,
//       suffix: "%",
//       icon: <Activity className="w-5 h-5" />,
//       from: "#0BA5A4", to: "#119DD8",
//       sub: "Overall for monitoring period",
//       trend: "+2.4%"
//     },
//     {
//       label: "Medicines Taken",
//       value: adherence.taken_medicines,
//       suffix: "",
//       icon: <CheckCircle2 className="w-5 h-5" />,
//       from: "#10b981", to: "#06b6d4",
//       sub: "Recorded as taken",
//       trend: "On track"
//     },
//     {
//       label: "Medicines Missed",
//       value: adherence.missed_medicines,
//       suffix: "",
//       icon: <AlertCircle className="w-5 h-5" />,
//       from: "#f43f5e", to: "#fb923c",
//       sub: "Recorded as missed",
//       trend: adherence.missed_medicines > 0 ? "Needs attention" : "None"
//     },
//     {
//       label: "Risk Level",
//       value: riskLabel,
//       suffix: "",
//       isText: true,
//       icon: <ShieldAlert className="w-5 h-5" />,
//       from: "#f59e0b", to: "#ef4444",
//       sub: "AI-assessed risk score",
//       trend: "Auto-updated"
//     },
//   ];

//   /* ── Render ── */
//   return (
//     <PatientLayout>
//       <motion.div
//         initial="initial"
//         animate="animate"
//         variants={page}
//         className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 font-[system-ui]"
//         style={{ fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif" }}
//       >

//         {/* ══ HERO ══════════════════════════════════════════════════════ */}
//         <motion.section variants={up} className="mb-8">
//           <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-[0_24px_64px_rgba(37,99,235,0.10)] bg-white/80 backdrop-blur-2xl">
//             {/* Ambient gradient blobs */}
//             <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#0BA5A4] opacity-[0.07] blur-3xl pointer-events-none" />
//             <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#2563EB] opacity-[0.07] blur-3xl pointer-events-none" />
//             <div className="absolute top-10 right-1/3 w-48 h-48 rounded-full bg-[#119DD8] opacity-[0.05] blur-2xl pointer-events-none" />

//             <div className="relative grid lg:grid-cols-2 gap-0">
//               {/* Left */}
//               <div className="p-8 lg:p-10 flex flex-col justify-between gap-6">
//                 <div>
//                   {/* breadcrumb chip */}
//                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-5">
//                     <PulseDot color="#0BA5A4" />
//                     Live Monitoring
//                   </div>

//                   <h1 className="text-[2.6rem] lg:text-[3rem] font-black leading-[1.1] tracking-tight text-slate-900">
//                     Patient{" "}
//                     <span
//                       className="text-transparent bg-clip-text"
//                       style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
//                     >
//                       Dashboard
//                     </span>
//                   </h1>

//                   <p className="mt-3 text-slate-500 font-medium text-lg">
//                     Welcome back,{" "}
//                     <span className="text-slate-800 font-bold">
//                       {userData?.first_name || userData?.name || "Patient"}
//                     </span>
//                   </p>

//                   <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
//                     <div className="flex items-center gap-1.5">
//                       <Calendar className="w-4 h-4" />
//                       <span>{currentDate}</span>
//                     </div>
//                     <span className="w-1 h-1 rounded-full bg-slate-300" />
//                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${risk.badge}`}>
//                       <PulseDot color={risk.dot} />
//                       {riskLabel}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-3">
//                   <button
//                     className="px-6 py-2.5 rounded-2xl text-white text-sm font-semibold shadow-lg shadow-[#119DD8]/25 hover:shadow-xl hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5"
//                     style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
//                   >
//                     View Medicines
//                   </button>
//                   <button className="px-6 py-2.5 rounded-2xl text-slate-700 text-sm font-semibold border border-slate-200 bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200">
//                     Export Report
//                   </button>
//                 </div>
//               </div>

//               {/* Right — illustration */}
//               <motion.div
//                 {...float}
//                 className="hidden lg:flex items-center justify-center p-6 lg:p-8 border-l border-white/40"
//               >
//                 <div className="w-full max-w-[320px]">
//                   <MedicineIllustration />
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </motion.section>

//         {/* ══ KPI CARDS ═════════════════════════════════════════════════ */}
//         <motion.section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
//           {kpis.map((kpi, i) => (
//             <motion.div
//               key={kpi.label}
//               variants={up}
//               whileHover={{ y: -6, scale: 1.02 }}
//               transition={{ type: "spring", stiffness: 300, damping: 20 }}
//               className="relative overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 cursor-default"
//             >
//               {/* Gradient top accent bar */}
//               <div
//                 className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[28px]"
//                 style={{ background: `linear-gradient(90deg,${kpi.from},${kpi.to})` }}
//               />

//               {/* Ambient glow */}
//               <div
//                 className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-[0.08]"
//                 style={{ background: `radial-gradient(circle,${kpi.from},${kpi.to})` }}
//               />

//               <div className="relative">
//                 {/* Icon */}
//                 <div
//                   className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md mb-4"
//                   style={{ background: `linear-gradient(135deg,${kpi.from},${kpi.to})` }}
//                 >
//                   {kpi.icon}
//                 </div>

//                 {/* Label */}
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>

//                 {/* Value */}
//                 <div className="text-4xl font-black text-slate-900 leading-none mb-2">
//                   {kpi.isText ? (
//                     <span className={risk.color}>{kpi.value}</span>
//                   ) : (
//                     <CountUp to={kpi.value} suffix={kpi.suffix} />
//                   )}
//                 </div>

//                 {/* Sub + trend */}
//                 <div className="flex items-center justify-between mt-3">
//                   <p className="text-xs text-slate-400">{kpi.sub}</p>
//                   <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
//                     <TrendingUp className="w-3 h-3" />
//                     {kpi.trend}
//                   </span>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.section>

//         {/* ══ CHARTS ════════════════════════════════════════════════════ */}
//         <motion.section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {[
//             {
//               icon: <PieChart className="w-5 h-5 text-[#0BA5A4]" />,
//               sub: "Medicine Status Analytics",
//               title: "Adherence Summary",
//               chart: (
//                 <AdherencePieChart
//                   taken={adherence.taken_medicines}
//                   missed={adherence.missed_medicines}
//                   pending={adherence.pending_medicines}
//                 />
//               ),
//             },
//             {
//               icon: <BarChart2 className="w-5 h-5 text-[#119DD8]" />,
//               sub: "Analytics",
//               title: "Weekly Trend",
//               chart: (
//                 <AdherenceBarChart
//                   taken={adherence.taken_medicines}
//                   missed={adherence.missed_medicines}
//                   pending={adherence.pending_medicines}
//                 />
//               ),
//             },
//           ].map((c) => (
//             <motion.div
//               key={c.title}
//               variants={up}
//               className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6"
//             >
//               <div className="flex items-center gap-3 mb-5">
//                 <div className="p-2 rounded-xl bg-gradient-to-br from-[#0BA5A4]/10 to-[#2563EB]/10">
//                   {c.icon}
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{c.sub}</p>
//                   <h3 className="text-base font-bold text-slate-800">{c.title}</h3>
//                 </div>
//               </div>
//               <div className="rounded-2xl bg-gradient-to-br from-slate-50/60 to-white/60 border border-slate-100 p-3">
//                 {c.chart}
//               </div>
//             </motion.div>
//           ))}
//         </motion.section>

//         {/* Weekly trend full width */}
//         <motion.section variants={up} className="mb-8">
//           <div className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6">
//             <div className="flex items-center gap-3 mb-5">
//               <div className="p-2 rounded-xl bg-gradient-to-br from-[#0BA5A4]/10 to-[#2563EB]/10">
//                 <BarChart2 className="w-5 h-5 text-[#2563EB]" />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Trend Analysis</p>
//                 <h3 className="text-base font-bold text-slate-800">Weekly Adherence Trend</h3>
//               </div>
//             </div>
//             <div className="rounded-2xl bg-gradient-to-br from-slate-50/60 to-white/60 border border-slate-100 p-4">
//               <WeeklyTrendChart />
//             </div>
//           </div>
//         </motion.section>

//         {/* ══ AI INSIGHT ════════════════════════════════════════════════ */}
//         <motion.section variants={up} className="mb-8">

//           <div className="rounded-[28px] overflow-hidden border border-white/60 shadow-[0_8px_32px_rgba(37,99,235,0.10)] relative">
//             {/* Gradient header strip */}
//             <div
//               className="absolute top-0 left-0 right-0 h-1.5"
//               style={{ background: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
//             />

//             <div className="bg-white/85 backdrop-blur-xl p-6 h-full flex flex-col gap-5">
//               {/* Header */}
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
//                     style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
//                   >
//                     <Brain className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AI Health Assistant</p>
//                     <h3 className="text-base font-bold text-slate-800">Personalized Insight</h3>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/15 text-xs font-semibold text-[#119DD8]">
//                   <Sparkles className="w-3 h-3" />
//                   AI Powered
//                 </div>
//               </div>

//               {/* Insight bubble */}
//               <div className={`flex-1 p-5 rounded-2xl border-2 ${insightStyle} text-sm leading-relaxed font-medium`}>
//                 <p>{insightMessage}</p>
//               </div>

//               {/* Recommendations */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Zap className="w-4 h-4 text-[#0BA5A4]" />
//                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recommendation</p>
//                   </div>
//                   <p className="text-sm font-semibold text-slate-700">
//                     Schedule a follow-up with care team if risk is HIGH or missed medicines &gt; 3.
//                   </p>
//                 </div>

//                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
//                   <div className="flex items-center gap-2 mb-2">
//                     <ArrowUpRight className="w-4 h-4 text-[#2563EB]" />
//                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority Status</p>
//                   </div>
//                   <p className={`text-sm font-bold ${adherence.missed_medicines > 0 ? "text-red-600" : "text-emerald-600"}`}>
//                     {adherence.missed_medicines > 0 ? "Action Recommended" : "Stable & On Track"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.section>

//       </motion.div>
//     </PatientLayout>
//   );
// };

// export default PatientDashboard;
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
  Heart,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import PatientLayout from "../../layouts/PatientLayout";
import AdherencePieChart from "../../components/charts/AdherencePieChart";
import AdherenceBarChart from "../../components/charts/AdherenceBarChart";
import WeeklyTrendChart from "../../components/charts/WeeklyTrendChart";
import API from "../../api/api";
/* ─── RxGuardian Brand Palette ──────────────────────────────────────── */
const BRAND = {
  primary: "#2563EB",      // Deep Blue
  teal: "#0BA5A4",         // Healthcare Teal
  sky: "#119DD8",          // Sky Blue
  success: "#10B981",      // Emerald Green
  warning: "#F59E0B",      // Amber
  danger: "#EF4444",       // Red
  bg: "#F8FAFC",           // Light Slate
  surface: "#FFFFFF",
  ink: "#0F172A",          // Slate-900
  muted: "#64748B",        // Slate-500
  gradient: "linear-gradient(135deg,#0BA5A4 0%,#119DD8 50%,#2563EB 100%)",
  gradientSoft: "linear-gradient(135deg, rgba(11,165,164,0.10), rgba(37,99,235,0.10))",
};
/* ─── Animated Counter ──────────────────────────────────────────────── */
function CountUp({ to, suffix = "", duration = 1.2 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [to, duration]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}
/* ─── Pulse Dot ─────────────────────────────────────────────────────── */
function PulseDot({ color = BRAND.teal }) {
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
/* ─── Healthcare SVG Illustration ───────────────────────────────────── */
const MedicineIllustration = () => (
  <svg
    viewBox="0 0 320 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={BRAND.teal} />
        <stop offset="50%" stopColor={BRAND.sky} />
        <stop offset="100%" stopColor={BRAND.primary} />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.9" />
      </linearGradient>
      <filter id="softShadow">
        <feDropShadow
          dx="0"
          dy="8"
          stdDeviation="12"
          floodColor={BRAND.primary}
          floodOpacity="0.15"
        />
      </filter>
    </defs>
    {/* Ambient blobs */}
    <ellipse cx="260" cy="60" rx="80" ry="60" fill="url(#heroGrad)" opacity="0.07" />
    <ellipse cx="60" cy="200" rx="70" ry="50" fill="url(#heroGrad)" opacity="0.05" />
    {/* Phone mockup */}
    <rect
      x="110"
      y="20"
      width="100"
      height="180"
      rx="18"
      fill="url(#cardGrad)"
      filter="url(#softShadow)"
    />
    <rect x="118" y="32" width="84" height="120" rx="10" fill="url(#heroGrad)" opacity="0.08" />
    {/* Chart inside phone */}
    <polyline
      points="124,120 140,100 155,110 170,85 185,95 196,75"
      stroke="url(#heroGrad)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="196" cy="75" r="4" fill={BRAND.primary} />
    {/* Pill */}
    <rect x="40" y="90" width="56" height="24" rx="12" fill="url(#heroGrad)" opacity="0.9" />
    <rect x="40" y="90" width="28" height="24" rx="12" fill={BRAND.teal} opacity="0.95" />
    {/* Check badge */}
    <circle cx="248" cy="140" r="28" fill={BRAND.success} opacity="0.12" />
    <circle cx="248" cy="140" r="20" fill={BRAND.success} opacity="0.2" />
    <path
      d="M238 140 l7 7 l14-14"
      stroke={BRAND.success}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Floating dots */}
    <circle cx="80" cy="55" r="6" fill={BRAND.teal} opacity="0.3" />
    <circle cx="270" cy="190" r="9" fill={BRAND.primary} opacity="0.2" />
    <circle cx="40" cy="160" r="4" fill={BRAND.sky} opacity="0.4" />
    {/* Heartbeat line */}
    <polyline
      points="155,210 170,210 178,195 186,225 194,200 202,210 220,210"
      stroke="url(#heroGrad)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
/* ─── Preserve user data ────────────────────────────────────────────── */
const userData = JSON.parse(localStorage.getItem("user"));
/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
const PatientDashboard = () => {
  const patientId = JSON.parse(localStorage.getItem("user"))?.id;
  const [adherence, setAdherence] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchDashboard = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    try {
      const response = await API.get(`/adherence/patient/${patientId}`);
      setAdherence(response.data);
    } catch (error) {
      console.log("DASHBOARD ERROR =", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);
  useEffect(() => {
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);
  /* ── Loading State ── */
  if (loading || !adherence) {
    return (
      <PatientLayout>
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: BRAND.bg }}
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: BRAND.gradient }}
            >
              <Heart className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p
              className="font-semibold tracking-wide text-sm uppercase"
              style={{ color: BRAND.muted, fontFamily: "'Inter', sans-serif" }}
            >
              Loading Dashboard…
            </p>
          </div>
        </div>
      </PatientLayout>
    );
  }
  /* ── Insight Logic ── */
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
      "Patient monitoring is currently in progress. Medication adherence data is being collected and analyzed to establish baseline treatment patterns.";
    insightStyle = "bg-sky-50 border-sky-300 text-sky-800";
  }
  const riskConfig = {
    MONITORING: {
      color: "text-sky-600",
      bg: "bg-sky-100",
      border: "border-sky-200",
      dot: "#0EA5E9",
      badge: "bg-sky-100 text-sky-700",
    },
    LOW: {
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
      dot: BRAND.success,
      badge: "bg-emerald-100 text-emerald-700",
    },
    MEDIUM: {
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-200",
      dot: BRAND.warning,
      badge: "bg-amber-100 text-amber-700",
    },
    HIGH: {
      color: "text-red-600",
      bg: "bg-red-100",
      border: "border-red-200",
      dot: BRAND.danger,
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
  /* ── Motion Variants ── */
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
  /* ── KPI Data ── */
  const kpis = [
    {
      label: "Adherence Rate",
      value: adherence.adherence_percentage,
      suffix: "%",
      icon: <Activity className="w-5 h-5" />,
      from: BRAND.teal,
      to: BRAND.sky,
      sub: "Overall for monitoring period",
      trend: "+2.4%",
    },
    {
      label: "Medicines Taken",
      value: adherence.taken_medicines,
      suffix: "",
      icon: <CheckCircle2 className="w-5 h-5" />,
      from: BRAND.success,
      to: BRAND.teal,
      sub: "Recorded as taken",
      trend: "On track",
    },
    {
      label: "Medicines Missed",
      value: adherence.missed_medicines,
      suffix: "",
      icon: <AlertCircle className="w-5 h-5" />,
      from: BRAND.danger,
      to: BRAND.warning,
      sub: "Recorded as missed",
      trend: adherence.missed_medicines > 0 ? "Needs attention" : "None",
    },
    {
      label: "Risk Level",
      value: riskLabel,
      suffix: "",
      isText: true,
      icon: <ShieldAlert className="w-5 h-5" />,
      from: BRAND.warning,
      to: BRAND.danger,
      sub: "AI-assessed risk score",
      trend: "Auto-updated",
    },
  ];
  /* ── Render ── */
  return (
    <PatientLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={page}
        className="min-h-screen p-6 lg:p-8"
        style={{
          backgroundColor: BRAND.bg,
          fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div
            className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 backdrop-blur-2xl"
            style={{ boxShadow: "0 24px 64px rgba(37,99,235,0.10)" }}
          >
            {/* Ambient blobs */}
            <div
              className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
              style={{ backgroundColor: BRAND.teal }}
            />
            <div
              className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
              style={{ backgroundColor: BRAND.primary }}
            />
            <div
              className="absolute top-10 right-1/3 w-48 h-48 rounded-full opacity-[0.05] blur-2xl pointer-events-none"
              style={{ backgroundColor: BRAND.sky }}
            />
            <div className="relative grid lg:grid-cols-2 gap-0">
              {/* Left */}
              <div className="p-8 lg:p-10 flex flex-col justify-between gap-6">
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest mb-5"
                    style={{
                      background: BRAND.gradientSoft,
                      borderColor: "rgba(17,157,216,0.20)",
                      color: BRAND.sky,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    <PulseDot color={BRAND.teal} />
                    Live Monitoring
                  </div>
                  <h1
                    className="text-[2.6rem] lg:text-[3rem] font-black leading-[1.1] tracking-tight"
                    style={{
                      color: BRAND.ink,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Patient{" "}
                    <span
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage: `linear-gradient(90deg,${BRAND.teal},${BRAND.sky},${BRAND.primary})`,
                      }}
                    >
                      Dashboard
                    </span>
                  </h1>
                  <p
                    className="mt-3 font-medium text-lg"
                    style={{ color: BRAND.muted }}
                  >
                    Welcome back,{" "}
                    <span
                      className="font-bold"
                      style={{ color: BRAND.ink }}
                    >
                      {userData?.first_name || userData?.name || "Patient"}
                    </span>
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm" style={{ color: "#94A3B8" }}>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{currentDate}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${risk.badge}`}
                    >
                      <PulseDot color={risk.dot} />
                      {riskLabel}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-6 py-2.5 rounded-2xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: BRAND.gradient,
                      boxShadow: "0 10px 24px rgba(17,157,216,0.30)",
                    }}
                  >
                    View Medicines
                  </button>
                  <button
                    className="px-6 py-2.5 rounded-2xl text-sm font-semibold border bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200"
                    style={{ color: BRAND.ink, borderColor: "#E2E8F0" }}
                  >
                    Export Report
                  </button>
                </div>
              </div>
              {/* Right — illustration */}
              <motion.div
                {...float}
                className="hidden lg:flex items-center justify-center p-6 lg:p-8 border-l border-white/40"
              >
                <div className="w-full max-w-[320px]">
                  <MedicineIllustration />
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
              className="relative overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 p-6 cursor-default"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}
            >
              {/* Top accent bar */}
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
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md mb-4"
                  style={{
                    background: `linear-gradient(135deg,${kpi.from},${kpi.to})`,
                  }}
                >
                  {kpi.icon}
                </div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "#94A3B8" }}
                >
                  {kpi.label}
                </p>
                <div
                  className="text-4xl font-black leading-none mb-2"
                  style={{
                    color: BRAND.ink,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {kpi.isText ? (
                    <span className={risk.color}>{kpi.value}</span>
                  ) : (
                    <CountUp to={kpi.value} suffix={kpi.suffix} />
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    {kpi.sub}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full"
                    style={{ color: BRAND.success }}
                  >
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
              icon: <PieChart className="w-5 h-5" style={{ color: BRAND.teal }} />,
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
              icon: <BarChart2 className="w-5 h-5" style={{ color: BRAND.sky }} />,
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
              className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 p-6"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="p-2 rounded-xl"
                  style={{ background: BRAND.gradientSoft }}
                >
                  {c.icon}
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#94A3B8" }}
                  >
                    {c.sub}
                  </p>
                  <h3
                    className="text-base font-bold"
                    style={{ color: BRAND.ink, fontFamily: "'Poppins', sans-serif" }}
                  >
                    {c.title}
                  </h3>
                </div>
              </div>
              <div
                className="rounded-2xl border p-3"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(248,250,252,0.6), rgba(255,255,255,0.6))",
                  borderColor: "#F1F5F9",
                }}
              >
                {c.chart}
              </div>
            </motion.div>
          ))}
        </motion.section>
        {/* ══ WEEKLY TREND FULL WIDTH ═══════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div
            className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 p-6"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2 rounded-xl"
                style={{ background: BRAND.gradientSoft }}
              >
                <BarChart2 className="w-5 h-5" style={{ color: BRAND.primary }} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#94A3B8" }}
                >
                  Trend Analysis
                </p>
                <h3
                  className="text-base font-bold"
                  style={{ color: BRAND.ink, fontFamily: "'Poppins', sans-serif" }}
                >
                  Weekly Adherence Trend
                </h3>
              </div>
            </div>
            <div
              className="rounded-2xl border p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(248,250,252,0.6), rgba(255,255,255,0.6))",
                borderColor: "#F1F5F9",
              }}
            >
              <WeeklyTrendChart />
            </div>
          </div>
        </motion.section>
        {/* ══ AI INSIGHT ════════════════════════════════════════════════ */}
        <motion.section variants={up} className="mb-8">
          <div
            className="rounded-[28px] overflow-hidden border border-white/60 relative"
            style={{ boxShadow: "0 8px 32px rgba(37,99,235,0.10)" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: BRAND.gradient }}
            />
            <div className="bg-white/85 backdrop-blur-xl p-6 h-full flex flex-col gap-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ background: BRAND.gradient }}
                  >
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#94A3B8" }}
                    >
                      AI Health Assistant
                    </p>
                    <h3
                      className="text-base font-bold"
                      style={{ color: BRAND.ink, fontFamily: "'Poppins', sans-serif" }}
                    >
                      Personalized Insight
                    </h3>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold"
                  style={{
                    background: BRAND.gradientSoft,
                    borderColor: "rgba(17,157,216,0.15)",
                    color: BRAND.sky,
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  AI Powered
                </div>
              </div>
              <div
                className={`flex-1 p-5 rounded-2xl border-2 ${insightStyle} text-sm leading-relaxed font-medium`}
              >
                <p>{insightMessage}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="p-4 rounded-2xl border"
                  style={{ backgroundColor: "#F8FAFC", borderColor: "#F1F5F9" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4" style={{ color: BRAND.teal }} />
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: BRAND.muted }}
                    >
                      Recommendation
                    </p>
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#334155" }}
                  >
                    Schedule a follow-up with care team if risk is HIGH or missed medicines &gt; 3.
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl border"
                  style={{ backgroundColor: "#F8FAFC", borderColor: "#F1F5F9" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-4 h-4" style={{ color: BRAND.primary }} />
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: BRAND.muted }}
                    >
                      Priority Status
                    </p>
                  </div>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color:
                        adherence.missed_medicines > 0
                          ? BRAND.danger
                          : BRAND.success,
                    }}
                  >
                    {adherence.missed_medicines > 0
                      ? "Action Recommended"
                      : "Stable & On Track"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </PatientLayout>
  );
};
export default PatientDashboard;