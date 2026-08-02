import {

  Routes,

  Route

} from "react-router-dom";

// =====================================================
// LANDING PAGES
// =====================================================

import LandingPage from
"./pages/Landing/LandingPage";

import RoleSelection from
"./pages/Landing/RoleSelection";

// =====================================================
// AUTH PAGES
// =====================================================

import Register from
"./pages/Auth/Register";

import Login from "./pages/Auth/Login";

// =====================================================
// PATIENT PAGES
// =====================================================

import PatientDashboard from
"./pages/Patient/PatientDashboard";

import TodayMedicines from
"./pages/Patient/TodayMedicines";

import Prescriptions from
"./pages/Patient/Prescriptions";

import UploadMedicine from
"./pages/Patient/UploadMedicine";

import MedicineAgent from
"./pages/Patient/MedicineAgent";

import MedicineHistory
from "./pages/Patient/MedicineHistory";

import VerificationResult from "./pages/Patient/VerificationResult";

// =====================================================
// DOCTOR PAGES
// =====================================================

import DoctorDashboard from
"./pages/Doctor/DoctorDashboard";

import CreatePrescription from
"./pages/Doctor/CreatePrescription";

import Patients
from "./pages/Doctor/Patients";

import Analytics
from "./pages/Doctor/Analytics";

import PatientAdherenceDashboard from
"./pages/Doctor/PatientAdherenceDashboard";

// =====================================================
// GUARDIAN PAGES
// =====================================================

import GuardianDashboard from
"./pages/Guardian/GuardianDashboard";

import GuardianAlerts from
"./pages/Guardian/GuardianAlerts";

import PatientStatus
from "./pages/Guardian/PatientStatus";

import Reports
from "./pages/Guardian/Reports";



// =====================================================
// APP
// =====================================================

function App() {

  return (

      <Routes>

        {/* ================================= */}
        {/* LANDING */}
        {/* ================================= */}

        <Route

          path="/"

          element={<LandingPage />}
        />

        <Route

          path="/roles"

          element={<RoleSelection />}
        />

        {/* ================================= */}
        {/* AUTH */}
        {/* ================================= */}

        <Route

          path="/register"

          element={<Register />}
        />

        <Route path="/login" element={<Login />} />

        {/* ================================= */}
        {/* PATIENT */}
        {/* ================================= */}

        <Route

          path="/patient/dashboard"

          element={<PatientDashboard />}
        />

        <Route

          path="/patient/today-medicines"

          element={<TodayMedicines />}
        />

        <Route

          path="/patient/prescriptions"

          element={<Prescriptions />}
        />

        <Route

          path="/patient/upload-medicine"

          element={<UploadMedicine />}
        />

        <Route

          path="/patient/medicine-agent"

          element={<MedicineAgent />}
        />

        <Route
          path="/patient/history"
          element={<MedicineHistory />}
        />

        <Route

            path="/patient/verification-result"

            element={<VerificationResult />}
        />

        {/* ================================= */}
        {/* DOCTOR */}
        {/* ================================= */}

        <Route

          path="/doctor/dashboard"

          element={<DoctorDashboard />}
        />

        <Route

          path="/doctor/create-prescription"

          element={<CreatePrescription />}
        />
        <Route
          path="/doctor/patients"
          element={<Patients />}
        />

        <Route
          path="/doctor/analytics"
          element={<Analytics />}
        />

        <Route
          path="/doctor/patient-adherence"
          element={<PatientAdherenceDashboard />}
        />

        {/* ================================= */}
        {/* GUARDIAN */}
        {/* ================================= */}

        <Route

          path="/guardian/dashboard"

          element={<GuardianDashboard />}
        />

        <Route

          path="/guardian/alerts"

          element={<GuardianAlerts />}
        />

        <Route
          path="/guardian/patient-status"
          element={<PatientStatus />}
        />

        <Route
          path="/guardian/reports"
          element={<Reports />}
        />

      </Routes>

  );
}

export default App;