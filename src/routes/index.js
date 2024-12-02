import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"
import Login from "../components/Login"
import User from "../components/User"
import PatientRegistration from "../components/PatientRegistration"
import Navbar from "../components/Navbar"
import Home from "../pages/Home"
import UserRegistration from "../components/UserRegistration"
import AllPatients from "../components/AllPatients"
import PatientDetails from "../pages/PatientDetails"
import Error from "../components/Error"

// // Authentication related pages
// import Login from "../pages/Authentication/Login"
// import Logout from "../pages/Authentication/Logout"
// import Register from "../pages/Authentication/Register"
// import ForgetPwd from "../pages/Authentication/ForgetPassword"

// // Dashboard
// import Dashboard from "../pages/Dashboard/index"

 const authProtectedRoutes = [
//   { path: "/dashboard", component: <Dashboard/> },
//   { path: "/profile", component: <UserProfile/> },
//    {
//     path: "/",
//     exact: true,
//     component: < Navigate to="/dashboard" />,
//   },
 ]

const publicRoutes = [
  { path: "/", component: <Login /> },
  { path: "/user", component: <User /> },
  { path: "/patientReg", component: <PatientRegistration /> },
  { path: "/navbar", component: <Navbar /> },
  { path: "/home", component: <Home /> },
  { path: "/signIn", component: <UserRegistration /> },
  { path: "/allPatients", component: <AllPatients /> },
  { path: "/patientDetails", component: <PatientDetails /> },
  { path: "*", component: <Error /> },
]

export { authProtectedRoutes, publicRoutes }

