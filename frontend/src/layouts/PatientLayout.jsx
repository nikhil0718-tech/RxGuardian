import Sidebar from "../components/common/Sidebar";
import RxGuardianAssistant from "../components/assistant/RxGuardianAssistant";

const PatientLayout = ({ children }) => {
  const menu = [
    {
      name: "Dashboard",
      path: "/patient/dashboard"
    },
    {
      name: "Today's Medicines",
      path: "/patient/today-medicines"
    },
    {
      name: "Prescriptions",
      path: "/patient/prescriptions"
    },
    {
      name: "AI Verification",
      path: "/patient/upload-medicine"
    },
    {
      name: "Medicine Agent",
      path: "/patient/medicine-agent"
    },
    {
      name: "History",
      path: "/patient/history"
    }
  ];

  return (
    <div className="flex bg-[#F8FAFC]">
      <Sidebar menu={menu} />

      <main
        className="
        ml-[280px]
        min-h-screen
        w-full
        bg-[#F8FAFC]
      "
      >
        {children}

        {window.location.pathname !== "/patient/medicine-agent" && (
  <RxGuardianAssistant />
)}
      </main>
    </div>
  );
};

export default PatientLayout;