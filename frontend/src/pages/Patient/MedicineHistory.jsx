import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, CheckCircle2, AlertCircle, Clock3, Calendar, Activity } from "lucide-react";

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

/* ─── Status config ─────────────────────────────────────────────────── */
const statusConfig = {
  taken:   { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2, color: "#10b981" },
  missed:  { bg: "bg-red-50",      text: "text-red-700",     border: "border-red-200",     icon: AlertCircle, color: "#ef4444" },
  pending: { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200",   icon: Clock3,     color: "#f59e0b" },
};

const getStatus = (status) => statusConfig[status?.toLowerCase()] || statusConfig.pending;

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const MedicineHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const patientId = loggedInUser?.id;

  // ── Fetch (unchanged) ──
  const fetchHistory = async () => {
    try {
      if (!patientId) { console.log("Patient ID not found"); return; }
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user.email;
      const response = await API.get(`/adherence/patient-email/${email}`);
      setHistory(response.data.history);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // ── Stats ──
  const taken = history.filter((h) => h.status?.toLowerCase() === "taken").length;
  const missed = history.filter((h) => h.status?.toLowerCase() === "missed").length;
  const pending = history.filter((h) => !["taken", "missed"].includes(h.status?.toLowerCase())).length;
  const total = history.length;

  // ── Loading ──
  if (loading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
            >
              <History className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading history…</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

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

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-4">
                  <History className="w-3.5 h-3.5" />
                  Complete Records
                </div>

                <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                  Medicine{" "}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                  >
                    History
                  </span>
                </h1>
                <p className="mt-2 text-slate-500 font-medium">Complete adherence history and medication records</p>
              </div>

              {/* Summary chips */}
              {total > 0 && (
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  {[
                    { label: "Taken",   val: taken,   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
                    { label: "Missed",  val: missed,  bg: "bg-red-50",     text: "text-red-700",     border: "border-red-100"     },
                    { label: "Pending", val: pending, bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-100"   },
                  ].map((s) => (
                    <div key={s.label} className={`flex items-center gap-2 px-3 py-2 rounded-2xl ${s.bg} border ${s.border}`}>
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
        <AnimatePresence>
          {history.length === 0 && (
            <motion.div
              variants={up}
              className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-16 text-center"
            >
              <div
                className="w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#dbeafe,#bfdbfe)" }}
              >
                <History className="w-10 h-10 text-sky-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">No History Available</h2>
              <p className="mt-2 text-slate-400 font-medium">Your medicine history will appear here once you start taking medicines.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ HISTORY TABLE ═════════════════════════════════════════════ */}
        {history.length > 0 && (
          <motion.section variants={up} className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-50/50 border-b border-slate-100">
                    {[
                      { label: "Medicine",   icon: <Activity className="w-4 h-4" />, key: "medicine" },
                      { label: "Time",       icon: <Clock3   className="w-4 h-4" />, key: "time"     },
                      { label: "Status",     icon: null,                             key: "status"   },
                      { label: "Date",       icon: <Calendar className="w-4 h-4" />, key: "date"     },
                    ].map((col) => (
                      <th
                        key={col.key}
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
                  {history.map((item, i) => {
                    const s = getStatus(item.status);
                    const StatusIcon = s.icon;

                    return (
                      <tr
                        key={i}
                        className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors duration-150 group"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
                            >
                              <Activity className="w-3 h-3 text-white" />
                            </div>
                            {item.medicine_name}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">
                          {item.scheduled_time}
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.bg} ${s.text} border ${s.border}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {item.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">
                          {item.date}
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
                Total Records: <span className="text-slate-600 font-bold">{total}</span>
              </p>
            </div>
          </motion.section>
        )}

      </motion.div>
    </PatientLayout>
  );
};

export default MedicineHistory;