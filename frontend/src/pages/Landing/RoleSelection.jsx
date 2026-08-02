import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Activity,
  BarChart3,
  Sparkles,
  TrendingUp,
  PillBottle,
  HeartPulse,
} from "lucide-react";
import logo from "../../assets/logo.png";
/* ----------------------------- Animation helpers ----------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const viewport = { once: true, amount: 0.2 };
/* --------------------------------- Component -------------------------------- */
export default function RoleSelection() {
  const navigate = useNavigate();
  const goHome = () => navigate("/");
  const roles = [
    {
      icon: User,
      title: "Patient",
      color: "#10B981",
      description:
        "Verify medicines, track adherence, receive reminders, and access your personal medication dashboard.",
      route: "/login?role=patient",
      features: [
        "AI Medicine Verification",
        "Smart Dose Reminders",
        "Medicine Assistant",
        "Adherence Tracking",
      ],
    },
    {
      icon: Stethoscope,
      title: "Doctor",
      color: "#2563EB",
      description:
        "Create prescriptions, monitor adherence, review patient analytics, and improve medication outcomes.",
      route: "/login?role=doctor",
      features: [
        "Create Prescriptions",
        "Schedule Medicines",
        "Patient Monitoring",
        "Adherence Analytics",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Guardian",
      color: "#0BA5A4",
      description:
        "Monitor loved ones, receive missed-dose alerts, and stay informed about patient medication adherence.",
      route: "/login?role=guardian",
      features: [
        "Real-Time Alerts",
        "Missed Dose Monitoring",
        "Adherence Reports",
        "Patient Status Tracking",
      ],
    },
  ];
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-[Inter,sans-serif] text-slate-800 antialiased">
      {/* ============================== NAVBAR ============================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-white shadow-lg shadow-slate-200">
              <img
                src={logo}
                alt="RxGuardian logo"
                className="h-full w-full object-cover transform scale-150"
              />
            </div>
            <span className="font-[Poppins,sans-serif] text-lg font-bold tracking-tight text-slate-900">
              RxGuardian
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#2563EB]/40 hover:text-[#2563EB] active:scale-[0.98]"
            >
              Back to Home
            </button>
          </div>
        </nav>
      </header>
      {/* =============================== HERO =============================== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#0BA5A4]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-20 -left-40 h-96 w-96 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#0BA5A4]/20 bg-[#0BA5A4]/10 px-4 py-1.5 text-xs font-semibold text-[#0BA5A4]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Choose Your Role
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="mx-auto mt-6 max-w-4xl font-[Poppins,sans-serif] text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Access Your Personalized{" "}
              <span className="bg-gradient-to-r from-[#0BA5A4] to-[#2563EB] bg-clip-text text-transparent">
                Healthcare Dashboard
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600"
            >
              Select the role that best describes you to access a personalized medication safety
              experience powered by AI verification, adherence monitoring, and real-time healthcare insights.
            </motion.p>
          </motion.div>
        </div>
      </section>
      {/* ============================= ROLE CARDS ============================= */}
      <Section id="roles" className="bg-white">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.title}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-[#F8FAFC] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
              >
                {/* Gradient top border accent */}
                <div
                  className="absolute left-0 right-0 top-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${role.color}, ${role.color}66)`,
                  }}
                />
                <div className="p-7">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
                    style={{ backgroundColor: `${role.color}15` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: role.color }} />
                  </div>
                  <h3 className="mt-5 font-[Poppins,sans-serif] text-2xl font-bold text-slate-900">
                    {role.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{role.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {role.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: role.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate(role.route)}
                    className="group/btn mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(90deg, ${role.color}, ${role.color}cc)`,
                    }}
                  >
                    Continue as {role.title}
                    <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Section>
      {/* ============================ ABOUT / CTA ============================ */}
      <Section id="cta">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0BA5A4] to-[#2563EB] px-8 py-14 text-center shadow-2xl shadow-blue-500/20 sm:px-16"
        >
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white">
            <ShieldCheck className="h-3.5 w-3.5" /> About RxGuardian
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-[Poppins,sans-serif] text-3xl font-bold leading-tight text-white sm:text-4xl">
            A real-world AI healthcare solution for safer medication
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            RxGuardian focuses on medication safety, adherence improvement, and caregiver awareness
            — bringing patients, doctors, and guardians together on a single intelligent platform.
          </p>
          <button
            onClick={goHome}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#2563EB] shadow-lg transition hover:shadow-xl active:scale-[0.98]"
          >
            Back to Home
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </Section>
      {/* =============================== FOOTER =============================== */}
      <footer className="border-t border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0BA5A4] to-[#2563EB]">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-[Poppins,sans-serif] text-lg font-bold text-slate-900">
                RxGuardian
              </span>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
            &copy; 2026 RxGuardian — AI-Powered Medication Safety Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
/* ------------------------------ Sub-components ------------------------------ */
function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      <span className="font-[Poppins,sans-serif] text-sm font-bold uppercase tracking-wider text-[#0BA5A4]">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-[Poppins,sans-serif] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-slate-600">{subtitle}</p>}
    </motion.div>
  );
}
