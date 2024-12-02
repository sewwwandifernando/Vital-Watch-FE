import React, { useState } from "react";
import { Icon } from "react-icons-kit";
import { lock } from "react-icons-kit/fa/lock";
import { person } from "react-icons-kit/iconic/person";
import { Link } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/scss/pages/Login.css";
import { useLoginUserMutation } from "../../store/api/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser(credentials);

      if (response.data && !response.data.error) {
        // Handle successful login
        const token = response.data.payload; // Assuming your token is in response.data.payload
        // Store the token in local storage
        localStorage.setItem("token", token);
        navigate("/home");
         
      } else {
        // Display login error message when the 'error' field is true
        console.log("error login", response);
        setLoginError(response.error.data.payload);
        console.log("error login", response.data);
      }
    } catch (error) {
      // Handle network or other errors (you can choose to log or not log these)
    }
  };

  return (
    <div className="login-main">
      <div className="login-con">
        <div className="login-left">
          <div className="login-image"></div>
          <div className="login-right-img"></div>
          <div className="login-right-con">
            <p>Vital watch.</p>
          </div>
        </div>
        <div className="login-right">
          <div className="login-right-top">
            <h1>Log In</h1>
          </div>
          <div className="login-right-mid">
            <div className="user-input">
              <input
                className="username-input"
                type="text"
                id="#"
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    username: event.target.value,
                  })
                }
                placeholder="Username"
              />
              <span className="login-icon">
                <Icon icon={person} />
              </span>
            </div>

            <div className="password-input">
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                id="#"
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  })
                }
                placeholder="Password"
              />
              <span className="login-icon">
                <Icon icon={lock} />
              </span>
              <span className="login-eye-icon">
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  onClick={togglePasswordVisibility}
                />
              </span>
            </div>
            {loginError && <div  style={{color:"red"}}>{loginError}</div>}
            <button className="btn btn-primary" onClick={handleLogin}>
              Log In
            </button>
            <Link to="">
              <p className="login-forgot-text">Forgot Password</p>
            </Link>
            {isLoading && <div>Loading...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
