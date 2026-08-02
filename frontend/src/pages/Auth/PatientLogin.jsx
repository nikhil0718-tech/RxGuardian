import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";

const PatientLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focused, setFocused] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await API.post("/auth/login", { email, password, role: "patient" });
      const patientId = response.data.user.id;
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", "patient");
      localStorage.setItem("patient_id", patientId);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/patient/today-medicines");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) => ({
    width: "100%",
    border: `1.5px solid ${focused === name ? "#0BA5A4" : "rgba(15,23,42,0.06)"}`,
    borderRadius: 14,
    padding: "15px 18px",
    fontSize: 14,
    fontFamily: "'Poppins',sans-serif",
    color: "#0F172A",
    background: focused === name ? "rgba(11,165,164,0.03)" : "white",
    outline: "none",
    transition: "all 0.18s ease",
    boxShadow: focused === name ? "0 0 0 4px rgba(11,165,164,0.08)" : "none",
    boxSizing: "border-box",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Poppins',sans-serif",
        background: "linear-gradient(180deg,#e8f5f9 0%, #f8fcff 50%, #eaf3f0 100%)",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .blob{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0}
        .login-btn{
          background: linear-gradient(135deg,#0BA5A4 0%, #119DD8 55%, #2563EB 100%);
          border:none;border-radius:16px;color:white;cursor:pointer;
          font-family:'Poppins',sans-serif;font-size:15px;font-weight:700;padding:16px 18px;
          width:100%;transition:transform 0.18s,box-shadow 0.18s;box-shadow:0 10px 30px rgba(11,165,164,0.18);
        }
        .login-btn:hover{transform:translateY(-3px);box-shadow:0 18px 48px rgba(11,165,164,0.22)}
        .login-btn:active{transform:scale(0.98)}
        .login-btn:disabled{opacity:0.7;cursor:not-allowed}
        .left-col { flex: 0 0 44%; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:60px 48px; position:relative; overflow:hidden; z-index:1 }
        .right-col { flex:1; display:flex; align-items:center; justify-content:center; padding:48px 40px; z-index:1 }
        @media(max-width:900px){ .left-col{display:none!important} .right-col{padding:28px} }
      `}</style>

      {/* Left panel */}
      <div
        className="left-col"
        style={{
          background: "linear-gradient(160deg,#0BA5A4 0%, #119DD8 55%, #2563EB 100%)",
        }}
      >
        <div className="blob" style={{ top: "-18%", right: "-18%", width: 460, height: 460, background: "rgba(255,255,255,0.08)" }} />
        <div className="blob" style={{ bottom: "-14%", left: "-14%", width: 380, height: 380, background: "rgba(255,255,255,0.06)" }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", color: "white" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(18px)",
              borderRadius: 24,
              padding: 28,
              marginBottom: 36,
              border: "1px solid rgba(255,255,255,0.18)",
              display: "inline-block",
              animation: "floatA 7s ease-in-out infinite",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png"
              alt="patient-illustration"
              style={{ width: 140, filter: "brightness(0) invert(1)", opacity: 0.95 }}
            />
          </div>

          <h2 style={{ color: "white", fontSize: 28, fontWeight: 800, margin: "0 0 12px" }}>Patient Portal</h2>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 15, lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>
            Track your daily medications, view adherence reports, and stay on top of your health.
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            {["Daily Tracking", "AI Verified", "Smart Reminders"].map((t) => (
              <div
                key={t}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 999,
                  padding: "8px 16px",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="right-col">
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="rxguardian" style={{ width: 34 }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: "#0BA5A4", letterSpacing: "1px" }}>RXGUARDIAN</span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>Welcome Back 👋</h1>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px" }}>Sign in to your patient dashboard</p>

          <div
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.86))",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 20px 60px rgba(8,30,52,0.06)",
              padding: 28,
            }}
          >
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 8, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inp("email")}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 8, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inp("password")}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#64748B" }}>
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "#0BA5A4", width: 15, height: 15 }} />
                  Remember me
                </label>
                <a href="#" style={{ fontSize: 13, color: "#0BA5A4", fontWeight: 700, textDecoration: "none" }}>Forgot password?</a>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#94A3B8" }}>
              No account?{" "}
              <Link to="/register" style={{ color: "#0BA5A4", fontWeight: 700, textDecoration: "none" }}>
                Create one
              </Link>
            </p>
          </div>

          <p style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "#94A3B8" }}>🔒 Secured with end-to-end encryption</p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
