import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from "react";
import Login from "./pages/User/Login";
import PatientRegistration from "./pages/Patient/PatientRegistration";
import Navbar from "./components/common/Navbar";
import UserRegistration from "./pages/User/UserRegistration";
import AllPatients from "./components/patient/AllPatients";
import Error from "./pages/Error/Error";
import PatientDetails from "./pages/Patient/PatientDetails";
import Home from "./pages/Home/Home";
import AddVitalSigns from "./components/patient/AddVitalSigns";
import Users from "./components/user/Users";
import ChangePassword from "./components/user/ChangePassword";

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="patientReg" element={<PatientRegistration />} />
        <Route path="/PatientRegistration/:id" element={<PatientRegistration />} />
        <Route path="patientDetails/editPatient/:id" element={<PatientRegistration />} />
        <Route path="navbar" element={<Navbar />} />
        <Route path="home" element={<Home />} />
        <Route path="signIn" element={<UserRegistration />} />
        <Route path="allPatients" element={<AllPatients />} />
        <Route path="users" element={<Users />} />
        <Route path="/patientDetails/:id" element={<PatientDetails />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="addVitalsigns" element={<AddVitalSigns />} />
        <Route path="/edit/:id" element={<UserRegistration />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
