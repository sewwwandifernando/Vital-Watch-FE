// ChangePassword.js
import React from "react";
import "../../assets/scss/components/ChangePassword.css";
import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../../store/api/userListApi";

function ChangePassword({ onClose }) {
  const [changePassword] = useChangePasswordMutation();
  const form = useForm({
    mode: "onTouched",
  });

  const { register, handleSubmit, formState, reset } = form;
  const {  isDirty, isValid, isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    const response = await changePassword(data);

    console.log('password ' , data)
    console.log('password  ' , response)
    if (response.error) {
    } else {
      console.log('password sucsess ' , response?.data?.payload)
      event.preventDefault(); // Prevent default form submission behavior
      console.log("password", response);
      reset();
      onClose();
    } 
  };

  const onError = (errors) => {
    console.log("Form errors", errors);
  };

  return (
    <div className="changepass-main">
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <>
          <div className="changepass-top">
            <div className="changepass-top-box">
              <label>Old Password</label>
              <input
                type="text"
                id="oldPassword"
                {...register("oldPassword")}
              />
            </div>
            <div className="changepass-top-box new-password">
              <label>New Password</label>
              <input
                type="text"
                id="newPassword"
                {...register("newPassword")}
              />
            </div>
          </div>
          <div className="changepass-bot">
            <div className="cancel-but">
              <button onClick={onClose}>Cancel</button>
            </div>
            <div className="changepass-but">
              <button
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
              >
                Change Password
              </button>
            </div>
          </div>
        </>
      </form>
    </div>
  );
}

export default ChangePassword;
