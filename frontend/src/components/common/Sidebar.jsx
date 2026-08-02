
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Pill,
  FileText,
  ShieldCheck,
  Bot,
  History,
  User,
  Users,
  Activity,
  Stethoscope,
  PlusCircle,
  BarChart3,
  LogOut,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ menu }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const path = window.location.pathname;

const role = path.startsWith("/doctor")
  ? "doctor"
  : path.startsWith("/guardian")
  ? "guardian"
  : "patient";
  console.log("SIDEBAR MENU =", menu);
console.log("ROLE =", role);

  const icons = {
  Dashboard: LayoutDashboard,

  // Patient
  "Today's Medicines": Pill,
  Prescriptions: FileText,
  "AI Verification": ShieldCheck,
  "Medicine Agent": Bot,
  History: History,

  // Doctor
  "Create Prescription": PlusCircle,
  Patients: Users,
  Analytics: BarChart3,

  // Guardian
  "Guardian Alerts": ShieldCheck,
  "Patient Status": User,
  Reports: FileText,
};
console.log(menu);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : role === "doctor"
    ? "D"
    : role === "guardian"
    ? "G"
    : "P";

  const handleLogout = () => {
    localStorage.clear();

    if (role === "doctor") {
      navigate("/login?role=doctor");
    } else if (role === "guardian") {
      navigate("/login?role=guardian");
    } else {
      navigate("/login?role=patient");
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[272px] flex flex-col z-50 bg-white/90 backdrop-blur-2xl border-r border-slate-100 shadow-[4px_0_32px_rgba(0,0,0,0.06)]">

      {/* Top Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)",
        }}
      />

      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{
              background:
                "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)",
            }}
          >
            {role === "doctor" ? (
              <Stethoscope className="w-4 h-4 text-white" />
            ) : role === "guardian" ? (
              <Users className="w-4 h-4 text-white" />
            ) : (
              <Activity className="w-4 h-4 text-white" />
            )}
          </div>

          <div>
            <h1
              className="text-xl font-black tracking-tight text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)",
              }}
            >
              RxGuardian
            </h1>

            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              {role === "doctor"
                ? "Doctor Portal"
                : role === "guardian"
                ? "Guardian Portal"
                : "AI Healthcare Platform"}
            </p>
          </div>
        </div>

        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>

        <div className="space-y-1">
          {menu.map((item, index) => {
            const Icon = icons[item.name] || LayoutDashboard;

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "text-white shadow-lg shadow-[#119DD8]/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background:
                            "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <div
                      className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                        isActive
                          ? "bg-white/20"
                          : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-slate-700"
                        }
                      />
                    </div>

                    <span className="relative z-10 flex-1">
                      {item.name}
                    </span>

                    {isActive && (
                      <ChevronRight
                        size={14}
                        className="relative z-10 text-white/70"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Profile Card */}
      <div className="p-4">
        <div className="rounded-[20px] border border-slate-100 bg-gradient-to-br from-slate-50 to-white shadow-sm p-4">

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black"
              style={{
                background:
                  "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)",
              }}
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.name ||
                  (role === "doctor"
                    ? "Doctor"
                    : role === "guardian"
                    ? "Guardian"
                    : "Patient")}
              </p>

              <p className="text-[11px] text-slate-400 truncate">
                {user?.email}
              </p>
            </div>

            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>

          <div className="my-3 h-px bg-slate-100" />

          {role === "doctor" ? (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Professional Info
              </p>

              <p className="text-sm font-semibold text-slate-700 truncate">
                {user?.specialization || "Medical Professional"}
              </p>

              <p className="text-[11px] text-slate-400 truncate">
                {user?.license_number
                  ? `License: ${user.license_number}`
                  : "Licensed Physician"}
              </p>
            </div>
          ) : role === "guardian" ? (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Guardian
              </p>

              <p className="text-sm font-semibold text-slate-700">
                Patient Monitor
              </p>

              <p className="text-[11px] text-slate-400">
                Active Monitoring
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Guardian
              </p>

              <p className="text-sm font-semibold text-slate-700 truncate">
                {user?.guardian_name || "—"}
              </p>

              <p className="text-[11px] text-slate-400 truncate">
                {user?.guardian_email || "—"}
              </p>
            </div>
          )}

          <div className="my-3 h-px bg-slate-100" />

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

