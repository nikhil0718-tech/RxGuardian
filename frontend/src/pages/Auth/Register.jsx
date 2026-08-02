import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import patientImg from "../../assets/patient.png";
import doctorImg from "../../assets/doctor.png";
import guardianImg from "../../assets/guardian.png";
/* ------------------------------ Role Config ------------------------------ */
const roleConfig = {
  patient: {
    key: "patient",
    label: "Patient",
    title: "Create Your Patient Account",
    description:
      "Track medicines, build adherence and verify pills with AI — all in one place.",
    image: patientImg,
    accent: "#10B981",
    buttonText: "Create Patient Account",
  },
  doctor: {
    key: "doctor",
    label: "Doctor",
    title: "Create Your Doctor Account",
    description:
      "Manage prescriptions, monitor adherence and oversee patient care effortlessly.",
    image: doctorImg,
    accent: "#2563EB",
    buttonText: "Create Doctor Account",
  },
  guardian: {
    key: "guardian",
    label: "Guardian",
    title: "Create Your Guardian Account",
    description:
      "Stay connected to loved ones and get instant alerts for missed doses.",
    image: guardianImg,
    accent: "#0BA5A4",
    buttonText: "Create Guardian Account",
  },
};
const brandGradient = "linear-gradient(135deg, #0BA5A4, #119DD8, #2563EB)";
const benefits = [
  { icon: "🤖", text: "AI-powered medication verification" },
  { icon: "🔔", text: "Real-time guardian alerts" },
  { icon: "📊", text: "Adherence analytics dashboard" },
  { icon: "🔒", text: "HIPAA-compliant & secure" },
];
/* -------------------------------- Component ------------------------------- */
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const cfg = useMemo(() => roleConfig[form.role], [form.role]);
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    if (
      form.role === "patient" &&
      (!form.guardian_name || !form.guardian_email || !form.guardian_phone)
    ) {
      setError("Please complete guardian information.");
      return;
    }
    try {
      setLoading(true);
      await registerUser(form);
      setSuccess("Account created successfully. Redirecting to sign in...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Registration failed. Please try again."
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
      minHeight: 720,
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
      gap: 14,
      paddingTop: 12,
    },
    illustration: {
      width: "100%",
      maxWidth: 360,
      height: 240,
      objectFit: "contain",
      filter: "drop-shadow(0 20px 40px rgba(15,23,42,0.15))",
    },
    leftTitle: {
      fontFamily: "Poppins, Inter, sans-serif",
      fontSize: 24,
      fontWeight: 700,
      color: "#0f172a",
      margin: 0,
    },
    leftSub: {
      fontSize: 14.5,
      color: "#475569",
      maxWidth: 420,
      lineHeight: 1.55,
      margin: 0,
    },
    benefitList: {
      position: "relative",
      zIndex: 2,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
    },
    benefitItem: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(15,23,42,0.06)",
      borderRadius: 14,
      padding: "10px 12px",
      fontSize: 13,
      color: "#334155",
      fontWeight: 500,
      boxShadow: "0 10px 25px -15px rgba(15,23,42,0.2)",
    },
    benefitIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      background: "linear-gradient(135deg, rgba(11,165,164,0.15), rgba(37,99,235,0.15))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      flexShrink: 0,
    },
    right: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 0 0 32px",
    },
    formCard: {
      width: "100%",
      maxWidth: 520,
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
      marginBottom: 18,
    },
    eyebrow: {
      fontSize: 12,
      fontWeight: 700,
      color: "#64748b",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 8,
    },
    roleTabs: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 8,
      padding: 6,
      background: "#F1F5F9",
      borderRadius: 14,
      marginBottom: 20,
    },
    title: {
      fontFamily: "Poppins, Inter, sans-serif",
      fontSize: 24,
      fontWeight: 700,
      color: "#0f172a",
      margin: "4px 0 6px",
      letterSpacing: "-0.01em",
    },
    desc: {
      fontSize: 14,
      color: "#475569",
      margin: "0 0 20px",
      lineHeight: 1.55,
    },
    sectionTitle: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "Poppins, Inter, sans-serif",
      fontSize: 13,
      fontWeight: 700,
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      margin: "8px 0 12px",
    },
    sectionDot: {
      width: 22,
      height: 22,
      borderRadius: 7,
      background: "linear-gradient(135deg, rgba(11,165,164,0.18), rgba(37,99,235,0.18))",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
    },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: "#334155",
      marginBottom: 6,
      letterSpacing: "0.02em",
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
      fontFamily: "inherit",
    },
    fieldRow: { marginBottom: 12 },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
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
      marginTop: 6,
    },
    bottom: {
      marginTop: 16,
      textAlign: "center",
      fontSize: 13,
      color: "#64748b",
    },
    link: {
      color: "#2563EB",
      fontWeight: 600,
      textDecoration: "none",
      cursor: "pointer",
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
    successBox: {
      background: "#ECFDF5",
      border: "1px solid #A7F3D0",
      color: "#047857",
      padding: "10px 12px",
      borderRadius: 10,
      fontSize: 13,
      marginBottom: 14,
    },
    hipaa: {
      marginTop: 14,
      textAlign: "center",
      fontSize: 12,
      color: "#64748b",
    },
  };
  const tabStyle = (active) => ({
    padding: "10px 8px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    color: active ? "#fff" : "#334155",
    background: active ? brandGradient : "transparent",
    boxShadow: active ? "0 10px 20px -10px rgba(37,99,235,0.5)" : "none",
    transition: "all .2s",
  });
  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 960px) {
          .rx-grid { grid-template-columns: 1fr !important; }
          .rx-right { padding: 24px 0 0 !important; }
          .rx-left { min-height: auto !important; }
          .rx-illustration { height: 200px !important; }
        }
        @media (max-width: 640px) {
          .rx-left { display: none !important; }
          .rx-grid2 { grid-template-columns: 1fr !important; }
        }
        .rx-input:focus {
          border-color: #2563EB !important;
          background: #fff !important;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12) !important;
        }
        .rx-submit:hover { transform: translateY(-1px); }
        .rx-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        select.rx-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 20px;
          padding-right: 40px;
        }
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
            <h2 style={styles.leftTitle}>Start Your Health Journey Today</h2>
            <p style={styles.leftSub}>
              Join thousands of patients, doctors and guardians on the smartest
              medication monitoring platform.
            </p>
          </div>
          <div style={styles.benefitList}>
            {benefits.map((b) => (
              <div key={b.text} style={styles.benefitItem}>
                <span style={styles.benefitIcon}>{b.icon}</span>
                <span>{b.text}</span>
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
            <div style={styles.eyebrow}>Create Account</div>
            <div style={styles.roleTabs}>
              {Object.values(roleConfig).map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => update("role", r.key)}
                  style={tabStyle(form.role === r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <h1 style={styles.title}>{cfg.title}</h1>
            <p style={styles.desc}>{cfg.description}</p>
            {error && <div style={styles.errorBox}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}
            <form onSubmit={handleSubmit} noValidate>
              {/* Personal Information */}
              <div style={styles.sectionTitle}>
                <span style={styles.sectionDot}>👤</span>
                Personal Information
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  style={styles.input}
                  className="rx-input"
                  required
                />
              </div>
              <div style={styles.grid2} className="rx-grid2">
                <div style={styles.fieldRow}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    style={styles.input}
                    className="rx-input"
                    required
                  />
                </div>
                <div style={styles.fieldRow}>
                  <label style={styles.label}>Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    style={styles.input}
                    className="rx-input"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="guardian">Guardian</option>
                  </select>
                </div>
              </div>
              {/* Account Security */}
              <div style={styles.sectionTitle}>
                <span style={styles.sectionDot}>🔒</span>
                Account Security
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  style={styles.input}
                  className="rx-input"
                  required
                />
              </div>
              {/* Guardian Information (patient only) */}
              {form.role === "patient" && (
                <>
                  <div style={styles.sectionTitle}>
                    <span style={styles.sectionDot}>🛡️</span>
                    Guardian Information
                  </div>
                  <div style={styles.fieldRow}>
                    <label style={styles.label}>Guardian Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.guardian_name}
                      onChange={(e) => update("guardian_name", e.target.value)}
                      style={styles.input}
                      className="rx-input"
                    />
                  </div>
                  <div style={styles.grid2} className="rx-grid2">
                    <div style={styles.fieldRow}>
                      <label style={styles.label}>Guardian Email</label>
                      <input
                        type="email"
                        placeholder="guardian@email.com"
                        value={form.guardian_email}
                        onChange={(e) =>
                          update("guardian_email", e.target.value)
                        }
                        style={styles.input}
                        className="rx-input"
                      />
                    </div>
                    <div style={styles.fieldRow}>
                      <label style={styles.label}>Guardian Phone</label>
                      <input
                        type="tel"
                        placeholder="+1 555 123 4567"
                        value={form.guardian_phone}
                        onChange={(e) =>
                          update("guardian_phone", e.target.value)
                        }
                        style={styles.input}
                        className="rx-input"
                      />
                    </div>
                  </div>
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                style={styles.submit}
                className="rx-submit"
              >
                {loading ? "Creating Account..." : `${cfg.buttonText} →`}
              </button>
            </form>
            <div style={styles.bottom}>
              Already have an account?{" "}
              <a
                style={styles.link}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                href="/login"
              >
                Sign in
              </a>
            </div>
            <div style={styles.hipaa}>
              🔒 Your data is protected with HIPAA-compliant encryption
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}