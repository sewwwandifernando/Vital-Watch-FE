import React, { useState } from "react";
import Swal from "sweetalert2";
import "../../assets/scss/pages/PatientDetails.css";
import ComponentA from "./PatientDetailsVitalSigns";
import ComponentB from "../../pages/Error/Error";
import ComponentC from "../../pages/Error/Error";
import { useUseUpdatePatientIDMutation,useGetPatientByIdQuery } from "../../store/api/patientDataApi";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "rsuite";
import { useForm } from "react-hook-form";
import { useGetAvailableBedsQuery ,useGetAdmitedPatientListQuery} from "../../store/api/admittedPatientListApi";
import { useUsePatientreAdmitIDMutation } from "../../store/api/patientDataApi";
import { useGetPatientListQuery } from "../../store/api/allPatientApi";

function PatientDetailsVitals() {
  const { id } = useParams();
  const { data: patients, isLoading, isError , refetch: refetchparient } = useGetPatientByIdQuery(id);
  const status = patients && patients.payload && patients.payload.status;
  const { refetch : refetchadmitedPatient } = useGetAdmitedPatientListQuery();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [DischargePatientIDMutation] = useUseUpdatePatientIDMutation(id);
  const [selectedComponent, setSelectedComponent] = useState(<ComponentA />);
  const [activeButton, setActiveButton] = useState("vitalSigns");
  const navigate = useNavigate();
  const { data: getbedid, isLoading: isLoadingBeds } = useGetAvailableBedsQuery();
  const [pattientReadmit] = useUsePatientreAdmitIDMutation(id);
  const { refetch: refetchallpatient } = useGetPatientListQuery();

  const form = useForm({
    mode: "onTouched",
  });

  const { register, handleSubmit, formState, reset } = form;

  const handleDischarge = async (data) => {
    try {
      const response = await DischargePatientIDMutation(id);
      if (response.error) {
        console.log("Discharge failed", response.data);
        Swal.fire({
          icon: "error",
          title: "Discharge failed!",
          showConfirmButton: false,
          timer: 3500,
        });
        refetchparient();
      } else {
        Swal.fire({
          icon: "success",
          title: "Discharged",
          showConfirmButton: false,
          timer: 2000,
        });

        // navigate("/home");
        refetchparient();
        refetchadmitedPatient();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const onSubmit = async (data) => {
    try {
      handleClose();
      const response = await pattientReadmit({ id, data });
      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "Re admit failed!",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Re admit success",
          showConfirmButton: false,
          timer: 2000,
        });
        // navigate("/home");
        refetchparient();
        refetchadmitedPatient();
        refetchallpatient();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const App = () => {
    return (
      <>
        <Modal open={open} onClose={handleClose} style={{ top: "100px" }}>
          <Modal.Header>
            <Modal.Title>
              <h4> Patient Re Admit</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label>Bed No</label>
                  <select
                    className="readmit-bed"
                    name="bedId"
                    {...register("bedId")}
                    style={{
                      height: "40px",
                      borderStyle: "none ",
                      border: "solid 0.5px #7a7a7a ",
                      borderRadius: "5px",
                      paddingLeft: "10px ",
                      marginBottom: "10px",
                    }}
                  >
                    {isLoadingBeds ? (
                      <option>Loading beds...</option>
                    ) : Array.isArray(getbedid.payload) ? (
                      getbedid.payload.map((bed) => (
                        <option value={bed.id}>{bed.bedNo}</option>
                      ))
                    ) : (
                      <option>No beds available</option>
                    )}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label>Diagnosis</label>
                  <input
                    type="text"
                    id="diagnosis"
                    {...register("diagnosis")}
                    style={{
                      height: "40px",
                      borderStyle: "none ",
                      border: "solid 0.5px #7a7a7a ",
                      borderRadius: "5px",
                      paddingLeft: "10px",
                      marginBottom:"15px"
                    }}
                  />
                </div>
                <Modal.Footer>
                  <Button
                    color="violet"
                    appearance="primary"
                    style={{ width: "80px" }}
                    type="submit"
                    // onClick={handleClose}
                  >
                   Re Admit
                  </Button>
                  <Button
                    onClick={handleClose}
                    appearance="primary"
                    color="red"
                    style={{ width: "80px" }}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  };
  const renderComponent = (component, buttonId) => {
    setSelectedComponent(component);
    setActiveButton(buttonId);
  };

  return (
    <div className="patientdetails-vitals">
      <div className="patientdetails-vitals-top">
        <div className="patientdetails-vitals-selection">
          <button
            className={`btn btn-light ${
              activeButton === "vitalSigns" ? "active" : ""
            }`}
            onClick={() => renderComponent(<ComponentA />, "vitalSigns")}
          >
            Vital Signs
          </button>
          <button
            className={`btn btn-light ${
              activeButton === "inputOutput" ? "active" : ""
            }`}
            onClick={() => renderComponent(<ComponentB />, "inputOutput")}
          >
            Input/Output
          </button>
          <button
            className={`btn btn-light ${
              activeButton === "medicationChart" ? "active" : ""
            }`}
            onClick={() => renderComponent(<ComponentC />, "medicationChart")}
          >
            Medication Chart
          </button>
        </div>
        <div className="patientdetails-vitals-dis">
          {status === "Discharged" ? (
            <button className="btn btn-danger discharge" onClick={handleOpen}>
              ReAdmit
            </button>
          ) : (
            <button
              className="btn btn-danger discharge"
              onClick={handleDischarge}
            >
              Discharge
            </button>
          )}
          {open && (
            <div className="popup">
              <App onClose={handleClose} />
            </div>
          )}
        </div>
      </div>
      <div className="patientdetails-vitals-btm">{selectedComponent}</div>
    </div>
  );
}

export default PatientDetailsVitals;
