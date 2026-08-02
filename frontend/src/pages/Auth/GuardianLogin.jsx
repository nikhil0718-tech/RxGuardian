import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";

const GuardianLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await API.post("/auth/login", { email, password, role: "guardian" });
      localStorage.setItem("token", "loggedin");
      localStorage.setItem("role", "guardian");
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/guardian/dashboard");
    } catch (error) {
      console.log(error);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) => ({
    width: "100%",
    border: `1.5px solid ${focused === name ? "#7C3AED" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 14,
    padding: "15px 18px",
    fontSize: 14,
    fontFamily: "'Poppins',sans-serif",
    color: "#0F172A",
    background: focused === name ? "rgba(124,58,237,0.03)" : "white",
    outline: "none",
    transition: "all 0.2s",
    boxShadow: focused === name ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
    boxSizing: "border-box",
  });

  const alerts = [
    { patient: "Mom", time: "2m ago", msg: "Missed afternoon dose", color: "#EF4444" },
    { patient: "Dad", time: "1h ago", msg: "Morning dose confirmed", color: "#0BA5A4" },
    { patient: "Sister", time: "3h ago", msg: "All doses taken today", color: "#10B981" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Poppins',sans-serif", background: "linear-gradient(135deg,#F5F3FF 0%,#EFF6FF 50%,#F0FDFB 100%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .blob{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
        .login-btn{background:linear-gradient(135deg,#7C3AED,#2563EB,#119DD8);border:none;border-radius:16px;color:white;cursor:pointer;font-family:'Poppins',sans-serif;font-size:15px;font-weight:700;padding:17px;width:100%;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 8px 28px rgba(124,58,237,0.3);}
        .login-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(124,58,237,0.4);}
        .login-btn:active{transform:scale(0.98);}
        .login-btn:disabled{opacity:0.7;cursor:not-allowed;}
        @media(max-width:900px){.left-col{display:none!important}}
      `}</style>

      {/* Left panel */}
      <div className="left-col" style={{ flex: "0 0 45%", background: "linear-gradient(160deg,#5B21B6 0%,#7C3AED 40%,#2563EB 80%,#119DD8 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ top: "-20%", right: "-15%", width: 400, height: 400, background: "rgba(255,255,255,0.1)" }} />
        <div className="blob" style={{ bottom: "-10%", left: "-10%", width: 350, height: 350, background: "rgba(255,255,255,0.07)" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%" }}>
          <div style={{ background: "rgba(255,255,255,0.13)", backdropFilter: "blur(20px)", borderRadius: 28, padding: 28, marginBottom: 32, border: "1px solid rgba(255,255,255,0.2)", animation: "floatA 7s ease-in-out infinite", display: "inline-block" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" style={{ width: 130, filter: "brightness(0) invert(1)", opacity: 0.9 }} alt="" />
          </div>

          {/* Alert feed preview */}
          <div style={{ background: "rgba(255,255,255,0.11)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.18)", marginBottom: 28, textAlign: "left" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, marginBottom: 14, letterSpacing: "0.5px" }}>🔔 LIVE ALERTS</div>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < alerts.length - 1 ? 12 : 0, paddingBottom: i < alerts.length - 1 ? 12 : 0, borderBottom: i < alerts.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{a.patient}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{a.msg}</div>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{a.time}</div>
              </div>
            ))}
          </div>

          <h2 style={{ color: "white", fontSize: 26, fontWeight: 800, margin: "0 0 12px" }}>Guardian Portal</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
            Monitor medication adherence and receive real-time alerts for your loved ones.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" style={{ width: 34 }} alt="" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", letterSpacing: "1px" }}>RXGUARDIAN — GUARDIAN</span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>Guardian Portal</h1>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 36px" }}>Monitor medication adherence and receive real-time alerts.</p>

          <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: 28, border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 20px 60px rgba(124,58,237,0.07)", padding: 36 }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" }}>Email Address</label>
                <input type="email" placeholder="guardian@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} style={inp("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused("")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" }}>Password</label>
                <input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inp("password")} onFocus={() => setFocused("password")} onBlur={() => setFocused("")} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a href="#" style={{ fontSize: 13, color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}>Forgot password?</a>
              </div>
              <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? "Signing in..." : "Access Guardian Portal →"}
              </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#94A3B8" }}>
              No account?{" "}
              <Link to="/register" style={{ color: "#7C3AED", fontWeight: 700, textDecoration: "none" }}>Register here</Link>
            </p>
          </div>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#CBD5E1" }}>🛡️ Family healthcare monitoring · Secure & private</p>
        </div>
      </div>
    </div>
  );
};

export default GuardianLogin;