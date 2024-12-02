// MyProfile.js
import React, { useState } from "react";
import "../../assets/scss/components/MyProfile.css";
import ChangePassword from "./ChangePassword";
import { Modal, Button } from "rsuite";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDataQuery } from "../../store/api/userListApi";
import { useUpdateUserMutation } from "../../store/api/userListApi";
import Swal from "sweetalert2";
import {
  userUpdatePending,
  userUpdateSuccess,
  userUpdateFailed,
  resetUserUpdateStatus,
} from "../../store/slices/userUpdateslice";

function MyProfile({ onClose }) {
  const {
    data: getuserdata,
    isLoading,
    isError,
    refetch: refetcDetails,
  } = useGetUserDataQuery();
  const id = getuserdata?.payload?.id;
  const [updateData] = useUpdateUserMutation(id);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();

  const form = useForm({
    mode: "onTouched",
  });
  const { register, handleSubmit, reset } = form;
  // const { errors, isDirty, isValid, isSubmitting, isSubmitSuccessful } = formState;
  // console.log("data", getuserdata);
  const onSubmit = async (data) => {
    try {
      dispatch(userUpdatePending());
      const updatedData = {
        id,
        ...data,
      };
      // console.log(id);
      console.log("updated", updatedData);
      const response = await updateData({ id, updatedData });
      if (response.data.error && !response.dat) {
        console.log("error log id ", id, updatedData);
        dispatch(userUpdateFailed(response.error.message));
        Swal.fire({
          icon: "error",
          title: "Update failed!",
          showConfirmButton: false,
          timer: 2500,
        });
        reset();
      } else {
        Swal.fire({
          icon: "success",
          title: "User Updated!",
          showConfirmButton: false,
          timer: 2000,
        });
        dispatch(userUpdateSuccess());
        reset();
        refetcDetails();
        onClose();
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
  };

  const onError = (errors) => {
    console.log("Form errors", errors);
  };

  return (
    <div className="myprof-main">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="myprof-top">
          <h1>My Profile</h1>
        </div>
        <div className="myprof-mid">
          <div className="myprof-mid-left">
            <div className="myprof-mid-box">
              <label>First Name</label>
              <input
                type="text"
                id="firstName"
                {...register("firstName")}
                defaultValue={ getuserdata?.payload?.firstName }
              ></input>
            </div>
            <div className="myprof-mid-box">
              <label>Email</label>
              <input
                type="text"
                id="email"
                {...register("email")}
                defaultValue={ getuserdata?.payload?.email }
              ></input>
            </div>
            <div className="myprof-mid-box">
              <label>Username</label>
              <input
                type="text"
                id="userName"
                {...register("userName")}
                defaultValue={ getuserdata?.payload?.username }
              ></input>
            </div>
          </div>
          <div className="myprof-mid-right">
            <div className="myprof-mid-box">
              <label>Last Name</label>
              <input
                type="text"
                id="lastName"
                {...register("lastName")}
                defaultValue={ getuserdata?.payload?.lastName }
              />
            </div>
            {/* <div className='myprof-mid-box'>
            <label>Date of Birth</label>
            <input type="text" />
          </div> */}
            <div className="myprof-mid-box">
              <label>Contact Number</label>
              <input
                type="text"
                id="contactNo"
                {...register("contactNo")}
                defaultValue={ getuserdata?.payload?.contactNo }
              />
            </div>
          </div>
        </div>
        <div className="myprof-bot">
          <div className="myprof-bot-left">
            <p onClick={handleOpen}>Change Password</p>
          </div>
          <div className="myprof-bot-right">
            <button className="myprof-save-but" type="submit">
              Save
            </button>
            <button onClick={onClose} className="myprof-cancel-but">
              Cancel
            </button>
          </div>
        </div>
      </form>
      {open && (
          <>
            <Modal open={open} onClose={handleClose} style={{ top: "100px" }}>
              <Modal.Header>
                <Modal.Title>
                  <h4 style={{paddingLeft:"30px"}}>Change Password</h4>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ChangePassword onClose={handleClose} />
              </Modal.Body>
            </Modal>
          </>
        )}
    </div>
  );
}

export default MyProfile;
