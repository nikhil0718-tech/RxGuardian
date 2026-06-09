import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Clock3, CheckCircle, AlertCircle, Bell, Sparkles, Activity } from "lucide-react";

import PatientLayout from "../../layouts/PatientLayout";
import API from "../../api/api";
import { startMedicineReminderEngine } from "../../utils/reminderEngine";
import { requestNotificationPermission } from "../../utils/notificationHelper";

/* ─── Pulse dot ─────────────────────────────────────────────────────── */
function PulseDot({ color = "#0BA5A4" }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: color }} />
    </span>
  );
}

/* ─── Status config ─────────────────────────────────────────────────── */
const statusConfig = {
  taken:   { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200", dot: "#10b981", label: "Taken"   },
  missed:  { bg: "bg-red-50",      text: "text-red-700",     border: "border-red-200",     dot: "#ef4444", label: "Missed"  },
  pending: { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200",   dot: "#f59e0b", label: "Pending" },
};

const getStatus = (status) => statusConfig[status?.toLowerCase()] || statusConfig.pending;

const formatName = (name) => name?.replaceAll("_", " ") || "Medicine";

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const TodayMedicines = () => {
  const navigate = useNavigate();

  // ── States (unchanged) ──
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [engineStarted, setEngineStarted] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const email = loggedInUser?.email;

  // ── Fetch (unchanged) ──
  const fetchMedicines = async () => {
    try {
      if (!email) return;
      const response = await API.get(`/reminders/patient-email/${email}`);
      setMedicines(response.data);
    } catch (error) {
      console.log("FETCH ERROR =", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); requestNotificationPermission(); }, []);
  useEffect(() => {
    const interval = setInterval(fetchMedicines, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (medicines.length > 0) {
      startMedicineReminderEngine(medicines);
      if (!engineStarted) setEngineStarted(true);
    }
  }, [medicines]);

  // ── Test notification (unchanged) ──
  const testNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("RxGuardian Reminder", {
        body: "Medicine reminder system active",
        icon: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",
      });
    } else {
      alert("Please enable browser notifications");
    }
  };

  // ── Stats ──
  const taken   = medicines.filter((m) => m.status?.toLowerCase() === "taken").length;
  const missed  = medicines.filter((m) => m.status?.toLowerCase() === "missed").length;
  const pending = medicines.filter((m) => !["taken","missed"].includes(m.status?.toLowerCase())).length;
  const total   = medicines.length;
  const pct     = total ? Math.round((taken / total) * 100) : 0;

  // ── Motion variants ──
  const page = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.07 } },
  };
  const up = {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };
  const cardAnim = {
    initial: { opacity: 0, y: 28, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  // ── Loading ──
  if (loading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}>
              <Pill className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading medicines…</p>
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
            {/* Ambient blobs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#0BA5A4] opacity-[0.07] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#2563EB] opacity-[0.07] blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                {/* Live chip */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0BA5A4]/10 to-[#2563EB]/10 border border-[#119DD8]/20 text-xs font-semibold text-[#119DD8] uppercase tracking-widest mb-4">
                  <PulseDot color="#0BA5A4" />
                  Auto-refreshing every 5s
                </div>

                <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                  Today's{" "}
                  <span className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}>
                    Medicines
                  </span>
                </h1>
                <p className="mt-2 text-slate-500 font-medium">
                  Smart AI medicine adherence monitoring
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Progress pill */}
                {total > 0 && (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Activity className="w-4 h-4 text-[#0BA5A4]" />
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Today's Progress</p>
                      <p className="text-base font-black text-slate-900">{pct}% <span className="text-slate-400 font-medium text-xs">({taken}/{total})</span></p>
                    </div>
                  </div>
                )}

                <button
                  onClick={testNotification}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg shadow-[#119DD8]/20 hover:shadow-xl hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
                >
                  <Bell className="w-4 h-4" />
                  Test Alert
                </button>
              </div>
            </div>

            {/* Stats row */}
            {total > 0 && (
              <div className="relative mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
                {[
                  { label: "Taken",   val: taken,   color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-100" },
                  { label: "Missed",  val: missed,  color: "text-red-600",     bg: "bg-red-50",      border: "border-red-100"     },
                  { label: "Pending", val: pending, color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-100"   },
                ].map((s) => (
                  <div key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${s.bg} border ${s.border}`}>
                    <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* ══ EMPTY STATE ═══════════════════════════════════════════════ */}
        <AnimatePresence>
          {medicines.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-16 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}>
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">No Medicines Scheduled</h2>
              <p className="mt-2 text-slate-400 font-medium">Your medicine schedule for today is empty.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ MEDICINE CARDS ════════════════════════════════════════════ */}
        <motion.div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {medicines.map((medicine, i) => {
            const s = getStatus(medicine.status);
            const isTaken = medicine.status?.toLowerCase() === "taken";

            return (
              <motion.div
                key={medicine.id}
                variants={cardAnim}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6 flex flex-col gap-5"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: isTaken
                    ? "linear-gradient(90deg,#10b981,#06b6d4)"
                    : "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }} />

                {/* Background pill watermark */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.06] pointer-events-none">
                  <Pill className="w-36 h-36 text-slate-900 rotate-[20deg]" />
                </div>

                {/* Card header */}
                <div className="relative flex items-start justify-between gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                    style={{ background: isTaken
                      ? "linear-gradient(135deg,#10b981,#06b6d4)"
                      : "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
                  >
                    <Pill className="w-5 h-5" />
                  </div>

                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                    <PulseDot color={s.dot} />
                    {s.label}
                  </span>
                </div>

                {/* Medicine name */}
                <div className="relative">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Medicine</p>
                  <h2 className="text-xl font-black text-slate-900 leading-tight capitalize">
                    {formatName(medicine.medicine_name)}
                  </h2>
                </div>

                {/* Time */}
                <div className="relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}>
                    <Clock3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Scheduled Time</p>
                    <p className="text-base font-black text-slate-800">{medicine.scheduled_time}</p>
                  </div>
                </div>

                {/* Action button */}
                <div className="relative mt-auto">
                  {!isTaken ? (
                    <button
                      onClick={() => navigate(`/patient/upload-medicine?reminder_id=${medicine.id}`)}
                      className="w-full py-3 rounded-2xl text-white text-sm font-bold shadow-lg shadow-[#119DD8]/20 hover:shadow-xl hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Take Medicine
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed shadow-md"
                      style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Medicine Taken
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </motion.div>
    </PatientLayout>
  );
};

export default TodayMedicines;