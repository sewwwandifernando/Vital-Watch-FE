import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import '../../assets/scss/pages/PatientDetails.css';
import { Link } from 'react-router-dom';
import { useGetPatientByIdQuery } from "../../store/api/patientDataApi"
import { useParams } from 'react-router-dom';
import { ProgressBar } from "react-loader-spinner";

function PatientDetailsBio() {
  const { id } = useParams();

  // Fetch patient data by ID using the query
  const { data: patientData, isLoading, isError  } = useGetPatientByIdQuery(id);
  console.log("dob",patientData?.payload.dateOfBirth)

  const dateOfBirth  =   patientData?.payload.dateOfBirth ;
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();
  const ageInMilliseconds = currentDate - dob;
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const msPerMonth = msPerYear / 12;
  const years = Math.floor(ageInMilliseconds / msPerYear);
  const months = Math.floor((ageInMilliseconds % msPerYear) / msPerMonth);
  const days = Math.floor((ageInMilliseconds % msPerMonth) / (1000 * 60 * 60 * 24));

  console.log(`Your age is approximately ${years}Y ${months}M ${days}D.`);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ProgressBar
          height="80"
          width="80"
          barColor="#766EAC"
          borderColor="#000000"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading patient data</div>;
  }

  return (
    <div className='patientdetails-bio'>
      <div className='patientdetails-bio-con'>
        <h2>Hospital ID</h2>
        <p>{patientData && patientData.payload && patientData.payload.hospitalId}</p>
      </div>
      <div className='patientdetails-bio-con'>
        <h2>Name</h2>
        <p>{patientData && patientData.payload && patientData.payload.firstName}</p>
      </div>
      <div className='patientdetails-bio-con'>
        <h2>Age</h2>
        <p>{years}Y {months}M {days}D</p>
      </div>
      <div className='patientdetails-bio-con'>
        <h2>Diagnosis</h2>
        <p>{patientData && patientData.payload && patientData.payload.diagnosis}</p>
      </div>
      <div className='patientdetails-bio-con'>
        <h2>Blood Group</h2>
        <p>{patientData && patientData.payload && patientData.payload.bloodGroup}</p>
      </div>
      <Link to={`/patientDetails/editPatient/${patientData?.payload?.id}`}>
        <button className='btn btn-outline-dark'>
          <FontAwesomeIcon icon={faPen} />
        </button>
      </Link>
    </div>
  );
}
export default PatientDetailsBio;
