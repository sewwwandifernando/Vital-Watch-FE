import React, { useState } from 'react';
import '../../assets/scss/components/Profilepopup.css'
import Profile from '../../assets/images/dummy-profile-_new.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark,faPen } from '@fortawesome/free-solid-svg-icons';
import MyProfile from './MyProfile'
import { useGetUserDataQuery } from "../../store/api/userListApi";
import { Navigate, useNavigate } from "react-router-dom";


function Profilepopup({ onClose }) {

  const { data: getuserdata, isLoading, isError } = useGetUserDataQuery();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {

    if (e.target.className === 'popup-overlay') {
      handleClose();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="profile-popup-main">
      <div className="profile-popup-main-top">
        <div className="profile-popup-cloce-icon">
          <FontAwesomeIcon icon={faXmark} onClick={onClose} />
        </div>
        <img className="profile-popup-pic" src={Profile} alt="Dummy-pic" />
        <div className="profile-popup-edit-icon">
          <FontAwesomeIcon icon={faPen} />
        </div>
      </div>
      <div className="profile-popup-main-mid-top">
        <p>{getuserdata.payload.firstName}  {getuserdata.payload.lastName}</p>
      </div>
      <div className="profile-popup-main-mid">
        <div className="profile-popup-main-mid-left">
          <div className="profile-popup-main-mid-left-con">
            <h1>Full Name</h1>
            <p>
              {getuserdata.payload.firstName}  {getuserdata.payload.lastName}
            </p>
          </div>
          <div className="profile-popup-main-mid-left-con">
            <h1>Email</h1>
            <p>{getuserdata.payload.email}</p>
          </div>
        </div>
        <div className="profile-popup-main-mid-right">
          <div className="profile-popup-main-mid-right-con">
            <h1>Role</h1>
            <p>{getuserdata.payload.role}</p>
          </div>
          <div className="profile-popup-main-mid-right-con">
            <h1>Contact</h1>
            <p>{getuserdata.payload.contactNo}</p>
          </div>
        </div>
      </div>
      <div className="profile-popup-main-btm">
        <div className="profile-popup-btm-edit">
          <button type="button" onClick={handleShow}>
            <p>Edit Profile</p>
          </button>
        </div>
        <div className="profile-popup-btm-singout">
          <button type="button" onClick={handleLogout}>
            <p>Sign Out</p>
          </button>
        </div>
      </div>
      {show && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup">
            <MyProfile onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profilepopup
