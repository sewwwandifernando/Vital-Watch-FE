import React, { useEffect, useRef, useState } from "react";
import "../../assets/scss/components/Registration.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { ProgressBar } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { DatePicker } from "rsuite";
import {
  useCreatePatientMutation,
  useUpdatePatientMutation,
} from "../../store/api/allPatientApi";
import { useGetPatientByIdQuery } from "../../store/api/patientDataApi";
// import * as yup from "yup";
import "rsuite/dist/rsuite-no-reset.min.css";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  PatientregistrationPending,
  PatientregistrationSuccess,
  PatientregistrationFailed,
  resetPatientregistrationStatus,
} from "../../store/slices/patientRegSlice";
import {
  patientUpdatePending,
  patientUpdateSuccess,
  patientUpdateFailed,
  resetPatientUpdateStatus,
} from "../../store/slices/patientUpdateSlice";
import {
  useGetAvailableBedsQuery,
  useGetAdmitedPatientListQuery,
  useGetAdmitedPatientMatricesQuery,
} from "../../store/api/admittedPatientListApi";
import {
  useGetPatientListQuery,
  useGetAllPatientMatricesQuery,
} from "../../store/api/allPatientApi";

// const schema = yup.object({
//   // firstName: yup.string().required("Enter your first name"),
//   // lastName: yup.string().required("Enter your last name"),
//   // hospitalId:yup.string().required("Enter Hospital ID")
// });

function PatientRegistration() {
  const { id } = useParams();
  const {
    data: patientData,
    isLoading,
    isError,
  } = useGetPatientByIdQuery(id, { skip: !id });

  const { refetch: refetchPatientList } = useGetAdmitedPatientListQuery();
  const { refetch: refetchAllPatientList } = useGetPatientListQuery();
  const { refetch: refetchMatricess } = useGetAllPatientMatricesQuery();
  const { refetch: refetchAdmitedMatricess } =
    useGetAdmitedPatientMatricesQuery();

  const [updatePatient] = useUpdatePatientMutation(id);
  const { data: getbedid, isLoading: isLoadingBeds } =
    useGetAvailableBedsQuery();

  const navigate = useNavigate();
  console.log("data: ", patientData);
  const form = useForm({
    mode: "onTouched",
  });

  const { register, control, handleSubmit, formState, reset } = form;
  const { errors, isDirty, isValid, isSubmitting, isSubmitSuccessful } =
    formState;
  const [createPatient] = useCreatePatientMutation();
  const dispatch = useDispatch();
  const isEditing = !!id;
  const isNewPatient = !isEditing;

  const onSubmit = async (data, e) => {
    if (isNewPatient) {
      console.log("Registrayion fails ", data);
      dispatch(PatientregistrationPending());

      try {
        const response = await createPatient(data);

        if (response.error) {
          dispatch(PatientregistrationFailed(response.error.message));
          console.log("Registrayion fails ", response.error.messag);
          Swal.fire({
            icon: "error",
            title: "Registration failed!",
            // text: response.data.payload,
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "New Patient Added!",
            showConfirmButton: false,
            timer: 2000,
          });
          dispatch(PatientregistrationSuccess());
          reset();
          form.clearErrors();
          navigate("/home");
          refetchPatientList();
          refetchAllPatientList();
          refetchMatricess();
          refetchAdmitedMatricess();
        }
      } catch (err) {
        dispatch(PatientregistrationFailed("An error occurred"));
      }
    } else {
      try {
        // Include the id in the data being sent to the backend
        dispatch(patientUpdatePending());
        const updatedData = {
          id,
          ...data,
        };
        console.log(id);
        const response = await updatePatient({ id, updatedData });
        if (response.data.error && !response.data) {
          console.log("error log id ", id, updatedData);
          dispatch(patientUpdateFailed(response.error.message));
          Swal.fire({
            icon: "error",
            title: "Update failed!",
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          console.log("succes log id ", id, updatedData);
          Swal.fire({
            icon: "success",
            title: "Patient Updated!",
            showConfirmButton: false,
            timer: 2000,
          });
          dispatch(patientUpdateSuccess());
          reset();
          navigate("/home");
          refetchPatientList();
          refetchAllPatientList();
          refetchMatricess();
          refetchAdmitedMatricess();
        }
      } catch (err) {
        dispatch(patientUpdateFailed("An error occurred"));
        Swal.fire({
          icon: "error",
          title: "Update failed!",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    // Reset registration status when the component unmounts
    return () => {
      dispatch(resetPatientregistrationStatus());
      dispatch(resetPatientUpdateStatus());
    };
  }, [dispatch]);

  const onError = (errors) => {
    console.log("Form errors", errors);
  };

  const handleDatePickerClick = () => {
    const currentDate = new Date(); // You can customize this date

    if (currentDate instanceof Date && !isNaN(currentDate)) {
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      form.setValue("dateOfBirth", formattedDate);
    } else {
      // Handle the case where currentDate is not a valid Date object
      console.error("Invalid date");
    }
  };

  return (
    <div>
      <Navbar />
      {id ? ( 
        <div className="patient-reg-bred">
          <Link to="/home" className=" patient-reg-bred-link "> Home </Link> / <Link to = {`/patientDetails/${patientData?.payload?.id}`} className=" patient-reg-bred-link " > Patient Details </Link> / Patient Update / {patientData?.payload?.hospitalId}
        </div>
      ) : (
        <div className="patient-reg-bred">
          <Link to="/home">Home </Link> / <Link> Patient Registration </Link>
      </div>
      )}
      <div className="parag-main-con">
        <div className="parag-profile">
          {isLoading ? (
            <div
              style={{
                width: "100%",
                height: "100vh",
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
          ) : isError ? (
            <div> Error.. </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
              <input
                type="hidden"
                id="bloodGroup"
                {...register("bloodGroup")}
                defaultValue={patientData?.payload?.bloodGroup}
              />
              <input
                type="hidden"
                id="bedIId"
                {...register("bedIId")}
                defaultValue={patientData?.payload?.bedIId}
              />
              <input
                type="hidden"
                id="gender"
                {...register("gender")}
                defaultValue={patientData?.payload?.gender}
              />
              <div className="parag-profile-top">
                {id ? <h1>Patient Update</h1> : <h1>Patient Registration</h1>}
                <p>Profile</p>
              </div>
              <div className="profile-first-raw">
                <div className="profile-details">
                  <label>Hospital ID</label>
                  <input
                    type="text"
                    placeholder="C1004"
                    id="hospitalId"
                    {...register("hospitalId")}
                    defaultValue={patientData?.payload?.hospitalId}
                  />
                </div>

                <div className="profile-details">
                  <label>First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    {...register("firstName")}
                    defaultValue={patientData?.payload?.firstName}
                  />
                  <p className="signin-error">{errors.firstName?.message}</p>
                </div>
                <div className="profile-details">
                  <label>Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    defaultValue={patientData?.payload?.lastName}
                    {...register("lastName")}
                  />
                </div>
              </div>
              <div className="profile-first-raw">
                <div className="profile-details-ads">
                  <label>Address</label>
                  <input
                    type="text"
                    id="address"
                    defaultValue={patientData?.payload?.address}
                    {...register("address")}
                  />
                </div>
                <div className="profile-details">
                  <label>Telephone Number</label>
                  <input
                    type="text"
                    id="contactNo"
                    defaultValue={patientData?.payload?.contactNo}
                    {...register("contactNo")}
                  />
                </div>
              </div>
              <div className="profile-first-raw">
                <div className="profile-details">
                  <label>Bed Number</label>
                  <select name="bedId" {...register("bedId")}>
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
                <div className="profile-details">
                  <label>Gender</label>
                  <select name="gender" {...register("gender")} id="gender">
                    <option value=""></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="profile-details">
                  <label>Date of Birth</label>
                  {id ? (
                    <input
                      type="text"
                      id="dateOfBirth"
                      {...register("dateOfBirth")}
                      defaultValue={patientData?.payload?.dateOfBirth}
                    />
                  ) : (
                    <DatePicker
                      id="dateOfBirth"
                      name="dateOfBirth"
                      className="patient-dateOfBirth"
                      placeholder="YYYY-MM-DD"
                      format="yyyy-MM-dd"
                      onChange={(value) => {
                        if (value instanceof Date) {
                          form.setValue("dateOfBirth", value);
                        }
                      }}
                      onClick={handleDatePickerClick}
                      value={form.getValues("dateOfBirth")}
                    />
                  )}
                </div>
              </div>
              <div className="profile-first-raw">
                <div className="profile-details">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    {...register("bloodGroup")}
                    id="bloodGroup"
                  >
                    <option value=""></option>
                    <option value="O-">O-</option>
                    <option value="O+">O+</option>
                    <option value="A-">A-</option>
                    <option value="A+">A+</option>
                    <option value="B-">B+</option>
                    <option value="AB-">AB-</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
                <div className="profile-details">
                  <label>NIC</label>
                  <input
                    type="text"
                    id="nic"
                    {...register("nic")}
                    defaultValue={patientData?.payload?.nic}
                  />
                </div>
                <div className="profile-details">
                  <label>Email</label>
                  <input
                    type="text"
                    id="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    defaultValue={patientData?.payload?.email}
                  />
                </div>
              </div>
              <div className="gurdian">
                <p className="gurdian-p">Guardian</p>
                <div className="profile-first-raw">
                  <div className="profile-details-ads">
                    <label>Name</label>
                    <input
                      type="text"
                      id="guardianName"
                      {...register("guardianName")}
                      defaultValue={patientData?.payload?.guardianName}
                    />
                  </div>
                  <div className="profile-details">
                    <label>Contact</label>
                    <input
                      type="text"
                      id="guardianContactNo"
                      {...register("guardianContactNo")}
                      defaultValue={patientData?.payload?.guardianContactNo}
                    />
                  </div>
                </div>
                <div className="profile-first-raw">
                  <div className="profile-details-ads-gud">
                    <label>Address</label>
                    <input
                      type="text"
                      id="guardianAddress"
                      {...register("guardianAddress")}
                      defaultValue={patientData?.payload?.guardianAddress}
                    />
                  </div>
                </div>
              </div>
              <div className="gurdian">
                <p className="gurdian-p">Medical Details</p>
                <div className="profile-first-raw">
                  <div className="profile-details-ads-gud">
                    <label>Admitting Diagnosis</label>
                    <input
                      type="text"
                      id="diagnosis"
                      {...register("diagnosis")}
                      defaultValue={patientData?.payload?.diagnosis}
                    />
                  </div>
                </div>
              </div>
              <div className="btm-1">
                <div className="parag-btm-cancel">
                  <Link to="/home">
                    <button type="button">
                      <p>Cancel</p>
                    </button>
                  </Link>
                </div>
                <div className="parag-btm-reg">
                  {id ? (
                    <button
                      type="submit"
                      disabled={!isDirty || !isValid || isSubmitting}
                    >
                      <p>Update</p>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isDirty || !isValid || isSubmitting}
                    >
                      <p>Register</p>
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
          <DevTool control={control} />
        </div>
      </div>
    </div>
  );
}
export default PatientRegistration;
