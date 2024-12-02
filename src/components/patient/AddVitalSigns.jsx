import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import '../../assets/scss/components/AddVitalSigns.css';
import { useAddVitalSignsMutation,useGetPatientByIdQuery} from "../../store/api/patientDataApi";
import { addVitalSignsPending , addVitalSignsFailed , addVitalSignsSuccess , resetaddVitalSignsStatus }  from "../../store/slices/patientDataSlice";
import { useParams } from 'react-router-dom';
import { useGetPatientVitalsIdQuery } from "../../store/api/patientDataApi";


function AddVitalSigns({ onClose }) {
  const { id } = useParams();
  const { data: patientData} = useGetPatientByIdQuery(id);
  const { refetch: refetchData,} = useGetPatientVitalsIdQuery(id);

  const form = useForm({
    mode: "onTouched",
  });

  const { register, control, handleSubmit, formState, reset } = form;
  const { errors, isDirty, isValid, isSubmitting, isSubmitSuccessful } =
    formState;

  const [addVital, { isLoading, error }] = useAddVitalSignsMutation();
  const dispatch = useDispatch();
  // const registrationStatus = useSelector(
  //   (state) => state.userReg.registrationStatus
  // );

  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log(data);
    dispatch(addVitalSignsPending()); // Set registration status to "loading"

    try {
      const response = await addVital(data);

      if (response.error) {
        // Handle registration failure
        dispatch(addVitalSignsFailed(response.error.message));
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Add Vital Sings failed!',
        //   showConfirmButton: false,
        //   timer: 2500
        // });
      } else {
        // Handle registration success
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Add Vital Sings!',
        //   showConfirmButton: false,
        //   timer: 2000
        // });
        dispatch(addVitalSignsSuccess());
        reset(); // Reset the form
        form.clearErrors();
        // window.location.reload();
        onClose();
        refetchData();

      }
    } catch (err) {
      // Handle unexpected errors
      dispatch(addVitalSignsFailed("An error occurred"));
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
      dispatch(resetaddVitalSignsStatus());
    };
  }, [dispatch]);

  const onError = (errors) => {
    console.log("Form errors", errors);
  };

  return (
    <div className="vitalsigns-main">
      <div className="vitalsigns-top">Add Vital Signs</div>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <input
          type="hidden"
          id="hospitalId"
          {...register("hospitalId")}
          defaultValue={
            patientData && patientData.payload && patientData.payload.hospitalId
          }
        />
        <input
          type="hidden"
          id="PatientId"
          {...register("PatientId")}
          defaultValue={
            patientData && patientData.payload && patientData.payload.id
          }
        />
        <div className="vitalsigns-mid">
          <div className="vitalsigns-mid-left">
            {/* <div className="vitalsigns-mid-box">
              <label>Date/Time</label>
              <input type="text" id="date/time" {...register("date/time")} />
            </div> */}
            <div className="vitalsigns-mid-box">
              <label>Supplemental O2 (%)</label>
              <input
                type="text"
                id="supplemented_O2"
                {...register("supplemented_O2")}
              />
            </div>
            <div className="vitalsigns-mid-box ">
              <label>Blood Pressure (mmHg)</label>
              <div className="bloodpressure">
                <input
                  type="text"
                  placeholder="Systolic BP"
                  id="systolicBP"
                  {...register("systolicBP")}
                />
                <input
                  type="text"
                  placeholder="Diastolic BP"
                  id="diastolicBP"
                  {...register("diastolicBP")}
                />
              </div>
            </div>
            <div className="vitalsigns-mid-box">
              <label>Level of Consciousnes (AVPU Score)</label>
              <select
                name="avpuScore"
                className="Ad-bed-input"
                placeholder="Select a Bed"
                {...register("avpuScore")}
              >
                <option value="volvo"></option>
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
              </select>
            </div>
          </div>
          <div className="vitalsigns-mid-mid">
            <div className="vitalsigns-mid-box">
              <label>Heart Rate (BPM)</label>
              <input type="text" id="heartRate" {...register("heartRate")} />
            </div>
            <div className="vitalsigns-mid-box">
              <label>02 Saturation (%)</label>
              <input
                type="text"
                id="O2saturation"
                {...register("O2saturation")}
              />
            </div>
          </div>
          <div className="vitalsigns-mid-right">
            <div className="vitalsigns-mid-box">
              <label>Respiratory Rate (Cycles / Min)</label>
              <input
                type="text"
                id="respiratoryRate"
                {...register("respiratoryRate")}
              />
            </div>
            <div className="vitalsigns-mid-box">
              <label>Temperature (°C)</label>
              <input
                type="text"
                id="temperature"
                {...register("temperature")}
              />
            </div>
          </div>
        </div>
        <div className="vitalsigns-bot">
          <div className="vitalsigns-submit-but">
            <button
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              Submit
            </button>
          </div>
          <div className="vitalsigns-cancel-but">
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddVitalSigns