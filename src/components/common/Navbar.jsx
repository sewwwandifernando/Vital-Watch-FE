import React, { useState } from "react";
import "../../assets/scss/components/Navbar.css";
import { Link , Navigate, useNavigate } from "react-router-dom";
import image from "../../assets/images/dummy-profile-_new.jpg";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPowerOff, faRefresh } from "@fortawesome/free-solid-svg-icons";
import Profilepopup from "../user/Profilepopup";
import { useSelector } from "react-redux"; // Import useSelector
import { useDispatch } from "react-redux";
import { useGetUserDataQuery } from "../../store/api/userListApi";
import { ProgressBar } from "react-loader-spinner";

function Navbar() {
  const { data: getuserdata, isLoading, isError } = useGetUserDataQuery();
  
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target.className === "popup-overlay") {
      handleClose();
    }
  };
   const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
   };

  return (
    <div>
      <nav className="navbar">
        <Link to="/home" className="nav-title">
          VITAL WATCH
        </Link>
        <div className="nav-flex"></div>
        <div className="nav-user">
          <Menu
            menuButton={
              <MenuButton className="nav-user-menu">
                <img className="nav-img" src={image} alt="User Profile" />
                {/* Display the user role obtained from Redux */}
                <p className="nav-name">
                  {getuserdata &&
                    getuserdata.payload &&
                    getuserdata.payload.username}
                </p>
              </MenuButton>
            }
            transition
          >
            <MenuItem className="nav-user-menuitem" onClick={handleShow}>
              <FontAwesomeIcon className="nav-user-menu-icon1" icon={faUser} />
              View Profile
            </MenuItem>
              <MenuItem className="nav-user-menuitem" onClick={handleLogout}>
                <FontAwesomeIcon
                  className="nav-user-menu-icon2 "
                  icon={faPowerOff}
                />
                Log Out
              </MenuItem>
          </Menu>
        </div>
        {show && (
          <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className="popup">
              <Profilepopup onClose={handleClose} />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
