import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ScanLine,
  Activity,
  Stethoscope,
  BellRing,
  Bot,
  Users,
  UserRound,
  HeartPulse,
  AlertTriangle,
  PillBottle,
  EyeOff,
  ClipboardList,
  CalendarClock,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Database,
  Server,
  Layers,
  Sparkles,
  Send,
  Clock,
  TrendingUp,
} from "lucide-react";
import img from "../../assets/img.png";
import logo from "../../assets/logo.png";

/* ----------------------------- Animation helpers ---------------------------- */
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
export default function LandingPage() {
  const navigate = useNavigate();
  const [loginMenuOpen, setLoginMenuOpen] = React.useState(false);

  const goRoles = () => navigate("/roles");
  const goLogin = (path) => {
    setLoginMenuOpen(false);
    navigate(path);
  };
  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-[Inter,sans-serif] text-slate-800 antialiased">
      {/* ============================== NAVBAR ============================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 overflow-hidden rounded-full bg-white shadow-lg shadow-slate-200"
            >
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

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <button onClick={scrollToFeatures} className="transition hover:text-[#2563EB]">
              Features
            </button>
            <a href="#how" className="transition hover:text-[#2563EB]">How it Works</a>
            <a href="#roles" className="transition hover:text-[#2563EB]">Roles</a>
            <a href="#tech" className="transition hover:text-[#2563EB]">Technology</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setLoginMenuOpen((open) => !open)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#2563EB]/40 hover:text-[#2563EB] active:scale-[0.98]"
              >
                Login
              </button>
              {loginMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-40 rounded-3xl border border-slate-200 bg-white py-2 shadow-xl">
                  {[
                    { label: "Patient", path: "/login?role=patient" },
                    { label: "Doctor", path: "/login?role=doctor" },
                    { label: "Guardian", path: "/login?role=guardian" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => goLogin(item.path)}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={goRoles}
              className="rounded-xl bg-gradient-to-r from-[#0BA5A4] to-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* =============================== HERO =============================== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#0BA5A4]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-20 -left-40 h-96 w-96 rounded-full bg-[#2563EB]/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          {/* Left */}
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#0BA5A4]/20 bg-[#0BA5A4]/10 px-4 py-1.5 text-xs font-semibold text-[#0BA5A4]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Medication Safety Platform
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-[Poppins,sans-serif] text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Verify Every Dose.{" "}
              <span className="bg-gradient-to-r from-[#0BA5A4] to-[#2563EB] bg-clip-text text-transparent">
                Protect Every Patient.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              RxGuardian helps patients take the correct medicine at the right time through AI medicine
              verification, adherence monitoring, doctor oversight, and real-time guardian alerts.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={goRoles}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0BA5A4] to-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[#2563EB]/40 hover:text-[#2563EB] active:scale-[0.98]"
              >
                Explore Features
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Deep Learning + OCR
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Real-Time Alerts
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Doctor Oversight
              </span>
            </motion.div>
          </motion.div>

          {/* Right — Hero dashboard preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rotate-3 rounded-3xl bg-gradient-to-br from-[#0BA5A4]/20 to-[#2563EB]/20 blur-2xl" />

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40">
              {/* Dashboard header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#0BA5A4] to-[#2563EB] px-5 py-4">
                <div>
                  <p className="text-sm font-bold text-white">RxGuardian Dashboard</p>
                  <p className="text-xs text-white/80">Live Patient Overview</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]" /> Live
                </span>
              </div>

              <div className="space-y-4 p-5">
                <img
                  src={img}
                  alt="RxGuardian AI medicine verification"
                  className="h-40 w-full rounded-2xl border border-slate-100 object-cover"
                />

                {/* Stat tiles */}
                <div className="grid grid-cols-2 gap-3">
                  <StatTile label="Adherence Rate" value="94%" accent="#10B981" icon={TrendingUp} />
                  <StatTile label="Medicines Taken" value="128" accent="#2563EB" icon={PillBottle} />
                  <StatTile label="Missed Doses" value="3" accent="#F59E0B" icon={Clock} />
                  <StatTile label="Guardian Alerts" value="1" accent="#EF4444" icon={BellRing} />
                </div>

                {/* AI verification result */}
                <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#10B981]">
                      <ScanLine className="h-4 w-4" /> AI Verification
                    </span>
                    <span className="rounded-full bg-[#10B981] px-2.5 py-0.5 text-xs font-semibold text-white">
                      Verified
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Confidence Score</span>
                      <span className="font-semibold text-slate-700">98.6%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "98.6%" }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#0BA5A4] to-[#10B981]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  <Stethoscope className="h-4 w-4 text-[#2563EB]" />
                  Doctor Monitoring:
                  <span className="ml-auto font-semibold text-[#10B981]">Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================= THE PROBLEM ============================= */}
      <Section id="problem">
        <SectionHeader
          eyebrow="The Problem"
          title="Medication mistakes cost lives every day"
          subtitle="Four critical gaps in medication safety that RxGuardian is built to solve."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { icon: PillBottle, color: "#EF4444", stat: "237M", title: "Wrong Medicine Intake", desc: "Medication errors harm millions of patients annually due to look-alike pills." },
            { icon: Clock, color: "#F59E0B", stat: "50%", title: "Missed Doses", desc: "Half of patients fail to take medications as prescribed, reducing treatment efficacy." },
            { icon: EyeOff, color: "#2563EB", stat: "70%", title: "Lack of Doctor Visibility", desc: "Doctors rarely know whether patients actually follow their prescriptions." },
            { icon: AlertTriangle, color: "#0BA5A4", stat: "24/7", title: "Guardian Awareness Gap", desc: "Caregivers have no real-time way of knowing when loved ones miss critical doses." },
          ].map((c) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${c.color}15` }}
              >
                <c.icon className="h-6 w-6" style={{ color: c.color }} />
              </div>
              <p className="mt-5 font-[Poppins,sans-serif] text-3xl font-bold" style={{ color: c.color }}>
                {c.stat}
              </p>
              <h3 className="mt-2 font-[Poppins,sans-serif] text-lg font-semibold text-slate-900">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ====================== WHY RXGUARDIAN (FEATURES) ====================== */}
      <Section id="features" className="bg-white">
        <SectionHeader
          eyebrow="Why RxGuardian"
          title="A complete medication safety ecosystem"
          subtitle="Every layer works together to ensure the right medicine is taken at the right time."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 md:grid-cols-2"
        >
          {[
            { icon: ScanLine, title: "AI Medicine Verification", desc: "Deep Learning + OCR verifies medicine before intake — eliminating wrong-pill errors.", color: "#2563EB" },
            { icon: Activity, title: "Adherence Intelligence", desc: "Every verified dose automatically updates adherence records and scoring.", color: "#0BA5A4" },
            { icon: Stethoscope, title: "Doctor Monitoring", desc: "Doctors remotely track medication compliance and intervene early.", color: "#10B981" },
            { icon: BellRing, title: "Guardian Protection", desc: "Real-time alerts for missed critical medicines reach caregivers instantly.", color: "#F59E0B" },
          ].map((c) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-[#F8FAFC] p-7 transition hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
                style={{ backgroundColor: `${c.color}15` }}
              >
                <c.icon className="h-7 w-7" style={{ color: c.color }} />
              </div>
              <h3 className="mt-5 font-[Poppins,sans-serif] text-xl font-semibold text-slate-900">
                {c.title}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ============================= HOW IT WORKS ============================= */}
      <Section id="how">
        <SectionHeader
          eyebrow="How It Works"
          title="From prescription to protection"
          subtitle="A seamless, AI-driven workflow that closes the loop on medication adherence."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="relative mx-auto max-w-3xl"
        >
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[#0BA5A4] to-[#2563EB] md:left-1/2" />
          {[
            { icon: ClipboardList, title: "Doctor Creates Prescription", desc: "The doctor defines medicines, dosage, and treatment duration." },
            { icon: CalendarClock, title: "Medicine Schedule Generated", desc: "An intelligent schedule with reminder windows is created automatically." },
            { icon: BellRing, title: "Patient Receives Reminder", desc: "Timely reminders are pushed at each scheduled dose." },
            { icon: ScanLine, title: "AI Medicine Verification", desc: "Deep Learning predicts the medicine, OCR extracts text, hybrid engine validates." },
            { icon: CheckCircle2, title: "Dose Recorded", desc: "The verified dose is marked Taken and adherence score updates." },
            { icon: AlertTriangle, title: "Guardian Alert if Missed", desc: "After 3 missed reminders the dose is marked Missed and guardians are alerted." },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              className={`relative mb-8 flex items-start gap-5 md:w-1/2 ${
                i % 2 === 0 ? "md:ml-auto md:flex-row-reverse md:pl-10 md:text-right" : "md:pr-10"
              }`}
            >
              <div className="z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md">
                <step.icon className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="font-[Poppins,sans-serif] text-xs font-bold text-[#0BA5A4]">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="mt-1 font-[Poppins,sans-serif] text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reminder escalation strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mx-auto mt-6 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-center font-[Poppins,sans-serif] text-sm font-semibold text-slate-900">
            Escalation if dose isn't verified
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { t: "21:00", l: "First Reminder", c: "#2563EB" },
              { t: "21:10", l: "Second Reminder", c: "#0BA5A4" },
              { t: "21:20", l: "Third Reminder", c: "#F59E0B" },
              { t: "21:30", l: "Marked Missed", c: "#EF4444" },
            ].map((r) => (
              <div key={r.t} className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="font-[Poppins,sans-serif] text-lg font-bold" style={{ color: r.c }}>
                  {r.t}
                </p>
                <p className="mt-1 text-xs text-slate-500">{r.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ============================== USER ROLES ============================== */}
      <Section id="roles" className="bg-white">
        <SectionHeader
          eyebrow="Built for Everyone"
          title="One platform, three roles"
          subtitle="Tailored experiences for patients, doctors, and guardians."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 lg:grid-cols-3"
        >
          {[
            { icon: UserRound, role: "Patient", color: "#2563EB", items: ["AI Medicine Verification", "Smart Reminders", "Medicine Assistant", "Adherence Tracking"] },
            { icon: Stethoscope, role: "Doctor", color: "#0BA5A4", items: ["Create Prescriptions", "Schedule Medicines", "Monitor Adherence", "Patient Analytics"] },
            { icon: HeartPulse, role: "Guardian", color: "#10B981", items: ["Missed Dose Alerts", "Patient Status", "Reports", "Monitoring Dashboard"] },
          ].map((r) => (
            <motion.div
              key={r.role}
              variants={fadeUp}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-[#F8FAFC] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="flex items-center gap-3 p-6" style={{ backgroundColor: `${r.color}10` }}>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${r.color}20` }}
                >
                  <r.icon className="h-6 w-6" style={{ color: r.color }} />
                </div>
                <h3 className="font-[Poppins,sans-serif] text-xl font-bold text-slate-900">{r.role}</h3>
              </div>
              <ul className="space-y-3 p-6">
                {r.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: r.color }} />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ========================= AI MEDICINE ASSISTANT ========================= */}
      <Section id="assistant">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 px-4 py-1.5 text-xs font-semibold text-[#2563EB]">
              <Bot className="h-3.5 w-3.5" /> AI Medicine Assistant
            </span>
            <h2 className="mt-5 font-[Poppins,sans-serif] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Answers about your medicines, instantly
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Ask anything about your medication — usage, side effects, timing, or your full prescription.
              The AI assistant guides patients 24/7 in plain language.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "What is Dolo 650 used for?",
                "What are the side effects?",
                "Can I take it before food?",
                "Explain my prescription.",
                "What should I do if I miss a dose?",
              ].map((q) => (
                <div
                  key={q}
                  className="inline-flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                >
                  <Sparkles className="h-4 w-4 flex-shrink-0 text-[#0BA5A4]" />
                  {q}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chat preview */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40"
          >
            <div className="bg-gradient-to-r from-[#0BA5A4] to-[#2563EB] px-5 py-4">
              <p className="font-[Poppins,sans-serif] text-base font-bold text-white">RxGuardian AI</p>
              <p className="text-xs text-white/80">Your Smart Medicine Assistant</p>
            </div>
            <div className="space-y-4 bg-[#F8FAFC] p-5">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm text-slate-700 shadow-sm">
                👋 Welcome to RxGuardian AI. Upload a medicine image or ask a medicine-related question. I'm here to help with medicine information and guidance.
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#0BA5A4] to-[#2563EB] p-4 text-sm text-white shadow-md">
                What is Dolo 650 used for?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm text-slate-700 shadow-sm">
                Dolo 650 contains Paracetamol and is used to relieve fever and mild-to-moderate pain. Take after food and avoid exceeding the prescribed dose.
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-slate-100 bg-white p-4">
              <div className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-400">
                Ask about medicines...
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#0BA5A4] to-[#2563EB] text-white shadow-md">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ============================ TECHNOLOGY STACK ============================ */}
      <Section id="tech" className="bg-white">
        <SectionHeader
          eyebrow="Technology"
          title="Engineered with a modern stack"
          subtitle="A robust architecture combining web, backend, data, and deep-learning layers."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { icon: Layers, title: "Frontend", color: "#2563EB", items: ["React", "Tailwind CSS"] },
            { icon: Server, title: "Backend", color: "#0BA5A4", items: ["FastAPI"] },
            { icon: Database, title: "Database", color: "#10B981", items: ["PostgreSQL"] },
            { icon: Cpu, title: "AI Engine", color: "#F59E0B", items: ["Deep Learning Recognition", "OCR Extraction", "Hybrid Verification"] },
          ].map((t) => (
            <motion.div
              key={t.title}
              variants={fadeUp}
              className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${t.color}15` }}
              >
                <t.icon className="h-6 w-6" style={{ color: t.color }} />
              </div>
              <h3 className="mt-5 font-[Poppins,sans-serif] text-lg font-semibold text-slate-900">
                {t.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {t.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ============================ PROJECT IMPACT ============================ */}
      <Section id="impact">
        <SectionHeader
          eyebrow="Project Impact"
          title="Measurable safety, real outcomes"
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { icon: ScanLine, value: "AI", label: "Verification Accuracy", color: "#2563EB" },
            { icon: Bot, value: "24/7", label: "AI Assistance", color: "#0BA5A4" },
            { icon: BarChart3, value: "Real-Time", label: "Monitoring", color: "#10B981" },
            { icon: Users, value: "3", label: "User Roles", color: "#F59E0B" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${s.color}15` }}
              >
                <s.icon className="h-7 w-7" style={{ color: s.color }} />
              </div>
              <p className="mt-4 font-[Poppins,sans-serif] text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ============================ ABOUT / CTA ============================ */}
      <Section id="about" className="bg-white">
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
            RxGuardian focuses on medication safety, adherence improvement, and caregiver awareness —
            bringing patients, doctors, and guardians together on a single intelligent platform.
          </p>
          <button
            onClick={goRoles}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#2563EB] shadow-lg transition hover:shadow-xl active:scale-[0.98]"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </Section>

      {/* =============================== FOOTER =============================== */}
      <footer className="border-t border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0BA5A4] to-[#2563EB]">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-[Poppins,sans-serif] text-lg font-bold text-slate-900">
                RxGuardian
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <button onClick={scrollToFeatures} className="transition hover:text-[#2563EB]">Features</button>
              <a href="#how" className="transition hover:text-[#2563EB]">How it Works</a>
              <a href="#roles" className="transition hover:text-[#2563EB]">Roles</a>
              <a href="#tech" className="transition hover:text-[#2563EB]">Technology</a>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} RxGuardian — AI-Powered Medication Safety Platform. All rights reserved.
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

function StatTile({ label, value, accent, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{label}</span>
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <p className="mt-1.5 font-[Poppins,sans-serif] text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}



