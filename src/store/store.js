import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { authApi } from "./api/authApi";
import userRegSlice from "./slices/userRegSlice";
import { userRegApi } from "./api/userRegApi";
import userListSlice from "./slices/userListSlice";
import { userListApi } from "./api/userListApi";
import { allpatientSlice } from "./slices/allpatientSlice"
import { admittedPatientListSlice } from "./slices/admittedPatientListSlice"
import { admittedPatientListApi } from "./api/admittedPatientListApi"
import { allpatientApi } from "./api/allPatientApi"
import { patientRegSlice } from "./slices/patientRegSlice"
import { patientDataSlice } from "./slices/patientDataSlice"
import { patientDataApi } from "./api/patientDataApi"
import api from '../store/api/api';
import { patientUpdateSlice } from "./slices/patientUpdateSlice"
import { userUpdatesSlice } from "./slices/userUpdateslice"
  
export const store = configureStore({
  reducer: {
    auth: authSlice,
    userReg: userRegSlice,
    userList: userListSlice,
    patientList: allpatientSlice,
    admittedPatientList: admittedPatientListSlice,
    PatientReg: patientRegSlice,
    patientData: patientDataSlice,
    patientUpdate: patientUpdateSlice,
    userUpdate: userUpdatesSlice,

    [authApi.reducerPath]: authApi.reducer,
    [userRegApi.reducerPath]: userRegApi.reducer,
    [userListApi.reducerPath]: userListApi.reducer,
    [admittedPatientListApi.reducerPath]: admittedPatientListApi.reducer,
    [allpatientApi.reducerPath]: allpatientApi.reducer,
    [patientDataApi.reducerPath]: patientDataApi.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      userRegApi.middleware,
      authApi.middleware,
      userListApi.middleware,
      admittedPatientListApi.middleware,
      allpatientApi.middleware,
      patientDataApi.middleware,
      api.middleware,
    );
  },
});
