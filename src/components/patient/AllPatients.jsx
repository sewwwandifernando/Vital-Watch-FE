import React, { useState, useEffect } from "react";
import "../../assets/scss/components/PatientList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBar } from "react-loader-spinner";
import Swal from "sweetalert2";
import {
  faMagnifyingGlass,
  faPen,
  faTrash,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  useGetPatientListQuery,
  useDeletePatientMutation,
  useGetAllPatientMatricesQuery,
} from "../../store/api/allPatientApi";
import { useGetUserDataQuery } from "../../store/api/userListApi"


const AllPatients = () => {
  const { data: patients, isLoading, isError , refetch: refetchPatient} = useGetPatientListQuery();
  const [deletePatientMutation] = useDeletePatientMutation();
  const { data: patientMatrices ,  refetch : refetchMatricess } = useGetAllPatientMatricesQuery();
  const { data : loguser} =  useGetUserDataQuery();
  
  const role = loguser?.payload?.role;
  // console.log("user role ",role);

  const [patientList, setPatientList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState(""); // Initialize searchQuery state

  useEffect(() => {
    if (!isLoading && !isError) {
      setPatientList(patients.payload || []);
    }
  }, [isLoading, isError, patients]);


  const handleDeletePatient = (patientId) => {
    Swal.fire({
      title: 'Do you want to delete this patient?',
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Delete Patient',
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion, perform the deletion
        deleteConfirmedPatient(patientId);
      } else if (result.isDenied) {
        // User canceled the deletion
        Swal.fire('Deletion canceled', '', 'info');
      }
    });
  };
  
  const deleteConfirmedPatient = async (patientId) => {
    try {
      const response = await deletePatientMutation(patientId);
     
      if (response.error) {
        console.log("error test " , response )
        // Handle the error response from the backend and display it in SweetAlert
        Swal.fire('', response.error.data.payload, 'error');
      } else {
        // Successful deletion
        // Update the patient list and show a success message
        refetchPatient();
        refetchMatricess();
        Swal.fire('Patient deleted', '', 'success');
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      Swal.fire('Error deleting patient', '', 'error');
    }
  };
  
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Create a filtered patient list based on the search query
  const filteredPatientList = patientList.filter((patient) =>
    `${patient.hospitalId} ${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Update the patientList state based on the search query
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="ptntlist-con">
      <div className="ptntlist-top">
        <div className="ptntlist-head">ALL PATIENTS</div>
        <div className="ptntlist-top-search">
          <input
            type="text"
            placeholder="Search by Hospital ID or Name"
            value={searchQuery} // Controlled input
            onChange={handleSearchChange} // Handle search input change
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
          <p className="ptntlist-mid-type">Total</p>
          <p className="ptntlist-mid-count">
            {patientMatrices?.payload.all}
          </p>
        </div>
        <div className="ptntlist-mid-values">
          <p className="ptntlist-mid-type">Admitted</p>
          <p className="ptntlist-mid-count">
            {patientMatrices?.payload.admitted}
          </p>
        </div>
        <div className="ptntlist-mid-values">
          <p className="ptntlist-mid-type">Discharged</p>
          <p className="ptntlist-mid-count">
          {patientMatrices?.payload.discharged}
          </p>
        </div>
      </div>
      <div className="ptntlist-btm">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: "8%", textAlign: "center" }}>#</th>
              <th
                onClick={() => requestSort("date")}
                style={{ width: "12%", textAlign: "center" }}
              >
                ADMITTED DATE
              </th>
              <th
                onClick={() => requestSort("id")}
                style={{ width: "10%", textAlign: "center" }}
              >
                Hospital ID
              </th>
              <th
                onClick={() => requestSort("name")}
                style={{ width: "22%", textAlign: "left", paddingLeft: "3%" }}
              >
                PATIENT
              </th>
              <th
                onClick={() => requestSort("diagnosis")}
                style={{ width: "20%", textAlign: "left", paddingLeft: "1%" }}
              >
                Date Of Birth
              </th>
              <th
                onClick={() => requestSort("status")}
                style={{ width: "13%", textAlign: "left", paddingLeft: "0%" }}
              >
                STATUS
              </th>
              <th style={{ width: "15%" }}>ACTIONS</th>
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
            ) : filteredPatientList.length > 0 ? ( // Render the filtered list
              filteredPatientList.map((patient, index) => (
                <tr className="hover-row" key={patient.id}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td style={{ textAlign: "center" }}>{patient.createdAt}</td>
                  <td style={{ textAlign: "center" }}>{patient.hospitalId}</td>
                  <td style={{ textAlign: "left", paddingLeft: "3%" }}>
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td style={{ textAlign: "left", paddingLeft: "1%" }}>
                    {patient.dateOfBirth}
                  </td>
                  <td style={{ textAlign: "left", paddingLeft: "0%" }}>
                    {patient.status}
                  </td>
                  <td>
                    <Link to={`/PatientRegistration/${patient.id}`}>
                      <button className="btn btn-outline-primary">
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    </Link>
                    <button
                      className="btn btn-outline-danger ptntlist-table-delete"
                      onClick={() => handleDeletePatient(patient.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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

export default AllPatients;
