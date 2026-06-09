import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  PlusCircle,
  BarChart3,
  LogOut,
  ChevronRight,
  Activity,
  Stethoscope
} from "lucide-react";

const DoctorSidebar = ({ menu }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const icons = {
    Dashboard: LayoutDashboard,
    Patients: Users,
    "Patient Monitoring": Users,
    "Create Prescription": PlusCircle,
    "My Prescriptions": FileText,
    Analytics: BarChart3,
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "D";

  return (
    <aside className="fixed left-0 top-0 h-screen w-[272px] flex flex-col z-50 bg-white/90 backdrop-blur-2xl border-r border-slate-100 shadow-[4px_0_32px_rgba(0,0,0,0.06)]">

      {/* ── Top gradient line ── */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-none"
        style={{ background: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }} />

      {/* ── Logo ── */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
          >
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1
              className="text-xl font-black tracking-tight text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg,#0BA5A4,#119DD8,#2563EB)" }}
            >
              RxGuardian
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              Doctor Portal
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 overflow-y-auto scrollbar-none">
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
                    {/* Active gradient background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 rounded-2xl"
                        style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Icon container */}
                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "bg-white/20"
                        : "bg-slate-100 group-hover:bg-slate-200"
                    }`}>
                      <Icon size={16} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"} />
                    </div>

                    <span className="relative z-10 flex-1">{item.name}</span>

                    {isActive && (
                      <ChevronRight size={14} className="relative z-10 text-white/70" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ── Profile Card ── */}
      <div className="p-4">
        <div className="rounded-[20px] border border-slate-100 bg-gradient-to-br from-slate-50 to-white shadow-sm p-4">

          {/* User row */}
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md"
              style={{ background: "linear-gradient(135deg,#0BA5A4,#119DD8,#2563EB)" }}
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.name || "Doctor"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || "doctor@email.com"}</p>
            </div>

            {/* Online dot */}
            <div className="flex-shrink-0 relative">
              <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 h-px bg-slate-100" />

          {/* Professional info */}
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status</p>
            <p className="text-sm font-semibold text-slate-700 truncate">
              {user?.specialization || "Medical Professional"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.license_number ? `License: ${user.license_number}` : "Licensed Physician"}
            </p>
          </div>

          {/* Divider */}
          <div className="my-3 h-px bg-slate-100" />

          {/* Status + logout row */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/doctor/login");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200"
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

export default DoctorSidebar;