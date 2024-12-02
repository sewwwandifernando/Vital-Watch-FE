import React, { useState, useEffect } from "react";
import "../../assets/scss/components/PatientList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBar } from "react-loader-spinner";
import {
  faMagnifyingGlass,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  useGetAdmitedPatientListQuery,
  useGetAdmitedPatientMatricesQuery,
} from "../../store/api/admittedPatientListApi";
import { useGetUserDataQuery } from '../../store/api/userListApi';

const AdmittedPatients = () => {
  const {data: admittedPatients,isLoading,isError} = useGetAdmitedPatientListQuery();
  const { data: admittedPatientMatrices } = useGetAdmitedPatientMatricesQuery();
  const { data : userRole} = useGetUserDataQuery();
  const role = userRole?.payload.role;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState(""); // Initialize searchQuery state

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Create a filtered patient list based on the search query
  const filteredAdmittedPatients =
    admittedPatients && admittedPatients.payload
      ? admittedPatients.payload.filter((patient) =>
          `${patient.id} ${patient.firstName} ${patient.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : [];

  // Update the admittedPatients state based on the search query
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  return (
    <div className="ptntlist-con">
      <div className="ptntlist-top">
        <div className="ptntlist-head">ADMITTED PATIENTS</div>
        <div className="ptntlist-top-search">
          <input
            type="text"
            placeholder="Search by Hospital ID or Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="ptntlist-top-search-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        {role === 'Admin' && (
          <Link to="/patientReg" style={{ textDecoration: "none" }}>
            <button className="btn btn-dark ptntlist-top-add">Add Patient</button>
          </Link>
        )}
      </div>
      <div className="ptntlist-mid">
        <div className="ptntlist-mid-values">
          <p className="ptntlist-mid-type">Admitted</p>
          <p className="ptntlist-mid-count">
            {admittedPatientMatrices &&
              admittedPatientMatrices.payload &&
              admittedPatientMatrices.payload.admitted}
          </p>
        </div>
        <div className="ptntlist-mid-values">
          <p className="ptntlist-mid-type">Alerts</p>
          <p className="ptntlist-mid-count">05</p>
        </div>
        <div className="ptntlist-mid-values">
          <p className="ptntlist-mid-type">Pending Medications</p>
          <p className="ptntlist-mid-count">08</p>
        </div>
      </div>
      <div className="ptntlist-btm">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: "8%" }}>#</th>
              <th
                onClick={() => requestSort("name")}
                style={{ width: "22%", textAlign: "left", paddingLeft: "3%" }}
              >
                PATIENT
              </th>
              <th onClick={() => requestSort("id")} style={{ width: "10%" }}>
                BED NO.
              </th>
              <th
                onClick={() => requestSort("treatment")}
                style={{ width: "20%", textAlign: "left", paddingLeft: "4%" }}
              >
                CURRENT DIAGNOSIS
              </th>
              <th onClick={() => requestSort("date")} style={{ width: "20%" }}>
                DATE
              </th>
              <th
                onClick={() => requestSort("status")}
                style={{ width: "10%", textAlign: "left", paddingLeft: "3%" }}
              >
                ALERTS
              </th>
              <th style={{ width: "10%" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7">
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
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="7">Error...</td>
              </tr>
            ) : filteredAdmittedPatients.length > 0 ? (
              filteredAdmittedPatients.map((patient, index) => (
                <tr className="hover-row" key={patient.id}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: "left", paddingLeft: "3%" }}>
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td>{patient.id}</td>
                  <td style={{ textAlign: "left", paddingLeft: "4%" }}>
                    {patient.diagnosis}
                  </td>
                  <td>{patient.createdAt}</td>
                  <td style={{ textAlign: "left", paddingLeft: "3%" }}>
                    {patient.status}
                  </td>
                  <td>
                    <Link to={`/patientDetails/${patient.id}`}>
                      <button className="btn btn-outline-dark">
                        <FontAwesomeIcon icon={faAngleRight} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdmittedPatients;
