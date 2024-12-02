import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faPhone,
  faUser,
  faUserAlt,
  faUserCircle,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/scss/pages/UserRegistration.css";
import { Loader, Placeholder } from "rsuite";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProgressBar } from "react-loader-spinner";
import Navbar from "../../components/common/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import { useRegisterUserMutation } from "../../store/api/userRegApi";
import {
  useGetUserbyidQuery,
  useUpdateUserMutation,
  useGetUserMatricesQuery,
  useGetAllUsersQuery,
} from "../../store/api/userListApi";
import {
  registrationFailed,
  registrationPending,
  registrationSuccess,
  resetRegistrationStatus,
} from "../../store/slices/userRegSlice";
import {
  userUpdatePending,
  userUpdateSuccess,
  userUpdateFailed,
  resetUserUpdateStatus,
} from "../../store/slices/userUpdateslice";

// const schema = yup.object ({
//   firstName: yup.string().required("Enter your first name"),
//   lastName: yup.string().required("Enter your last name"),
//   email: yup
//     .string()
//     .email("Email format is not valid")
//     .required("Enter your email"),
//   contactNo: yup.string().required("Enter contact number"),
//   username: yup.string().required("Enter username"),
//   password: yup.string().required("Enter a password"), //remove , when uncommenting below lines
//   // .min(8, "Password must have at least 8 characters")
//   // .matches(/[0-9]/, ("Password must have at least one number"))
//   // .matches(/[a-z]/, ("Password must have at least one lowercase"))
//   // .matches(/[A-Z]/, ("Password must have at least one uppercase")),
//   roleId: yup.string().required("Choose your role"),
// });

function UserRegistration() {
  const { id } = useParams();
  const {
    data: userdata,
    isLoading,
    isError,
  } = useGetUserbyidQuery(id, { skip: !id });
  const [updateUser] = useUpdateUserMutation(id);
  // console.log('data',userdata)
  const form = useForm({
    mode: "onTouched",
    // resolver: yupResolver(schema),
  });

  const { register, control, handleSubmit, formState, reset } = form;
  const { errors, isDirty, isValid, isSubmitting, isSubmitSuccessful } = formState;
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const { refetch : refetchMatricess } = useGetUserMatricesQuery();
  const { refetch : refetchAllusers } = useGetAllUsersQuery();
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const dispatch = useDispatch();
  const isEditing = !!id;
  const isNewUser = !isEditing;

  const onSubmit = async (data, e) => {
    if (isNewUser) {
      dispatch(registrationPending());
      console.log("Registrayion fails ", data);
      try {
        const response = await registerUser(data);
        console.log("bk", data);
        if (response.error) {
          // dispatch(registrationFailed(response));
          console.log("test", response?.error?.data?.payload);
          Swal.fire({
            icon: "error",
            title: response?.error?.data?.payload,
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "New User Added!",
            showConfirmButton: false,
            timer: 2000,
          });
          dispatch(registrationSuccess());
          reset();
          form.clearErrors();
          navigate("/home");
          refetchMatricess();
          refetchAllusers();
        }
      } catch (err) {
        dispatch(registrationFailed("An error occurred"));
      }
    } else {
      try {
        dispatch(userUpdatePending());
        const updatedData = {
          id,
          ...data,
        };
        console.log(id);
        const response = await updateUser({ updatedData, id });
        console.log("bk", updatedData);
        if (response.data.error && !response.data) {
          console.log("error log id ", id, updatedData);
          dispatch(userUpdateFailed(response.error.message));
          Swal.fire({
            icon: "error",
            title: "Update failed!",
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          console.log("succes  id ", id, updatedData);
          Swal.fire({
            icon: "success",
            title: "User Updated!",
            showConfirmButton: false,
            timer: 2000,
          });
          dispatch(userUpdateSuccess());
          reset();
          navigate("/home");
          refetchMatricess();
          refetchAllusers();
        }
      } catch (err) {
        dispatch(userUpdateFailed("An error"));
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
      dispatch(resetRegistrationStatus());
      dispatch(resetUserUpdateStatus());
    };
  }, [dispatch]);

  const onError = (errors) => {
    console.log("Form errors", errors);
  };

  return (
    <>
    <Navbar/>
    <div className="signin-main">
      <div className="signin-con">
        {isLoading ? (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ProgressBar
              height="80"
              width="80"
              barColor="#0000ff"
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
          <>
            <div className="signin-left">
              <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                { id ? (
                  <div className="signin-left-top">User Update</div>
                ) : (
                  <div className="signin-left-top">User Registration</div>
                )}
                <input
                  type="hidden"
                  id="roleId"
                  {...register("roleId")}
                  defaultValue={
                  userdata?.payload?.roleId
                  }
                />
                <div className="signin-left-mid">
                  <div className="signin-left-mid-input">
                    <span className="signin-input-con">
                      <FontAwesomeIcon
                        className="signin-input-icon"
                        icon={faUserAlt}
                      />
                      <input
                        className="signin-input"
                        type="text"
                        placeholder="First Name"
                        id="firstName"
                        {...register("firstName")}
                        defaultValue={ userdata?.payload?.firstName }
                      />
                    </span>
                    <p className="signin-error">{errors.firstName?.message}</p>
                  </div>
                  <div className="signin-left-mid-input">
                    <span className="signin-input-con">
                      <FontAwesomeIcon
                        className="signin-input-icon"
                        icon={faUser}
                      />
                      <input
                        className="signin-input"
                        type="text"
                        placeholder="Last Name"
                        id="lastName"
                        {...register("lastName")}
                        defaultValue={userdata?.payload?.lastName }
                      />
                    </span>
                    <p className="signin-error">{errors.lastName?.message}</p>
                  </div>
                  <div className="signin-left-mid-input">
                    <span className="signin-input-con">
                      <FontAwesomeIcon
                        className="signin-input-icon"
                        icon={faEnvelope}
                      />
                      <input
                        className="signin-input"
                        type="text"
                        placeholder="Email"
                        id="email"
                        {...register("email")}
                        defaultValue={ userdata?.payload?.email }
                      />
                    </span>
                    <p className="signin-error">{errors.email?.message}</p>
                  </div>
                  <div className="signin-left-mid-input">
                    <span className="signin-input-con">
                      <FontAwesomeIcon
                        className="signin-input-icon"
                        icon={faPhone}
                      />
                      <input
                        className="signin-input"
                        type="tel"
                        placeholder="Contact No."
                        id="contactNo"
                        {...register("contactNo")}
                        defaultValue={userdata?.payload?.contactNo }
                      />
                    </span>
                    <p className="signin-error">{errors.contactNo?.message}</p>
                  </div>
                  <div className="signin-left-mid-input">
                    <span className="signin-input-con">
                      <FontAwesomeIcon
                        className="signin-input-icon"
                        icon={faUserCircle}
                      />
                      <input
                        className="signin-input"
                        type="text"
                        placeholder="Username"
                        id="username"
                        {...register("username")}
                        defaultValue={userdata?.payload?.username }
                      />
                    </span>
                    <p className="signin-error">{errors.username?.message}</p>
                  </div>
                  <div className="signin-left-mid-input">
                    <div className="password-input-wrapper">
                      <FontAwesomeIcon
                        className="signin-input-icon"
                        icon={faLock}
                      />
                      <input
                        className="signin-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        id="password"
                        {...register("password")}
                      />
                      <span
                        className="password-toggle-icon"
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ?  faEye : faEyeSlash }
                        />
                      </span>
                    </div>
                    <p className="signin-error">{errors.password?.message}</p>
                  </div>
                  <span className="signin-input-con">
                    <FontAwesomeIcon
                      className="signin-input-icon"
                      icon={faUserTie}
                    />
                    <select
                      className="signin-input"
                      name="roleId"
                      {...register("roleId")}
                    >
                      <option disabled selected value="">
                        Role
                      </option>
                      <option value="1">Admin</option>
                      <option value="2">Doctor</option>
                      <option value="3">Nurse</option>
                    </select>
                  </span>
                  <p className="signin-error">{errors.roleId?.message}</p>
                  { id ? (
                    <button
                      className="signin-left-btn btn btn-primary"
                      type="submit"
                      // disabled={ !isValid || isSubmitting}
                    >
                       Update
                     </button>  
                  ) : (
                    <button
                    className="signin-left-btn btn btn-primary"
                    type="submit"
                    // disabled={ !isValid || isSubmitting}
                   >
                    Register
                    </button>
                  )}
                </div>
              </form>
              <DevTool control={control} />
            </div>
            <div className="signin-right">
              <div className="signin-right-img"></div>
              <div className="signin-right-bot">
                <div className="signin-right-logo"></div>
                <div className="signin-right-name">Vital Watch</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default UserRegistration;
