import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Download, User, Calendar, Pill,
  Clock3, Activity, ChevronDown, ChevronUp, Stethoscope
} from "lucide-react";

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

/* ─── Table column config ───────────────────────────────────────────── */
const COLS = [
  { key: "medicine_name", label: "Medicine",     bold: true  },
  { key: "dosage",        label: "Dosage",       bold: false },
  { key: "frequency",     label: "Frequency",    bold: false },
  { key: "duration",      label: "Duration",     bold: false },
  { key: "timing",        label: "Timing",       bold: false },
  { key: "scheduled_time",label: "Reminder Time",bold: true, accent: true },
];

/* ─── Single prescription card ──────────────────────────────────────── */
function PrescriptionCard({ session, index }) {
  const [open, setOpen] = useState(true);

  const date = new Date(session.created_at).toLocaleDateString(undefined, {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <motion.div
      variants={up}
      className="rounded-[28px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
    >
      {/* ── Card header ── */}
      <div
        className="relative overflow-hidden p-6 lg:p-8"
        style={{ background: "linear-gradient(135deg,#0BA5A4 0%,#119DD8 50%,#2563EB 100%)" }}
      >
        {/* Watermark */}
        <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
          <FileText className="w-40 h-40 text-white" />
        </div>

        {/* Index chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white/90 text-[10px] font-bold uppercase tracking-widest mb-4">
          <Activity className="w-3 h-3" />
          Prescription #{index + 1}
        </div>

        <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight capitalize">
          {session.disease}
        </h2>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl">
            <Stethoscope className="w-4 h-4 text-white/80" />
            <span className="text-white/90 text-sm font-semibold">{session.doctor_name}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl">
            <Calendar className="w-4 h-4 text-white/80" />
            <span className="text-white/90 text-sm font-semibold">{date}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl">
            <Pill className="w-4 h-4 text-white/80" />
            <span className="text-white/90 text-sm font-semibold">
              {session.medicines.length} Medicine{session.medicines.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
        >
          {open
            ? <ChevronUp className="w-4 h-4 text-white" />
            : <ChevronDown className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* ── Medicine table ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="table"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {COLS.map((c) => (
                      <th
                        key={c.key}
                        className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                      >
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {session.medicines.map((med, mi) => (
                    <tr
                      key={mi}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors duration-150 group"
                    >
                      {COLS.map((c) => (
                        <td
                          key={c.key}
                          className={`px-5 py-4 text-sm whitespace-nowrap ${
                            c.accent
                              ? "font-bold text-transparent bg-clip-text"
                              : c.bold
                              ? "font-semibold text-slate-800"
                              : "text-slate-500"
                          }`}
                          style={c.accent ? {
                            backgroundImage: "linear-gradient(90deg,#0BA5A4,#2563EB)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          } : {}}
                        >
                          {c.key === "medicine_name" ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
                              >
                                <Pill className="w-3 h-3 text-white" />
                              </div>
                              <span>{med[c.key]}</span>
                            </div>
                          ) : c.key === "scheduled_time" ? (
                            <div className="flex items-center gap-1.5">
                              <Clock3 className="w-3.5 h-3.5" style={{ color: "#0BA5A4" }} />
                              <span>{med[c.key]}</span>
                            </div>
                          ) : (
                            med[c.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Download footer ── */}
            <div className="px-6 py-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Session ID: <span className="text-slate-600 font-semibold">{session.session_id}</span>
              </p>

              <a
                href={`http://127.0.0.1:8000/prescriptions/download/session/${session.session_id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold shadow-lg shadow-[#119DD8]/20 hover:shadow-xl hover:shadow-[#119DD8]/30 transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
const Prescriptions = () => {

  // ── State (unchanged) ──
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  // ── Fetch (unchanged) ──
  const fetchPrescriptions = async () => {
    try {
      if (!email) { console.log("Patient email not found"); return; }
      const response = await API.get(`/prescriptions/patient-email/${email}`);
      setPrescriptions(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrescriptions(); }, []);

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
              <FileText className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Loading Prescriptions…</p>
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
                  <FileText className="w-3.5 h-3.5" />
                  Medical Records
                </div>

                <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900">
                  My{" "}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
                  >
                    Prescriptions
                  </span>
                </h1>
                <p className="mt-2 text-slate-500 font-medium">Consultation-based prescription history</p>
              </div>

              {/* Summary chips */}
              {prescriptions.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#0BA5A4,#2563EB)" }}
                    >
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Sessions</p>
                      <p className="text-lg font-black text-slate-900">{prescriptions.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#119DD8,#2563EB)" }}
                    >
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total Medicines</p>
                      <p className="text-lg font-black text-slate-900">
                        {prescriptions.reduce((acc, s) => acc + s.medicines.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ══ EMPTY STATE ═══════════════════════════════════════════════ */}
        {prescriptions.length === 0 && (
          <motion.div
            variants={up}
            className="rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-16 text-center"
          >
            <div
              className="w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#e0f2fe,#bae6fd)" }}
            >
              <FileText className="w-10 h-10 text-sky-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">No Prescriptions Available</h2>
            <p className="mt-2 text-slate-400 font-medium">Your prescription history will appear here after a consultation.</p>
          </motion.div>
        )}

        {/* ══ PRESCRIPTION CARDS ════════════════════════════════════════ */}
        <div className="space-y-6">
          {prescriptions.map((session, index) => (
            <PrescriptionCard key={index} session={session} index={index} />
          ))}
        </div>

      </motion.div>
    </PatientLayout>
  );
};

export default Prescriptions;