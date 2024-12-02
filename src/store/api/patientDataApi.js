import { api } from './api';

  export const patientDataApi = api.injectEndpoints({
    reducerPath: "patientDataApi",
    endpoints: (build) => ({
      getPatientById: build.query({
        // query: (PatientId) => `vitals/${PatientId}`, // Define the endpoint with ID parameter
        query: (id) => `patient/byId/${id}`, // Define the endpoint with ID parameter
        // query: () => "pationList",
      }),
      addVitalSigns: build.mutation({
        query: (credentials) => ({
          url: "vitals/addVitals",
          // url: "pationList",
          method: "POST",
          body: credentials, // This should include the username and password
        }),
      }),
      getPatientVitalsId: build.query({
        query: (PatientId) => `vitals/${PatientId}`, // Define the endpoint with ID parameter
        // query: (id) => `patient/byId/${id}`, // Define the endpoint with ID parameter
        // query: () => "pationList",
      }),
      useUpdatePatientID: build.mutation({
        query: (id) => ({
          url: `patient/dischargePatient/${id}`,
          method: "PATCH",
        }),
      }),
      usePatientreAdmitID: build.mutation({
        query: ({id, data}) => ({
          url: `patient/reAdmit/${id}`,
          method: "POST",
          body: data,
        }),
      }),
    }),
  });

export const {  useGetPatientByIdQuery ,
                useAddVitalSignsMutation, 
                useGetPatientVitalsIdQuery,  
                useUseUpdatePatientIDMutation,
                useUsePatientreAdmitIDMutation} =
                patientDataApi;

