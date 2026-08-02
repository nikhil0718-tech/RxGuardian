import Sidebar from "../components/common/Sidebar";

const DoctorLayout = ({ children }) => {

  // =====================================
  // DOCTOR SIDEBAR MENU
  // =====================================

const menu = [
  {
    name: "Dashboard",
    path: "/doctor/dashboard"
  },
  {
    name: "Patients",
    path: "/doctor/patients"
  },
  {
    name: "Create Prescription",
    path: "/doctor/create-prescription"
  },
  {
    name: "Analytics",
    path: "/doctor/analytics"
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

export default DoctorLayout;