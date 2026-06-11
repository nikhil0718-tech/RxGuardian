import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Activity, CheckCircle2, AlertCircle, Clock3, TrendingUp } from "lucide-react";

import GuardianLayout from "../../layouts/GuardianLayout";
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
const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("user"));
  const email = userData?.user?.email;

  // ── Fetch (unchanged) ──
  const fetchReport = async () => {
    try {
      if (!email) { console.log("Email not found"); return; }
      const response = await API.get(`/guardian/reports-email/${email}`);
      setReport(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  // ── Loading ──
  if (loading || !report) {
    return (
      <GuardianLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
            >
              <FileText className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Reports…</p>
          </div>
        </div>
      </GuardianLayout>
    );
  }

  const cards = [
    {
      label: "Total Medicines",
      value: report.total_medicines,
      icon: <Activity className="w-5 h-5" />,
      from: "#0BA5A4",
      to: "#119DD8",
      sub: "Prescribed medicines",
    },
    {
      label: "Medicines Taken",
      value: report.taken_medicines,
      icon: <CheckCircle2 className="w-5 h-5" />,
      from: "#10b981",
      to: "#06b6d4",
      sub: "Successfully taken",
    },
    {
      label: "Medicines Missed",
      value: report.missed_medicines,
      icon: <AlertCircle className="w-5 h-5" />,
      from: "#ef4444",
      to: "#fb923c",
      sub: "Not taken",
    },
    {
      label: "Pending Medicines",
      value: report.pending_medicines,
      icon: <Clock3 className="w-5 h-5" />,
      from: "#f59e0b",
      to: "#f97316",
      sub: "Awaiting intake",
    },
    {
      label: "Adherence Rate",
      value: `${report.adherence_percentage}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      from: "#2563EB",
      to: "#0BA5A4",
      sub: "Overall compliance",
    },
  ];

  return (
    <GuardianLayout>
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
                <FileText className="w-3.5 h-3.5" />
                Adherence Summary
              </div>

              <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                Guardian{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                >
                  Reports
                </span>
              </h1>
              <p className="mt-2 text-slate-500 font-medium">Comprehensive patient adherence summary</p>
            </div>
          </div>
        </motion.section>

        {/* ══ REPORT CARDS ══════════════════════════════════════════════ */}
        <motion.section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
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
                <div className="text-4xl font-black text-slate-900 leading-none mb-2">{card.value}</div>

                {/* Sub */}
                <p className="text-xs text-slate-400">{card.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ══ DOWNLOAD SECTION ══════════════════════════════════════════ */}
        <motion.section variants={up}>
          <div className="rounded-[28px] bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">Download Complete Report</h3>
                <p className="text-sm text-emerald-700">
                  Generate and download a comprehensive PDF report of the patient's medication adherence history.
                </p>
              </div>
{/* http://127.0.0.1:8000 */}
              <a
                href={`https://api.rxguardian.xyz/guardian/download-report/${patientId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </GuardianLayout>
  );
};

export default Reports;