import Sidebar from "../components/common/Sidebar";

const GuardianLayout = ({ children }) => {

  // =====================================
  // GUARDIAN SIDEBAR MENU
  // =====================================

  const menu = [

    {
      name: "Dashboard",
      path: "/guardian/dashboard"
    },

    {
      name: "Guardian Alerts",
      path: "/guardian/alerts"
    },

    {
      name: "Patient Status",
      path: "/guardian/patient-status"
    },

    {
      name: "Reports",
      path: "/guardian/reports"
    }
  ];

  return (

    <div className="flex">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <Sidebar menu={menu} />

      {/* ================================= */}
      {/* MAIN CONTENT */}
      {/* ================================= */}

      <div className="
      ml-64
      p-10
      w-full
      bg-[#edf4fb]
      min-h-screen
      ">

        {children}

      </div>

    </div>
  );
};

export default GuardianLayout;