// TableView.js
import React from "react";
import { useGetPatientVitalsIdQuery } from "../../store/api/patientDataApi";
import { useParams } from "react-router-dom";
import { ProgressBar } from "react-loader-spinner";


function TableView({ filteredData }) {
  const { id } = useParams();

  // Fetch patient data by ID using the query
  const {
    data: patientdata,
    isLoading,
    isError,
  } = useGetPatientVitalsIdQuery(id);

  if (isLoading) {
    return   <div
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
  </div>;
  }

  if (isError) {
    return <div>Error loading patient data</div>;
  }
  return (
    <div className="vitalsigns-btm-table">
      <table className="table table-hover">
        <thead>
          <tr style={{ textAlign: "center" }}>
            <th style={{ width: "8%", paddingBottom: "25px" }}>
              <span className="vital-table-column">Date</span>
            </th>
            <th style={{ width: "8%", paddingBottom: "25px" }}>
              <span className="vital-table-column">Time</span>
            </th>
            <th style={{ width: "10%" }}>
              <div>
                <span className="vital-table-column">HR</span>
                <br />
                <span className="vital-table-unit">(BMP)</span>
              </div>
            </th>
            <th style={{ width: "12%" }}>
              <div>
                <span className="vital-table-column">Repository Rate</span>
                <br />
                <span className="vital-table-unit">(BMP)</span>
              </div>
            </th>
            <th style={{ width: "12%" }}>
              <div>
                <span className="vital-table-column">Supplemental O2</span>
                <br />
                <span className="vital-table-unit">(%)</span>
              </div>
            </th>
            <th style={{ width: "12%" }}>
              <div>
                <span className="vital-table-column">O2 Saturation</span>
                <br />
                <span className="vital-table-unit">(%)</span>
              </div>
            </th>
            <th style={{ width: "12%" }}>
              <div>
                <span className="vital-table-column">BP</span>
                <br />
                <span className="vital-table-unit">(mmHg)</span>
              </div>
            </th>
            <th style={{ width: "12%" }}>
              <div>
                <span className="vital-table-column">Temperature</span>
                <br />
                <span className="vital-table-unit">(°C)</span>
              </div>
            </th>
            <th style={{ width: "14%" }}>
              <div>
                <span className="vital-table-column">LOC</span>
                <br />
                <span className="vital-table-unit">(AVP Score)</span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7">Loading...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan="7">Error...</td>
            </tr>
          ) : patientdata && Array.isArray(patientdata.payload) ? ( // Check if it's an array
            patientdata.payload.map((patientdata, index) => (
              <tr
                className="hover-row"
                key={index}
                style={{ textAlign: "center" }}
              >
                <td>{patientdata.date}</td>
                <td>{patientdata.time}</td>
                <td>{patientdata.heartRate}</td>
                <td>{patientdata.respiratoryRate}</td>
                <td>{patientdata.supplementedO2}</td>
                <td>{patientdata.O2saturation}</td>
                <td>{patientdata.diastolicBP}</td>
                <td>{patientdata.temperature}</td>
                <td>{patientdata.avpuScore}</td>
              </tr>
            ))
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
