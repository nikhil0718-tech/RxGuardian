import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Shield, CheckCircle2, Zap } from "lucide-react";

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

/* ── Risk badge config ── */
const riskConfig = {
  high: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    accent: "from-red-500 to-rose-500",
    icon: AlertTriangle,
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    accent: "from-amber-500 to-orange-500",
    icon: Zap,
  },
  low: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    accent: "from-emerald-500 to-teal-500",
    icon: CheckCircle2,
  },
};

const getRiskConfig = (risk) => riskConfig[risk?.toLowerCase()] || riskConfig.medium;

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const GuardianAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("user"));
  const email = userData?.user?.email || userData?.email;

  // ── Fetch (unchanged) ──
  const fetchAlerts = async () => {
    try {
      if (!email) {
        console.log("Guardian email not found");
        return;
      }

      const response = await API.get(`/guardian/alerts-email/${email}`);
      setAlerts(response.data);
    } catch (error) {
      console.log("ALERT FETCH ERROR =", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Initial load ──
  useEffect(() => {
    fetchAlerts();
  }, []);

  // ── Auto refresh (unchanged) ──
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <GuardianLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#ef4444,#fb923c)" }}
            >
              <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Alerts…</p>
          </div>
        </div>
      </GuardianLayout>
    );
  }

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
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-[0_24px_64px_rgba(239,68,68,0.10)] bg-white/80 backdrop-blur-2xl p-8 lg:p-10">
            {/* Blobs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-red-500 opacity-[0.07] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-orange-500 opacity-[0.07] blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-100/40 to-orange-100/40 border border-red-200/60 text-xs font-semibold text-red-700 uppercase tracking-widest mb-4">
                <AlertTriangle className="w-3.5 h-3.5" />
                Alerts System
              </div>

              <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                Guardian{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg,#ef4444,#f97316,#fb923c)" }}
                >
                  Alerts
                </span>
              </h1>
              <p className="mt-2 text-slate-500 font-medium">Real-time patient medication adherence monitoring</p>
            </div>
          </div>
        </motion.section>

        {/* ══ EMPTY STATE ════════════════════════════════════════════════ */}
        {(!alerts || alerts.length === 0) && (
          <motion.div
            variants={up}
            className="rounded-[28px] bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-16 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </motion.div>

            <h2 className="text-3xl font-black text-emerald-900">No Active Alerts</h2>
            <p className="mt-3 text-emerald-700 font-medium text-lg">
              Patient adherence is currently stable and performing well
            </p>
            <p className="mt-2 text-emerald-600/70 text-sm">
              Continue monitoring for any future medication adherence changes
            </p>
          </motion.div>
        )}

        {/* ══ ALERTS GRID ═══════════════════════════════════════════════ */}
        {alerts && alerts.length > 0 && (
          <motion.section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {alerts.map((alert, index) => {
                const config = getRiskConfig(alert.risk_level);
                const RiskIcon = config.icon;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="relative overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-6"
                  >
                    {/* Top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[4px]"
                      style={{ background: `linear-gradient(90deg,${config.accent})` }}
                    />

                    {/* Ambient glow */}
                    <div
                      className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-[0.06]"
                      style={{
                        background: `linear-gradient(135deg,${config.accent})`,
                      }}
                    />

                    <div className="relative">
                      {/* Header with icon and risk */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg,${config.accent})`,
                          }}
                        >
                          <RiskIcon className="w-6 h-6" />
                        </div>

                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.text} ${config.bg} border ${config.border}`}>
                          <span className={`w-2 h-2 rounded-full ${config.text.replace("text-", "bg-")}`} />
                          {alert.risk_level}
                        </div>
                      </div>

                      {/* Alert message */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Medication Adherence Alert</h3>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {alert.alert_message}
                        </p>
                      </div>

                      {/* Timestamp */}
                      {alert.created_at && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 pt-3 border-t border-slate-100">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.section>
        )}

        {/* ══ ALERT INFO BANNER ═════════════════════════════════════════ */}
        {alerts && alerts.length > 0 && (
          <motion.section variants={up} className="mt-8">
            <div className="rounded-[28px] bg-gradient-to-r from-slate-50 to-slate-50/50 border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">System Notice</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {alerts.length} active {alerts.length === 1 ? "alert" : "alerts"} requiring attention. Review each alert and consider contacting the patient for medication adherence support.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

      </motion.div>
    </GuardianLayout>
  );
};

export default GuardianAlerts;