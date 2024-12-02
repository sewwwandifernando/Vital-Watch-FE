import React from 'react'
import '../../assets/scss/pages/PatientDetails.css';
import PatientDetailsBio from '../../components/patient/PatientDetailsBio';
import PatientDetailsVitals from '../../components/patient/PatientDetailsVitals';
import Navbar from '../../components/common/Navbar';
import { Link } from "react-router-dom";


function PatientDetails() {
  return (
    <div>
      <Navbar />
      <div className="patientdetails-bred">
        <Link to="/home">Home </Link> / <Link> Patient Details </Link>
      </div>
      <div className="patientdetails-main-con">
        <PatientDetailsBio />
        <PatientDetailsVitals />
      </div>
    </div>
  );
}

export default PatientDetails