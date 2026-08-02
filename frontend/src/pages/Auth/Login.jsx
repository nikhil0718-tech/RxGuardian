import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api.js";
import patientImg from "../../assets/patient.png";
import doctorImg from "../../assets/doctor.png";
import guardianImg from "../../assets/guardian.png";
import { useSearchParams } from "react-router-dom";


/* ------------------------------ Role Config ------------------------------ */
const roleConfig = {
  patient: {
    key: "patient",
    label: "Patient",
    title: "Patient Portal",
    description:
      "Track medicines, adherence scores and AI medicine verification.",
    image: patientImg,
    accent: "#10B981",
    buttonText: "Sign In to Patient Portal",
    redirect: "/patient/today-medicines",
    badges: [
      { title: "Adherence Score", value: "94%", sub: "This week" },
      { title: "AI Verified", value: "Active", sub: "Medicine scans" },
      { title: "Smart Reminders", value: "On", sub: "Dose alerts" },
    ],
    onSuccess: (navigate, response) => {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", "patient");
      localStorage.setItem("patient_id", response.data.user.id);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/patient/today-medicines");
    },
  },
  doctor: {
    key: "doctor",
    label: "Doctor",
    title: "Doctor Portal",
    description: "Manage prescriptions and monitor patient adherence.",
    image: doctorImg,
    accent: "#2563EB",
    buttonText: "Access Doctor Portal",
    redirect: "/doctor/dashboard",
    badges: [
      { title: "Active Patients", value: "248", sub: "Under care" },
      { title: "Adherence Overview", value: "91%", sub: "Avg. across panel" },
      { title: "Monitoring", value: "Live", sub: "Real-time dashboard" },
    ],
    onSuccess: (navigate, response) => {
      localStorage.setItem("token", "loggedin");
      localStorage.setItem("role", "doctor");
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/doctor/dashboard");
    },
  },
  guardian: {
    key: "guardian",
    label: "Guardian",
    title: "Guardian Portal",
    description: "Monitor loved ones and receive missed-dose alerts.",
    image: guardianImg,
    accent: "#0BA5A4",
    buttonText: "Access Guardian Portal",
    redirect: "/guardian/dashboard",
    badges: [
      { title: "Live Alerts", value: "3", sub: "Last 24 hours" },
      { title: "Missed Dose", value: "1", sub: "Needs attention" },
      { title: "Caregiver Monitoring", value: "Active", sub: "Loved ones" },
    ],
    onSuccess: (navigate, response) => {
      localStorage.setItem("token", "loggedin");
      localStorage.setItem("role", "guardian");
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/guardian/dashboard");
    },
  },
};
const brandGradient =
  "linear-gradient(135deg, #0BA5A4, #119DD8, #2563EB)";
/* -------------------------------- Component ------------------------------- */
export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

const defaultRole =
  searchParams.get("role") || "patient";

const [role, setRole] = useState(defaultRole);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cfg = useMemo(() => roleConfig[role], [role]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      const response = await API.post("/auth/login", {
        email,
        password,
        role: cfg.key,
      });
      cfg.onSuccess(navigate, response);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  /* --------------------------------- Styles -------------------------------- */
  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: "#F8FAFC",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      color: "#0f172a",
      display: "flex",
      alignItems: "stretch",
      justifyContent: "center",
    },
    container: {
      width: "100%",
      maxWidth: 1280,
      display: "grid",
      gridTemplateColumns: "1.05fr 1fr",
      gap: 0,
      padding: 24,
    },
    left: {
      position: "relative",
      borderRadius: 28,
      overflow: "hidden",
      background:
        "linear-gradient(160deg, rgba(11,165,164,0.10), rgba(37,99,235,0.10))",
      border: "1px solid rgba(15,23,42,0.06)",
      padding: 36,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: 640,
    },
    blob1: {
      position: "absolute",
      top: -120,
      right: -120,
      width: 360,
      height: 360,
      borderRadius: "50%",
      background: "rgba(11,165,164,0.20)",
      filter: "blur(80px)",
      pointerEvents: "none",
    },
    blob2: {
      position: "absolute",
      bottom: -120,
      left: -100,
      width: 360,
      height: 360,
      borderRadius: "50%",
      background: "rgba(37,99,235,0.20)",
      filter: "blur(80px)",
      pointerEvents: "none",
    },
    leftHeader: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    logoBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: brandGradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      boxShadow: "0 10px 25px -10px rgba(37,99,235,0.5)",
    },
    brand: {
      fontFamily: "Poppins, Inter, sans-serif",
      fontWeight: 700,
      fontSize: 18,
      color: "#0f172a",
      letterSpacing: "-0.01em",
    },
    leftBody: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: 18,
    },
    illustration: {
      width: "100%",
      maxWidth: 420,
      height: 320,
      objectFit: "contain",
      filter: "drop-shadow(0 20px 40px rgba(15,23,42,0.15))",
    },
    leftTitle: {
      fontFamily: "Poppins, Inter, sans-serif",
      fontSize: 26,
      fontWeight: 700,
      color: "#0f172a",
      margin: 0,
    },
    leftSub: {
      fontSize: 15,
      color: "#475569",
      maxWidth: 420,
      lineHeight: 1.55,
      margin: 0,
    },
    badgeGrid: {
      position: "relative",
      zIndex: 2,
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
    },
    badgeCard: {
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(15,23,42,0.06)",
      borderRadius: 16,
      padding: 14,
      boxShadow: "0 10px 25px -15px rgba(15,23,42,0.25)",
    },
    badgeLabel: {
      fontSize: 11,
      color: "#64748b",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    },
    badgeValue: {
      fontFamily: "Poppins, Inter, sans-serif",
      fontSize: 20,
      fontWeight: 700,
      color: "#0f172a",
      marginTop: 4,
    },
    badgeSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
    right: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 0 0 32px",
    },
    formCard: {
      width: "100%",
      maxWidth: 480,
      background: "#fff",
      borderRadius: 24,
      padding: 36,
      border: "1px solid #E2E8F0",
      boxShadow: "0 30px 60px -30px rgba(15,23,42,0.18)",
    },
    formHeader: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 20,
    },
    title: {
      fontFamily: "Poppins, Inter, sans-serif",
      fontSize: 26,
      fontWeight: 700,
      color: "#0f172a",
      margin: "4px 0 6px",
      letterSpacing: "-0.01em",
    },
    desc: { fontSize: 14, color: "#475569", margin: "0 0 22px", lineHeight: 1.55 },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      color: "#334155",
      marginBottom: 6,
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid #E2E8F0",
      background: "#F8FAFC",
      fontSize: 14,
      color: "#0f172a",
      outline: "none",
      transition: "border-color .2s, box-shadow .2s, background .2s",
      boxSizing: "border-box",
    },
    fieldRow: { marginBottom: 14 },
    row: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
    },
    checkboxWrap: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      color: "#475569",
      cursor: "pointer",
    },
    link: {
      fontSize: 13,
      color: "#2563EB",
      fontWeight: 600,
      textDecoration: "none",
      cursor: "pointer",
    },
    submit: {
      width: "100%",
      padding: "13px 16px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      background: brandGradient,
      boxShadow: "0 15px 30px -15px rgba(37,99,235,0.55)",
      transition: "transform .15s, box-shadow .2s, opacity .2s",
    },
    bottom: {
      marginTop: 18,
      textAlign: "center",
      fontSize: 13,
      color: "#64748b",
    },
    errorBox: {
      background: "#FEF2F2",
      border: "1px solid #FECACA",
      color: "#B91C1C",
      padding: "10px 12px",
      borderRadius: 10,
      fontSize: 13,
      marginBottom: 14,
    },
  };
  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 960px) {
          .rx-grid { grid-template-columns: 1fr !important; }
          .rx-right { padding: 24px 0 0 !important; }
          .rx-left { min-height: auto !important; }
          .rx-illustration { height: 220px !important; }
        }
        @media (max-width: 640px) {
          .rx-left { display: none !important; }
        }
        .rx-input:focus {
          border-color: #2563EB !important;
          background: #fff !important;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12) !important;
        }
        .rx-submit:hover { transform: translateY(-1px); }
        .rx-submit:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
      <div style={styles.container} className="rx-grid">
        {/* ----------------------------- LEFT PANEL ----------------------------- */}
        <aside style={styles.left} className="rx-left">
          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={styles.leftHeader}>
            <div style={styles.logoBox}>Rx</div>
            <span style={styles.brand}>RxGuardian</span>
          </div>
          <div style={styles.leftBody}>
            <img
              src={cfg.image}
              alt={`${cfg.label} illustration`}
              style={styles.illustration}
              className="rx-illustration"
            />
            <h2 style={styles.leftTitle}>{cfg.title}</h2>
            <p style={styles.leftSub}>{cfg.description}</p>
          </div>
          <div style={styles.badgeGrid}>
            {cfg.badges.map((b) => (
              <div key={b.title} style={styles.badgeCard}>
                <div style={styles.badgeLabel}>{b.title}</div>
                <div style={{ ...styles.badgeValue, color: cfg.accent }}>
                  {b.value}
                </div>
                <div style={styles.badgeSub}>{b.sub}</div>
              </div>
            ))}
          </div>
        </aside>
        {/* ----------------------------- RIGHT PANEL ---------------------------- */}
        <section style={styles.right} className="rx-right">
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <div style={styles.logoBox}>Rx</div>
              <span style={styles.brand}>RxGuardian</span>
            </div>
            <h1 style={styles.title}>{cfg.title}</h1>
            <p style={styles.desc}>{cfg.description}</p>
            {error && <div style={styles.errorBox}>{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.fieldRow}>
                <label style={styles.label} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={styles.input}
                  className="rx-input"
                  required
                />
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label} htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.input}
                  className="rx-input"
                  required
                />
              </div>
              <div style={styles.row}>
                <label style={styles.checkboxWrap}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <a
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                  href="/forgot-password"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={styles.submit}
                className="rx-submit"
              >
                {loading ? "Signing in..." : cfg.buttonText}
              </button>
            </form>
            <div style={styles.bottom}>
              No account?{" "}
              <a
                style={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
                href="/register"
              >
                Create one
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}